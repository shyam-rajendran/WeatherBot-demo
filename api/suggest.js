// api/suggest.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!geminiApiKey || !genAI) {
    return res
      .status(500)
      .json({ error: "GEMINI_API_KEY is not set in environment" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};

    const { city, country, weather } = body;

    if (!city || !weather) {
      return res.status(400).json({ error: "Missing city or weather in body" });
    }

    const { temp, feels_like, description, humidity, wind_speed } = weather;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a concise weather assistant.

Location: ${city}, ${country || ""}
Weather:
- Description: ${description}
- Temperature: ${temp} °C (feels like ${feels_like} °C)
- Humidity: ${humidity} %
- Wind speed: ${wind_speed} m/s

Give a VERY SHORT answer with:
1. One sentence summary of how it feels outside.
2. 2–3 bullet points of concrete advice about what to wear or carry (e.g. umbrella, light jacket, sunscreen, hat).
3. Optionally 1 simple activity suggestion if relevant (e.g. "short walk", "visit a café").

Rules:
- Max 3 bullets.
- No long paragraphs.
- Focus on useful, practical tips like "carry an umbrella", "wear a hat", "take a light jacket".
- Output in plain text, using bullets like "- ...".
`;

    const result = await model.generateContent(prompt);
    const text =
      result?.response?.text() || "No suggestion generated, please try again.";

    return res.status(200).json({ suggestions: text });
  } catch (err) {
    console.error("Gemini suggest API error:", err);
    const status = err.status || 500;
    const message =
      err.message || "Unexpected error while talking to Gemini API.";
    return res.status(status).json({
      error: "Server error",
      details: message,
    });
  }
}
