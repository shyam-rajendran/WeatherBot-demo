// api/weather.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini client (used to extract city names)
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

// Take any free-form text (EN/JA) and return just the city name
async function extractCityName(rawText) {
  if (!genAI || !rawText) return rawText;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // <- your chosen model
    });

    const prompt = `
You will receive user text that may be in ENGLISH or JAPANESE.
Goal: extract the MAIN CITY NAME to look up the weather for.

User text:
"${rawText}"

Requirements:
- Detect which city the user is asking about.
- Input can be full sentences, e.g.:
  - "what's the weather in Osaka right now?"
  - "今大阪の天気はどうですか？"
- Output ONLY the city name, in a standard ASCII/English form when possible:
  - "東京" -> "Tokyo"
  - "大阪" -> "Osaka"
- Do NOT add any other words, punctuation, or explanation.
- If you cannot identify a city, just repeat the input exactly as-is.
`;

    const result = await model.generateContent(prompt);
    const text = result?.response?.text()?.trim();

    if (!text) return rawText;
    return text;
  } catch (err) {
    console.error("City extraction error:", err);
    // If Gemini fails, just fall back to the original text.
    return rawText;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { city: rawCity } = req.query;

    if (!rawCity) {
      return res.status(400).json({ error: "Missing city parameter" });
    }

    const weatherKey = process.env.OPENWEATHER_API_KEY;
    if (!weatherKey) {
      return res
        .status(500)
        .json({ error: "OPENWEATHER_API_KEY not set" });
    }

    // 🔹 Key step: normalize free-form text → city name
    const resolvedCity = await extractCityName(rawCity);
    console.log("Raw city:", rawCity, "→ Resolved city:", resolvedCity);

    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.searchParams.set("q", resolvedCity);
    url.searchParams.set("appid", weatherKey);
    url.searchParams.set("units", "metric");

    const weatherRes = await fetch(url.toString());

    if (!weatherRes.ok) {
      const text = await weatherRes.text();
      return res
        .status(weatherRes.status)
        .json({ error: "Weather API error", details: text });
    }

    const data = await weatherRes.json();

    const simplified = {
      city: data.name,
      country: data.sys?.country,
      temp: data.main?.temp,
      feels_like: data.main?.feels_like,
      humidity: data.main?.humidity,
      wind_speed: data.wind?.speed,
      description: data.weather?.[0]?.description,
    };

    return res.status(200).json(simplified);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
}
