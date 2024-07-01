const dotenv = require('dotenv');
const express = require("express");
const path = require("path");
const cors = require("cors");
const https = require("https");
const selfsigned = require("selfsigned");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Generate self-signed certificates
const pems = selfsigned.generate(null, { days: 365 });

const privateKey = pems.private;
const certificate = pems.cert;

const credentials = { key: privateKey, cert: certificate };

app.post('/completions', async (req, res) => {
  const postData = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: req.body.message }],
    max_tokens: 3000,
  });

  const options = {
    hostname: 'api.openai.com',
    port: 443,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': postData.length,
    },
  };

  try {
    const request = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        res.send(JSON.parse(data));
      });
    });

    request.on('error', (error) => {
      console.error(error);
      res.status(500).send({ error: 'Failed to fetch data from OpenAI' });
    });

    request.write(postData);
    request.end();
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch data from OpenAI' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Catchall handler: For any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const port = process.env.PORT || 3001;

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`HTTPS Server listening on port ${port}`);
});
