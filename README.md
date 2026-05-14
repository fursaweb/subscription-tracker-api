# Subscription Tracker

Fullstack subscription management platform built with Node.js, TypeScript, Prisma, and PostgreSQL.

The project is designed to help users manage recurring subscriptions, track upcoming payments, analyze monthly spending, and monitor active services through a scalable REST API architecture.

## Features

- JWT authentication
- Refresh token sessions
- Secure session management
- Subscription CRUD operations
- Soft delete support
- Monthly spending analytics
- Upcoming renewals tracking
- Filtering, sorting, and pagination
- Multi-currency support
- Subscription categories
- Input validation with Zod
- RESTful API architecture
- Dockerized PostgreSQL database

---

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

### Authentication & Validation
- JWT
- bcrypt
- Zod

### Infrastructure & Tooling
- Docker
- Docker Compose
- Prisma Studio
- ts-node-dev

---

## Architecture Overview

The application follows a layered architecture approach:

- Controllers — request/response handling
- Services — business logic
- Middleware — authentication and validation
- Prisma ORM — database access layer
- PostgreSQL — persistent storage

Authentication is implemented using:
- short-lived access tokens
- refresh tokens with database-backed sessions
- token revocation support

---

## Main API Endpoints

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### User
- `GET /me`

### Subscriptions
- `GET /subscriptions`
- `POST /subscriptions`
- `PATCH /subscriptions/:id`
- `DELETE /subscriptions/:id`

### Analytics
- `GET /subscriptions/summary`
- `GET /subscriptions/monthly-spend`
- `GET /subscriptions/upcoming-renewals`

---

## Database Models

### User
- authentication credentials
- user sessions

### Session
- refresh token sessions
- expiration and revocation tracking

### Subscription
- subscription details
- billing cycle
- currency
- category
- status
- renewal dates

---

## Getting Started

### Prerequisites

- Node.js
- Docker
- PostgreSQL
- npm

---

## Installation

### Clone repository

```bash
git clone https://github.com/your-username/subscription-tracker.git
cd subscription-tracker
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/subtracker
JWT_SECRET=your_secret
PORT=3000
```

---

## Start PostgreSQL with Docker

```bash
docker run --name subtracker-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=subtracker \
  -p 5433:5432 \
  -d postgres:16
```

---

## Run database migrations

```bash
npx prisma migrate dev
```

---

## Start development server

```bash
npm run dev
```

---

## Prisma Studio

```bash
npx prisma studio
```

---

## Future Improvements

- Frontend dashboard with Next.js
- Open Banking integrations
- Subscription reminders & notifications
- Recurring payment forecasting
- Team/shared subscriptions
- SaaS billing integrations

---

## Project Goals

The project was created to practice and improve:
- backend architecture
- authentication flows
- scalable REST API development
- TypeScript backend development
- Prisma ORM workflows
- PostgreSQL data modeling
- Docker-based local development

---

## License

MIT