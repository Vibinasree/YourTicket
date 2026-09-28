# YourTicket.com

An event ticket booking platform built with **React**, **Spring Boot**, **PostgreSQL**, **Redis** and **Kafka**.
Users browse events, pick seats, and book them. The main engineering focus is **preventing double booking
when many users try to book the same seat at the same time**.

> Status: work in progress. See [Project Status](#project-status) for what is done and what is next.

## Screenshots


| Login | Event dashboard | Seat selection | Checkout |
|-------|-----------------|----------------|----------|
| ![login](docs/login.png) | ![dashboard](docs/dashboard.png) | ![seats](docs/seats.png) | ![checkout](docs/checkout.png) |


**Frontend (React + Vite)**
- Login and signup
- Event dashboard with search and category filter
- Dark mode toggle (settings gear icon)
- Multi-seat selection with a running total
- Checkout and payment confirmation page
- Highly graphic UI with a red color theme

**Backend (Spring Boot)**
- Events stored in PostgreSQL and served by `GET /api/events`
- User registration and login with BCrypt password hashing
- Seat booking design using Redis holds, Postgres row locks and Kafka events (see below)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, JavaScript |
| Backend | Java, Spring Boot |
| Database | PostgreSQL 17 |
| Cache / seat holds | Redis (Memurai on Windows) |
| Messaging | Apache Kafka (KRaft mode, no Zookeeper) |
| Security | Spring Security, BCrypt |

## Architecture

```
Browser (React + Vite)
      |  HTTP / JSON
      v
Spring Boot API
  Controller -> Service -> Repository -> PostgreSQL (source of truth)
                   |
                   +--> Redis  (temporary seat holds with expiry)
                   |
                   +--> Kafka  (SeatBookedEvent, published after DB commit)
```

### How double booking is prevented

1. **Redis soft hold:** when a user selects a seat, the app runs `SET seat:{eventId}:{seatId} {userId} NX EX 300`.
   `NX` means only one user can get the hold, and it expires automatically after 5 minutes.
2. **Postgres transaction (the real gate):** on confirm, one transaction locks the seat rows with
   `SELECT ... FOR UPDATE`, checks they are still available, marks them booked and saves the booking.
   If any seat is taken, the whole transaction rolls back.
3. **Kafka event after commit:** `SeatBookedEvent` is published only after the Postgres commit succeeds, so
   consumers never see a booking that was rolled back.

Redis makes the common case fast. Postgres guarantees correctness.

## Project Structure

```
YourTicket/
├── yourticket-backend/            Spring Boot API
│   └── src/main/java/com/yourticket/
│       ├── config/                Security, Redis, Kafka configuration
│       ├── controller/            REST controllers (AuthController, event endpoints)
│       ├── kafka/                 Kafka producer and consumer
│       ├── model/                 Entities
│       ├── repository/            Spring Data JPA repositories
│       └── service/               Business logic
└── yourticket-frontend/           React + Vite app
    └── src/
        ├── api/                   API calls
        └── pages/                 Login, dashboard, seat selection, checkout
```

## Prerequisites

- Java (JDK 17 or newer) and Maven
- Node.js (LTS) and npm
- PostgreSQL 17
- Redis-compatible server (Memurai on Windows, or Redis)
- Apache Kafka (KRaft mode)

## Getting Started

### 1. Clone

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd YourTicket
```

### 2. Database

Create the database in PostgreSQL:

```sql
CREATE DATABASE yourticket;
```

Set your credentials in `yourticket-backend/src/main/resources/application.properties`
(or `application.yml`):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/yourticket
spring.datasource.username=<your-db-user>
spring.datasource.password=<your-db-password>
```

> Do not commit real passwords. Use environment variables or a local, git-ignored config file.

### 3. Redis

Make sure Memurai (or Redis) is running on the default port `6379`.

### 4. Kafka (KRaft mode)

From your Kafka folder (for example `C:\kafka`), start the broker using your KRaft config
(check the exact script and config path for your Kafka version):

```bash
bin\windows\kafka-server-start.bat config\kraft\server.properties
```

### 5. Run the backend

```bash
cd yourticket-backend
mvn spring-boot:run
```

The API runs on `http://localhost:8080` by default.

### 6. Run the frontend

```bash
cd yourticket-frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## API (current)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List events |
| POST | `/api/auth/register` | Create an account (password stored as a BCrypt hash) |
| POST | `/api/auth/login` | Log in with email and password |

Seat hold and booking endpoints are planned (see below).

## Project Status

**Done**
- [x] React frontend: login/signup, dashboard, seat selection, checkout
- [x] Events stored in PostgreSQL and fetched via `GET /api/events`
- [x] PostgreSQL, Redis and Kafka (KRaft) set up locally
- [x] User entity, BCrypt hashing, register and login endpoints

**In progress**
- [ ] Connecting frontend login/signup to the real auth endpoints
- [ ] "Remember me" (persist login across page refresh)

**Planned**
- [ ] JWT-based stateless authentication
- [ ] Seats table and seat map API
- [ ] Redis seat holds (`SET NX EX`)
- [ ] Booking service with Postgres row lock and unique constraint
- [ ] Kafka `SeatBookedEvent` published after commit, with a consumer
- [ ] Concurrency test proving only one of many simultaneous requests gets a seat
- [ ] Transactional outbox for reliable event publishing
- [ ] Docker Compose for one-command setup
- [ ] Unit and integration tests

## Design Decisions

- **PostgreSQL** is the source of truth because booking needs ACID transactions and row locks.
- **Redis** holds are temporary and fast; they are not trusted for final correctness.
- **Kafka** decouples booking from side effects such as emails and analytics.
- **Kafka KRaft mode** removes the need for Zookeeper.

## Author

**Vibina Sree S**
GitHub: [github.com/Vibinasree](https://github.com/Vibinasree)
