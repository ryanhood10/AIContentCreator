# AIContentCreator
AIContentCreator is a web application that helps you generate and optimize social media posts. It uses OpenAI's ChatGPT to create relevant text content, DALLE-3 to generate images, and Google's Gemini AI to optimize posts for search engines.

## Live Application
You can access the live application here: https://ai-social-media-poster-a1f841196f5b.herokuapp.com/


## Features
#### Content Generation:
 Users are prompted to input various choices and text to create a prompt that is sent to ChatGPT. ChatGPT generates relevant text for the type of content post.
#### Image Generation: 
The application generates a DALLE-3 prompt to create a relevant image for the content post.
#### Post Optimization:
 Users can click the "Optimize Post" button to send the post to Google's Gemini AI for optimization for search engines.
#### Custom Image Prompt:
 Users can create a custom DALLE-3 prompt by clicking "Click Here" in the footnote, entering their custom prompt, and generating an image relevant to their content post.

## How to Run Locally

#### Clone the Repository:
git clone https://github.com/your-repo/AIContentCreator.git
cd AIContentCreator
#### Install Dependencies:
Navigate to both the server and client folders and run npm install.

cd server
npm install
cd ../client
npm install
#### Setup Environment Variables:
Create a .env file in the server directory with the following variables:

OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

#### Update API Calls for Local Development:
Change all API calls in the application to point to localhost instead of the live URL.

#### Run the Application:
Start the server and the client.

cd server
npm run start
cd ../client
npm run start

#### Access the Application:
Open your browser and navigate to http://localhost:3000 to use the application locally.

### Usage
Generate a Post:

Fill in the required fields to generate a prompt.
Click the "Generate Post" button.
View the generated text content.
Generate an Image:

Click the "Complete with DALLE-3 AI" button.
View the generated image.
Optimize Post:

Click the "Optimize Post with Gemini" button.
View the optimized post content.
Custom Image Prompt:

Click the "Click Here" link in the footnote.
Enter a custom DALLE-3 prompt.
Click the "Try Custom Prompt" button.
View the custom generated image.

### Contributions
Feel free to submit issues and pull requests for improvements and fixes. Any contributions are welcome!

### License
This project is licensed under the MIT License. See the LICENSE file for details.