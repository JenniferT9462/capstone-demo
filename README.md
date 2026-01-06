# Capstone Project: Full-Stack Microservice App

## Project Overview

This application is a full-stack capstone project designed to demonstrate advanced system architecture, secure API handling, and service orchestration. The app allows users to perform a single, clear workflow: **[Describe your feature, e.g., "Requesting a travel itinerary that combines stored user preferences with live weather data and AI suggestions"]**. The focus of this project is not on visual polish, but on the **intentional movement of data** across multiple isolated environments.

## Live Links

- **Frontend (Netlify):** [INSERT_YOUR_NETLIFY_URL_HERE]
- **Core API (Render):** [INSERT_YOUR_CORE_API_RENDER_URL_HERE]
- **Microservice API (Render):** [INSERT_YOUR_MICROSERVICE_RENDER_URL_HERE]

---
## How it's Made



The system is divided into **three** distinct layers to ensure clean separation of responsibilities and maximum security.

### 1. Frontend (The Client)

- **Tech:** React (deployed on Netlify).
- **Role:** Handles UI/UX and serves static assets.
- **Data Access:** 
    - Uses **Direct Supabase Access** for simple, non-sensitive read/write operations (e.g., fetching a list of items). 
    - Uses the **Core API** for any logic involving business rules, external data, or protected secrets.
- **Security:** Contains **zero** API keys or secrets (only the public Supabase anon key).

### 2. Core API (The Facade/Orchestrator)

- **Tech:** Express.js (deployed on Render).
- **Role:** The "Brain" of the application.
- **Logic:** It acts as the single entry point for complex requests. It reads from the database, calls the internal Microservice, and aggregates that data into a single JSON response for the frontend.

### 3. Microservice (The Vault)

- **Tech:** Express.js (deployed on Render).
- **Role:** Isolates third-party integrations (e.g., Weather API, OpenAI, or Google Maps).
- **Security:** This service is **not accessible by the frontend**. It only accepts requests from the Core API (Server-to-Server). It holds all sensitive environment variables and API keys.

---

## Why Use a Microservice?

Using a separate Microservice instead of putting everything in the Core API provides two major benefits:

1.  **Secret Isolation:** By keeping the external API keys in a service that never communicates with the public internet (the browser), we create a "hardened" layer that is much more difficult to exploit.
2.  **Modular Scalability:** If we decide to swap our external data provider (e.g., moving from one Weather API to another), we only update the Microservice. The Core API and Frontend remain completely unchanged, demonstrating a professional "decoupled" engineering approach.

---

## End-to-End User Flow

This project demonstrates the following data path:

![User Flow Diagram](/userFlow.png)

---

## Installation & Setup  

### Installation

1. Clone the repository
2. In the /capstone-demo-frontend, /capstone-demo-backend, and /microservice folders, run:

```bash
npm install
```

3. To run locally, start each service using `npm run dev` or `node index.js`.

### Environment Variables

You will need to set up `.env` files for the backend services.

**Core API (`/capstone-demo-backend/.env`):**

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_secret_service_key
MICROSERVICE_URL=your_deployed_microservice_url
```

**Microservice (`/microservice/.env`):**

```env
EXTERNAL_API_KEY=your_third_party_secret_key
PORT=3001
```



## Author



## Contributes

