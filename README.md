# IntelliDesk – AI-Powered Helpdesk

IntelliDesk is a modern helpdesk platform that uses AI to make customer support faster and smarter.
Instead of relying on manual triage, it automatically classifies tickets, suggests replies from the knowledge base, and even auto-closes issues when confidence is high.

It’s built with a MERN stack for the core app, a FastAPI worker for ticket triage, and Redis for async jobs and real-time updates.

# What it does

- Users can create and track tickets from a simple web UI.
- The system automatically classifies tickets (billing, tech, shipping, other).
- It pulls related KB articles and drafts a reply for the support agent.
- Admins can manage KB content and set automation rules (confidence thresholds, SLA hours).
- Real-time updates via WebSockets keep everyone in sync.
- Audit logs track the full lifecycle of each ticket.

# Tech Stack

- Frontend: React.js + Tailwind CSS
- Backend API: Node.js, Express.js, MongoDB
- Agent Worker: FastAPI (Python)
- Queue & Notifications: Redis + Socket.IO
- DevOps: Docker & Docker Compose

## Project Structure

smart-helpdesk-agentic/
├── client/ # React frontend
├── server/ # Express + Mongo API
├── agent/ # FastAPI worker for triage
├── seed/ # Database seed scripts
└── docker-compose.yml

## Getting Started

## 1. Clone the repo

git clone https://github.com/your-username/smart-helpdesk-agentic.git
cd smart-helpdesk-agentic

## 2. Environment variables

In `server/.env`:

MONGO_URI=mongodb://root:root@mongo:27017/helpdesk?authSource=admin
REDIS_URL=redis://redis:6379
JWT_SECRET=supersecret

## 3. Run everything with Docker

docker compose up --build

This starts:

- React client → `http://localhost:3000`
- Node API → `http://localhost:5000`
- FastAPI agent → `http://localhost:8000`
- MongoDB + Redis

Database seeds automatically with users, KB articles, and a few tickets.

## Try it out

- Login as:

  - `admin@test.com` (admin)
  - `agent@test.com` (agent)
  - `user@test.com` (user)

- Create a ticket (e.g. _“Error 403 when logging in”_).
- The agent worker classifies it as **tech**, fetches KB articles, and drafts a reply.
- If confidence is high enough → auto-close.
- If not → assigned to human.
