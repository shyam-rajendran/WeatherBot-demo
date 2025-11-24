# Weather Chatbot demo
Demo URL: https://weather-bot-demo.vercel.app/
<p align="center">
  <img width="373" height="510" alt="image" src="https://github.com/user-attachments/assets/07df9d6e-f699-41c5-92dc-76bb41eac7c3" />
  <img width="373" height="560" alt="Image" src="https://github.com/user-attachments/assets/aadeace6-0f7c-4351-a075-30ac683c919d" />
</p>
This project is built using a lightweight web stack optimized for fast performance, real-time interaction, and smooth deployment. It uses ReactJS with Vite as the foundational template and is deployed using Vercel.

## Frontend

React + Vite — Fast, modular frontend framework with lightning-quick dev server and optimized production builds.

Vanilla CSS (inline + basic styling) — Custom UI styled for a mobile-first weather chatbot experience.

Web Speech API — Enables real-time English/Japanese voice input, continuous listening, and auto-stop detection.

## APIs & AI

`OpenWeatherMap API` — Retrieves real-time weather data (temperature, conditions, humidity, wind, etc.) based on city name.

`Google Gemini 2.5 Flash API` — Generates activity suggestions and useful weather-related advice (umbrella, sunscreen, etc.) using structured weather inputs.

Gemini NLU prompt — Extracts city names from voice/text queries in both English and Japanese.

## Backend / Serverless

Vercel Serverless Functions

`/api/weather` for weather retrieval

`/api/suggest` for AI-generated recommendations

Handles API key security and response shaping.

## Deployment

Vercel handles the hosting and the deployment. Every GitHub push automatically triggers a new build and deployment.
Environment variable for the API keys were defined within the vercel deployment settings.


## Figma Mockups
The initial UI designs were explored in Figma. The initial idea was very rough and contained a dedicated chat section which further along the iterations got divided into two separate sections; one for the weather card and other for the suggestions. This was a very quick design, so it's not refined at all. But you can see the 3 design iterations that I went through. 

<img width="1678" height="920" alt="image" src="https://github.com/user-attachments/assets/a7cb93a6-a481-415c-825e-516b0717f11d" />





