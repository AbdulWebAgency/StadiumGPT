<p align="center">
<img width="140" height="35" alt="Image" src="https://github.com/user-attachments/assets/db19a36d-051b-4944-bd41-606bfeb10ff7" />
</p>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Firebase](https://img.shields.io/badge/Firebase-Cloud-FFCA28?logo=firebase) ![Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-4285F4?logo=google) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel) 
![License](https://img.shields.io/badge/License-Hackathon-success)



### AI-Powered Stadium Companion for the FIFA World Cup 2026

StadiumGPT is an AI-powered stadium companion designed to enhance the fan experience during the FIFA World Cup 2026. It provides personalized navigation, accessibility-first recommendations, emergency assistance, facility discovery, and intelligent conversations using Google's Gemini 2.5 Flash AI.

Built as a solo project for Google's Prompt War.

---

## 🌐 Live Demo

🔗 https://stadiumgpt.vercel.app

---

## 📂 GitHub Repository

🔗 https://github.com/AbdulWebAgency/StadiumGPT

---
# 🎯 Hackathon Submission Details

# Chosen Vertical
Sports Technology / AI for Fan Experience:
StadiumGPT focuses on enhancing the FIFA World Cup 2026 match-day experience by using Generative AI to provide personalized navigation, accessibility support, emergency guidance, and intelligent stadium assistance.

---
# Approach & Logic
The project combines a React frontend, Firebase authentication, persistent user memory, and Google's Gemini 2.5 Flash API to create a personalized stadium companion.

Instead of providing generic answers, StadiumGPT considers each fan's profile—including accessibility requirements, dietary preferences, language, group size, and navigation style—to generate recommendations tailored to their needs. Every recommendation is accompanied by a Personalized Reasoning section so users understand why it was suggested.

---
# How the Solution Works
1. Users complete a short onboarding process.
2. Preferences are stored using Firebase and local memory.
3. User queries are sent to Gemini 2.5 Flash along with the current stadium context.
4. The AI generates personalized recommendations for navigation, food, facilities, emergency support, and stadium services.
5. Responses are presented with clear reasoning and accessibility-focused guidance.

---
# Assumptions Made
1. Stadium layouts, gates, facilities, and crowd density are simulated for demonstration purposes.
2. Real-time crowd analytics and GPS navigation are represented using mock data.
3. Emergency guidance follows predefined prototype workflows rather than live emergency services.
4. The application demonstrates the AI workflow and user experience intended for deployment at large sporting events.

---
# ✨ Features

- 🤖 AI Stadium Companion powered by Gemini 2.5 Flash
- 🧠 Persistent User Memory
- 💬 Personalized AI Reasoning
- ♿ Accessibility-First Navigation
- 🗺️ Interactive Stadium Route Map
- 🍔 Personalized Food Recommendations
- 🚨 Emergency SOS Assistant
- 📦 Lost & Found Portal
- 🔊 Speech Synthesis for Accessibility
- 🌍 Multi-language Support
- 🔐 Firebase Authentication
- 📱 Mobile Responsive Design
- ✅ Automated Unit Testing with Vitest

---

# 🧠 AI Capabilities

StadiumGPT adapts its responses based on the user's preferences and stadium context.

It understands:

- Accessibility requirements
- Dietary restrictions
- Preferred navigation style
- Group size
- Language preference

Instead of simply answering questions, StadiumGPT explains **why** each recommendation fits the user's needs through a dedicated Personalized Reasoning section.

---

# 🏟️ Example Use Cases

### Finding Accessible Routes

> "I'm using a wheelchair. What's the easiest way to Gate A?"

---

### Food Recommendations

> "Recommend halal food with low waiting times."

---

### Emergency Guidance

> "I don't feel well."

---

### Lost & Found

> Report or locate lost belongings inside the stadium.

---

### Stadium Navigation

> "What's the least crowded route to my section?"

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend & Cloud

- Firebase Authentication
- Firebase Firestore

## Artificial Intelligence

- Google Gemini 2.5 Flash API

## Deployment

- Vercel

---
## Running Tests

This project uses Vitest for automated unit testing.

Run the test suite:

```bash
npm test
```

Current automated unit tests verify:

- Navigation accessibility mapping
- Lost & Found matching engine
- Core business logic utilities

---
# 🧩 Project Architecture

```
User
   │
   ▼
React Frontend
   │
   ├── Firebase Authentication
   │
   ├── Firestore
   │
   ├── User Memory
   │
   ▼
Gemini 2.5 Flash API
   │
   ▼
Personalized AI Responses
```

---

# 📱 Core Modules

- AI Companion
- Interactive Stadium Map
- Facility Recommendations
- Lost & Found
- Emergency SOS
- Accessibility Settings
- User Context Panel

---

# 🚀 Running Locally

Clone the repository

```bash
git clone https://github.com/AbdulWebAgency/StadiumGPT.git
```

Navigate into the project

```bash
cd StadiumGPT
```

Install dependencies

```bash
npm install
```

Create a `.env` file containing:

```env
VITE_GEMINI_API_KEY=YOUR_KEY

VITE_FIREBASE_API_KEY=...

VITE_FIREBASE_AUTH_DOMAIN=...

VITE_FIREBASE_PROJECT_ID=...

VITE_FIREBASE_STORAGE_BUCKET=...

VITE_FIREBASE_MESSAGING_SENDER_ID=...

VITE_FIREBASE_APP_ID=...
```

Run the project

```bash
npm run dev
```

---

# 📸 Screenshots

<img width="1278" height="617" alt="Image" src="https://github.com/user-attachments/assets/dec5484f-3578-48d0-914e-cebe6627ef02" />
<img width="1268" height="629" alt="Image" src="https://github.com/user-attachments/assets/e9b4fe2f-d91b-4b9c-962c-d2d4d4090c49" />
<img width="1273" height="636" alt="Image" src="https://github.com/user-attachments/assets/d2cf18d1-b081-410b-a33b-f230af45485b" />
<img width="1279" height="635" alt="Image" src="https://github.com/user-attachments/assets/47788664-f994-4819-b311-18ee1a330600" />
<img width="1275" height="619" alt="Image" src="https://github.com/user-attachments/assets/8f14d5b5-cfda-47d2-83d9-e53dbc5077fd" />
<img width="1280" height="622" alt="Image" src="https://github.com/user-attachments/assets/1167fea5-ae31-4d6b-b2d7-def14b3ee54b" />

---

# 🔮 Future Improvements

- Live crowd density integration
- Indoor GPS navigation
- Live event notifications
- Ticket integration
- Real-time public transport guidance
- AI multilingual voice conversations
- Stadium analytics dashboard

---

# 👨‍💻 Author

**Abdul Rahim**

Solo Project

GitHub:
https://github.com/AbdulWebAgency

---

# 🙏 Acknowledgements

- Google Gemini API
- Firebase
- React
- Vercel
- FIFA World Cup 2026 (concept inspiration)

---

# 📄 License

This project was created for educational and hackathon purposes.
