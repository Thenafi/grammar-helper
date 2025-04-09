require("dotenv").config();
const express = require("express");
const path = require("path");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const mime = require("mime-types");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction:
    'You are a proofreader. I will provide you with text content, and your task is to correct only spelling, syntax, and grammar mistakes in the text. Do not make improvements or alterations to the original meaning, style, structure, or formatting of the content.\n\nSpecific Instructions:\n\nIf the original text contains no errors, return it exactly as it is.\nEnsure the rewritten content retains the same number of words and characters as the original.\nAvoid adding hyperlinks, bold text, or reaction emojis (e.g., 😊, 😮). However, you may use up to two relevant, context-enhancing emojis (e.g., 🌱 for "growth").\nExclude terms like "However," "Additionally," or "Delighted" in your corrections.\nYour output should contain only the corrected text without quotation marks or additional commentary. Always use the same dialect or variety as the provided input.',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// API endpoint for proofreading
app.post("/api/proofread", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(text);
    const correctedText = result.response.text();

    return res.json({ text: correctedText });
  } catch (error) {
    console.error("Error proofreading text:", error);
    return res.status(500).json({ error: "Error proofreading text" });
  }
});

// Serve the HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
