# Expense Tracker

A full-stack personal expense tracker with a **Java (Spring Boot)** backend and **React** frontend.

## Quick Start

### Prerequisites

- Java 17+ (`java --version`)
- Node.js 18+ (`node --version`)

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

> No Maven installation needed — the included Maven Wrapper (`mvnw`) handles it.

Runs on **http://localhost:4000**. SQLite database is created automatically at `backend/data/expenses.db`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on **http://localhost:5173**. Open in your browser.

### Run Tests

```bash
cd backend
./mvnw test
```

---

## API

### POST /expenses

Create an expense. Supports idempotency via `idempotencyKey`.

```json
{
  "amount": 150.50,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-04-23",
  "idempotencyKey": "unique-client-key"
}
```

- Returns `201 Created` on success.
- Returns `200 OK` with the existing record if the `idempotencyKey` was already used.

### GET /expenses

List expenses. Optional query parameters:

| Param      | Description                    |
|------------|--------------------------------|
| `category` | Filter by exact category match |
| `sort`     | `date_desc` for newest first   |

Example: `GET /expenses?category=Food&sort=date_desc`

---

## Design Decisions

### Why SQLite?

Simple, zero-config, file-based. Perfect for a single-user personal finance tool. No separate database server to install or manage. Easy to back up (copy one file). Upgradeable to PostgreSQL later by swapping the JPA dialect and driver.

### Money as Integer Cents

Amounts are stored as `amount_cents` (integer) in the database to avoid floating-point precision issues. The API accepts/returns decimal `amount` values and converts internally. This is standard practice for financial data.

### Idempotency

The client sends an `idempotencyKey` with each POST. The backend stores it in a unique column. If a duplicate key arrives (network retry, double-click), the existing record is returned instead of creating a duplicate. This handles:

- Double-click on submit button
- Browser refresh after submission
- Network retry on timeout

### Validation

- **Backend**: Jakarta Bean Validation (`@NotNull`, `@Positive`, `@NotBlank`) on the request DTO. Returns 400 with field-level error messages.
- **Frontend**: Client-side checks before submission (positive amount, required date). The form button is disabled while submitting to prevent double-clicks.

### Project Structure

```
expense-tracker/
├── backend/                    # Spring Boot + SQLite
│   ├── src/main/java/com/expensetracker/
│   │   ├── controller/         # REST endpoints
│   │   ├── dto/                # Request/response objects
│   │   ├── model/              # JPA entity
│   │   └── repository/         # Spring Data JPA
│   └── src/test/               # Integration tests
└── frontend/                   # React + Vite
    └── src/
        ├── components/         # Form, List, Filters, Summary
        ├── api.js              # API client
        └── App.jsx             # Main app with state management
```

### Nice-to-Haves Implemented

- ✅ Input validation (backend + frontend)
- ✅ Summary view (total + per-category breakdown)
- ✅ Integration tests (2 tests: CRUD + idempotency, validation)
- ✅ Error and loading states in UI
