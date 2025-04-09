# Grammar Helper

A simple web application that helps proofread text using Google's Gemini AI. The application automatically proofreads text after 3 seconds of inactivity and copies the corrected text to your clipboard.

## Features

- Automatically focuses on the text area when the page loads
- Automatically proofreads text after 3 seconds of inactivity
- Automatically copies corrected text to clipboard
- Simple and intuitive user interface
- Real-time status updates

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```
4. Start the server: `npm start`
5. Open your browser and navigate to `http://localhost:3000`

## How to Use

1. Open the application in your browser
2. Paste your text into the text area
3. Wait 3 seconds for automatic proofreading or click the "Proofread" button
4. The corrected text will be automatically copied to your clipboard

## Technologies Used

- Node.js
- Express.js
- Google Gemini AI
- HTML/CSS/JavaScript

## License

ISC
