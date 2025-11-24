
# Weather Chatbot demo

This project is built using a lightweight web stack optimized for fast performance, real-time interaction, and smooth deployment:

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

Vercel — Fully managed hosting + CI/CD. Every GitHub push automatically triggers a new build and deployment.

Automatic environment variable management for API keys.
## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express


## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

