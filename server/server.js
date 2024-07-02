require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');  // Import node-fetch version 2

const gemini_api_key = process.env.GEMINI_API_KEY;
if (!gemini_api_key) {
  console.error('Gemini API key is not set in the environment variables.');
  process.exit(1);
}

const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const app = express();

app.use(express.json());
app.use(cors());

// Axios instance for OpenAI API requests
const openaiAxios = axios.create({
  baseURL: 'https://api.openai.com',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

app.post('/completions', async (req, res) => {
  const postData = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: req.body.message }],
    max_tokens: 3000,
  };

  try {
    const response = await openaiAxios.post('/v1/chat/completions', postData);
    res.send(response.data);
  } catch (error) {
    console.error('Error in /completions route:', error);
    res.status(500).send({ error: 'Failed to fetch data from OpenAI' });
  }
});

app.post('/dalleCompletion', async (req, res) => {
  const { dallePrompt, imageSize } = req.body;

  const postData = {
    model: 'dall-e-3',
    prompt: dallePrompt,
    n: 1,
    size: imageSize ? imageSize : '1024x1024',
  };

  try {
    const response = await openaiAxios.post('/v1/images/generations', postData);
    const imageUrl = response.data.data[0].url;

    res.json({ imageUrl });
  } catch (error) {
    console.error('Failed to fetch image from DALL-E:', error);
    res.status(500).json({ error: 'Failed to fetch image from DALL-E' });
  }
});

app.post('/geminiCompletion', async (req, res) => {
  try {
    console.log('Received request for Gemini completion');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const prompt = req.body.message;

    if (!prompt) {
      console.error('No message provided in the request body');
      return res.status(400).send({ error: 'No message provided in the request body' });
    }

    console.log('Gemini API Key:', gemini_api_key);
    console.log('Gemini Config:', geminiConfig);

    const geminiModel = googleAI.getGenerativeModel({
      model: 'gemini-pro',
      geminiConfig,
    });

    console.log('Generating content for prompt:', prompt);
    const result = await geminiModel.generateContent(prompt, { fetch });
    const response = await result.response.text();

    console.log('Response from Gemini:', response);
    res.send({ text: response });
  } catch (error) {
    console.error('Error in /geminiCompletion route:', error);
    res.status(500).send({ error: 'Failed to fetch data from Gemini' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Catchall handler: For any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
