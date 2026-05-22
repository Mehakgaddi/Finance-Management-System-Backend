# Finance Management System — Complete Interview Preparation Guide

---

## 1. PROJECT OVERVIEW (30-second pitch)

> "I built a full-stack personal finance management web application. Users can track income and expenses, set monthly budgets, get AI-powered financial insights using Google's Gemini API, and chat with an AI financial assistant. The app sends automatic email alerts when users exceed their budget. It's deployed with the frontend on Vercel, backend on Render, and database on Railway (MySQL)."

---

## 2. TECH STACK — What I Used and WHY

### Frontend
| Technology | Why I chose it |
|---|---|
| **React.js** | Component-based architecture makes UI reusable and maintainable. Large ecosystem, fast rendering with virtual DOM. |
| **Create React App (CRA)** | Zero-config setup. Good for projects where you want to focus on features, not build configuration. |
| **React Router DOM v6** | Client-side routing — navigating between pages without full page reloads. |
| **Axios** | Better than fetch — automatic JSON parsing, interceptors for adding auth tokens to every request, better error handling. |
| **Recharts** | Simple, declarative chart library built for React. Used for income vs expense pie charts and category bar charts. |
| **CSS with Glassmorphism** | Custom dark theme with `backdrop-filter: blur()` for a modern, professional look without a heavy UI library. |

### Backend
| Technology | Why I chose it |
|---|---|
| **Node.js** | JavaScript on the server — same language as frontend, non-blocking I/O handles many concurrent requests efficiently. |
| **Express.js** | Minimal, unopinionated web framework. Easy to set up REST APIs, middleware, and routing. |
| **Sequelize ORM** | Lets me write JavaScript instead of raw SQL. Handles table creation, relationships, and queries. Prevents SQL injection. |
| **MySQL** | Relational database — perfect for structured financial data with clear relationships (users → transactions, users → budgets). |
| **JWT (jsonwebtoken)** | Stateless authentication — no session storage needed on server. Token contains user ID, verified on every request. |
| **bcryptjs** | Industry-standard password hashing. Never store plain text passwords. Salt rounds = 10 (good balance of security vs speed). |
| **Nodemailer** | Send emails from Node.js. Used for overspending alerts. |
| **CORS** | Controls which origins can call the API. Essential for security when frontend and backend are on different domains. |
| **dotenv** | Keeps secrets (DB passwords, API keys) out of the codebase. |

### AI & External Services
| Technology | Why I chose it |
|---|---|
| **Google Gemini API** | Free tier available, powerful language model, good for financial advice generation. Used `gemini-2.5-flash` for insights and `gemini-1.5-flash-latest` for chatbot. |
| **Firebase Firestore** | Real-time NoSQL database used as a **backup layer**. If MySQL goes down, data is still safe in Firebase. |

### Deployment
| Service | What it hosts | Why |
|---|---|---|
| **Vercel** | React frontend | Free, auto-deploys from GitHub, optimized for frontend apps, global CDN. |
| **Render** | Node.js backend | Free tier for Node.js apps, auto-deploys from GitHub, supports environment variables. |
| **Railway** | MySQL database | Managed MySQL in the cloud, easy connection string, free tier available. |

---

## 3. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                                                              │
│   React App (Vercel CDN)                                     │
│   localhost:3001 (local dev)                                 │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS requests
                       │ Authorization: Bearer <JWT token>
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS.JS BACKEND (Render)                     │
│              https://finance-...onrender.com                 │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   CORS   │→ │  Input   │→ │   JWT    │→ │  Route   │   │
│  │Middleware│  │Validation│  │  Auth    │  │ Handler  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  Routes:                                                     │
│  /api/auth        → authController                          │
│  /api/transactions → transactionController                  │
│  /api/budget      → budgetController                        │
│  /api/ai          → aiController                            │
│  /api/chatbot     → chatbotController                       │
│  /api/reports     → reportController                        │
│  /api/analytics   → reportsController                       │
└──────┬──────────────────────────┬────────────────────────────┘
       │                          │
       ▼                          ▼
┌─────────────┐          ┌──────────────────┐
│   MySQL DB  │          │  External APIs   │
│  (Railway)  │          │                  │
│             │          │ ┌──────────────┐ │
│  Users      │          │ │ Gemini API   │ │
│  Transactions│         │ │ (AI insights)│ │
│  Budgets    │          │ └──────────────┘ │
└─────────────┘          │ ┌──────────────┐ │
       │                 │ │  Firebase    │ │
       │                 │ │  (backup)    │ │
       │                 │ └──────────────┘ │
       │                 │ ┌──────────────┐ │
       │                 │ │  Nodemailer  │ │
       │                 │ │  (Gmail)     │ │
       │                 │ └──────────────┘ │
       │                 └──────────────────┘
       │
       ▼
┌─────────────┐
│  Firebase   │
│  Firestore  │
│  (backup)   │
└─────────────┘
```

---

## 4. DATABASE DESIGN — ER DIAGRAM

```
┌─────────────────────┐
│        Users        │
├─────────────────────┤
│ id (PK, AUTO_INC)   │
│ name (VARCHAR)      │
│ email (VARCHAR,UNIQ)│
│ password (VARCHAR)  │
│ createdAt           │
│ updatedAt           │
└──────────┬──────────┘
           │ 1
           │
           │ has many
           │
    ┌──────┴──────────────────────────────┐
    │                                     │
    ▼ many                                ▼ many
┌─────────────────────┐      ┌─────────────────────┐
│    Transactions     │      │       Budgets        │
├─────────────────────┤      ├─────────────────────┤
│ id (PK, AUTO_INC)   │      │ id (PK, AUTO_INC)   │
│ title (VARCHAR)     │      │ monthlyLimit (FLOAT) │
│ amount (FLOAT)      │      │ month (VARCHAR)      │
│ type (ENUM)         │      │ emailSent (BOOLEAN)  │
│   'income'          │      │ userId (FK → Users)  │
│   'expense'         │      │ createdAt            │
│ category (VARCHAR)  │      │ updatedAt            │
│ date (DATEONLY)     │      └─────────────────────┘
│ userId (FK → Users) │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘
```

### Relationships
- **User → Transactions**: One-to-Many. One user can have many transactions. Each transaction has a `userId` foreign key.
- **User → Budgets**: One-to-Many. One user can have one budget per month (enforced in code, not DB constraint).

### Why DATEONLY for transaction date?
Because we only care about the date (2024-01-15), not the time. Using `DATEONLY` avoids timezone conversion issues that `DATETIME` would cause.

### Why ENUM for transaction type?
Restricts values to only `'income'` or `'expense'` at the database level. Prevents invalid data even if validation middleware is bypassed.

---

## 5. API ENDPOINTS — Complete Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Auth Required | What it does |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create new user account |
| POST | `/api/auth/login` | No | Login, returns JWT token |
| GET | `/api/auth/profile` | Yes | Get logged-in user's info |
| PUT | `/api/auth/update-password` | Yes | Change password |
| POST | `/api/auth/refresh-token` | Yes | Get new JWT token |

### Transactions (`/api/transactions`)
| Method | Endpoint | Auth Required | What it does |
|---|---|---|---|
| POST | `/api/transactions` | Yes | Add new transaction |
| GET | `/api/transactions` | Yes | Get all user's transactions |
| DELETE | `/api/transactions/:id` | Yes | Delete a transaction |

### Budget (`/api/budget`)
| Method | Endpoint | Auth Required | What it does |
|---|---|---|---|
| POST | `/api/budget/set` | Yes | Set/update monthly budget |
| GET | `/api/budget/get` | Yes | Get current month's budget |

### AI & Chatbot
| Method | Endpoint | Auth Required | What it does |
|---|---|---|---|
| GET | `/api/ai/insights` | Yes | Get Gemini AI financial insights |
| POST | `/api/chatbot/message` | Yes | Send message to AI chatbot |

### Reports & Analytics
| Method | Endpoint | Auth Required | What it does |
|---|---|---|---|
| POST | `/api/reports/download` | Yes | Download PDF report |
| POST | `/api/reports/email` | Yes | Email PDF report |
| GET | `/api/analytics/spending` | Yes | Get spending analytics data |

---

## 6. AUTHENTICATION FLOW — How JWT Works

```
SIGNUP:
User fills form → Frontend validates → POST /api/auth/signup
→ Backend validates input → Check email not taken (case-insensitive)
→ bcrypt.hash(password, 10) → Save to DB → Return success

LOGIN:
User fills form → POST /api/auth/login
→ Backend: LOWER(email) lookup in DB (handles old mixed-case emails)
→ bcrypt.compare(enteredPassword, hashedPassword)
→ If match: jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' })
→ Return token + user info
→ Frontend: localStorage.setItem('token', token)

PROTECTED REQUEST:
Frontend: axios interceptor adds header → Authorization: Bearer <token>
→ Backend authMiddleware: jwt.verify(token, JWT_SECRET)
→ If valid: req.userId = decoded.id → next()
→ If expired: return 401 { code: 'TOKEN_EXPIRED' }
→ Frontend interceptor catches TOKEN_EXPIRED → calls refresh-token endpoint
→ If refresh succeeds: retry original request with new token
→ If refresh fails: clear localStorage → redirect to login
```

### Why JWT over Sessions?
- **Stateless** — server doesn't store session data, scales horizontally
- **Self-contained** — token carries user ID, no DB lookup needed for auth
- **Works across domains** — frontend on Vercel, backend on Render, no cookie issues

### Why bcrypt with salt rounds = 10?
- Salt rounds = 10 means 2^10 = 1024 iterations of hashing
- Makes brute force attacks extremely slow
- Even if DB is compromised, passwords can't be reversed
- Salt is random per password — same password hashes differently each time

---
<!--  -->
## 7. MIDDLEWARE PIPELINE — Request Flow

Every request goes through this pipeline:

```
Request arrives
      ↓
1. CORS Middleware
   - Checks if origin is allowed (*.vercel.app, localhost:3000/3001/3002)
   - Blocks requests from unknown origins
      ↓
2. express.json()
   - Parses JSON request body
   - Makes req.body available
      ↓
3. Route matching
   - Express finds the matching route
      ↓
4. Input Validation Middleware (on specific routes)
   - validateSignup / validateLogin / validateTransaction
   - Checks required fields, formats, lengths
   - Normalizes email to lowercase
   - Returns 400 if invalid
      ↓
5. Auth Middleware (protect) — on protected routes
   - Extracts Bearer token from Authorization header
   - jwt.verify() — checks signature and expiry
   - Sets req.userId for controllers to use
   - Returns 401 if invalid/expired
      ↓
6. Controller
   - Business logic
   - DB queries via Sequelize
   - Returns response
      ↓
7. Error Handler Middleware (at the end)
   - Catches any unhandled errors
   - Returns consistent error format
```

---

## 8. KEY FEATURES — How Each One Works

### Feature 1: Transaction Management
- User adds title, amount, type (income/expense), category, date
- Backend validates all fields via `validateTransaction` middleware
- Saved to MySQL via `Transaction.create()`
- **Simultaneously** backed up to Firebase Firestore (non-blocking — uses `.catch()` so failure doesn't affect main response)
- After adding expense: `checkAndNotifyOverspending()` runs in background

### Feature 2: Budget & Overspending Alert
- User sets `monthlyLimit` for current month
- Budget stored with `month: "2024-01"` format — one budget per month per user
- Every time an expense is added, `budgetService.checkAndNotifyOverspending()` runs:
  1. Fetches current month's budget
  2. Sums all expenses for current month using DB date filter
  3. If `currentSpending > monthlyLimit` AND `emailSent === false`:
     - Sends email via Nodemailer (Gmail SMTP)
     - Sets `emailSent = true` to prevent duplicate emails
  4. If spending drops back under budget: resets `emailSent = false`

### Feature 3: AI Financial Insights (Gemini API)
- Fetches all user transactions from DB
- Calculates: totalIncome, totalExpense, balance, savingsRate, top 3 spending categories
- Builds a prompt: *"You are a financial advisor. Give 3 bullet-point insights based on: Income ₹X, Expenses ₹Y..."*
- Sends to `gemini-2.5-flash` model
- **Fallback**: If Gemini API fails, generates rule-based insights locally (no API needed)

### Feature 4: AI Chatbot
- User types a financial question
- Backend sends to `gemini-1.5-flash-latest` with system prompt: *"You are a helpful financial advisor chatbot..."*
- **Fallback**: Rule-based keyword matching if API unavailable
- Protected endpoint — requires JWT token (prevents API quota abuse)

### Feature 5: PDF Reports
- Backend uses `pdfkit` to generate PDF in memory
- Includes: transaction list, totals, budget status
- Sent as binary blob to frontend (responseType: 'blob')
- Frontend creates a download link and triggers click

### Feature 6: Firebase Backup
- Every transaction add/delete is mirrored to Firebase Firestore
- Structure: `users/{userId}/transactions/{autoId}`
- Non-blocking — Firebase failure never breaks the main MySQL operation
- Provides data redundancy

---

## 9. FRONTEND ARCHITECTURE

### Folder Structure
```
src/
├── pages/          → Full page components (one per route)
│   ├── Login_IMPROVED.jsx
│   ├── Signup.jsx
│   ├── Dashboard_IMPROVED.jsx
│   ├── TransactionsPage.jsx
│   ├── BudgetPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── AIInsightsPage.jsx
│   ├── ChatbotPage.jsx
│   └── Profile.jsx
├── components/     → Reusable UI components
│   ├── Layout.jsx      → Wraps all protected pages (sidebar + header)
│   ├── Sidebar.jsx     → Collapsible navigation
│   ├── Header.jsx      → Top bar
│   ├── TransactionForm.jsx
│   ├── TransactionList.jsx
│   ├── TransactionFilter.jsx
│   ├── BudgetForm.jsx
│   ├── BudgetStatus.jsx
│   ├── Charts.jsx      → Recharts pie + bar charts
│   ├── AIInsights.jsx
│   ├── Chatbot.jsx
│   ├── SpendingReport.jsx
│   └── ReportButtons.jsx
├── services/
│   ├── api.js          → Axios instance + all API functions
│   └── reportApi.js    → PDF download + email functions
└── utils/
    └── validation.js   → Frontend form validation functions
```

### Why Centralized API (api.js)?
Instead of writing `axios.get('http://...')` in every component:
- Single place to change the base URL
- Axios interceptor automatically adds `Authorization: Bearer <token>` to every request
- Interceptor handles `TOKEN_EXPIRED` — silently refreshes token and retries
- All components just call `API.get('/transactions')` — clean and simple

### Protected Routes
```jsx
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? (
    <Layout onLogout={handleLogout}>{children}</Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}
```
If no token → redirect to login. If token exists → render page inside Layout.

### Responsive Design
- **Desktop**: Fixed sidebar (250px), collapsible to icon-only (64px) with toggle button
- **Mobile (≤768px)**: Sidebar hidden, hamburger button in top bar, slide-in drawer overlay
- CSS variables `--sidebar-width-open` and `--sidebar-width-collapsed` control layout transitions

---

## 10. ENVIRONMENT VARIABLES & DEPLOYMENT

### How env files work in CRA (priority order):
```
.env.local        → Local dev only, HIGHEST priority, gitignored
.env.production   → Used during npm run build, committed to git
.env              → Base default, always loaded, committed to git
```

### Local vs Production:
| | Local Dev | Production (Vercel) |
|---|---|---|
| Frontend URL | localhost:3001 | https://your-app.vercel.app |
| Backend URL | https://render-url.onrender.com | https://render-url.onrender.com |
| Env file used | .env.local | .env.production + Vercel dashboard vars |

### Why the build folder must NOT be committed:
CRA bakes env vars into the JS bundle at build time. If you commit the build folder, Vercel serves that pre-built file instead of building fresh — so `REACT_APP_API_URL` never gets injected. Always let Vercel build it.

---

## 11. SECURITY MEASURES

| Threat | How we handle it |
|---|---|
| **SQL Injection** | Sequelize ORM uses parameterized queries — never raw SQL with user input |
| **Password theft** | bcrypt hashing with salt rounds=10 — irreversible |
| **Unauthorized API access** | JWT middleware on all protected routes |
| **CORS attacks** | Whitelist of allowed origins — only Vercel and localhost |
| **Token theft** | Tokens expire in 1 day — auto-refresh before expiry |
| **Input attacks** | Input validation middleware checks all fields before DB |
| **Email enumeration** | Login returns same message for "user not found" and "wrong password" |
| **Duplicate emails** | Case-insensitive email check using `LOWER()` SQL function |

---

## 12. COMMON INTERVIEW QUESTIONS & ANSWERS

### Q: What is the difference between SQL and NoSQL? Why did you use MySQL?
**A:** SQL databases (like MySQL) store data in structured tables with fixed schemas and support relationships via foreign keys. NoSQL (like Firebase) stores data as documents/collections with flexible schemas. I used MySQL because financial data is highly structured — transactions always have the same fields (title, amount, type, category, date) and have clear relationships to users. SQL's ACID compliance ensures data integrity — a transaction either fully saves or doesn't save at all, which is critical for financial data.

### Q: What is an ORM? Why use Sequelize instead of raw SQL?
**A:** ORM (Object-Relational Mapper) lets you interact with a database using your programming language's objects instead of writing SQL. Sequelize maps JavaScript classes to database tables. Benefits: prevents SQL injection (uses parameterized queries automatically), handles table creation/migration, makes code more readable, and lets you switch databases (MySQL → PostgreSQL) with minimal changes.

### Q: What is JWT and how does it work?
**A:** JWT (JSON Web Token) is a compact, self-contained token for authentication. It has 3 parts separated by dots: `header.payload.signature`. The header says the algorithm (HS256), the payload contains claims like `{ id: 5, exp: 1234567890 }`, and the signature is `HMAC(header + payload, secret)`. The server signs it with a secret key. On each request, the server re-computes the signature and compares — if it matches, the token is valid. No database lookup needed. Expires after 1 day in our app.

### Q: What is CORS and why do you need it?
**A:** CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks JavaScript from making requests to a different domain than the page it's on. Our frontend is on `vercel.app` and backend is on `onrender.com` — different origins. Without CORS headers, the browser blocks the request. We configure the backend to send `Access-Control-Allow-Origin` headers for our specific allowed origins. We allow `*.vercel.app` to cover all preview deployments automatically.

### Q: How does password hashing work?
**A:** bcrypt takes a plain text password and runs it through a one-way hashing function with a random salt. The salt is stored with the hash. When a user logs in, bcrypt takes their entered password + the stored salt, runs the same algorithm, and compares the result. You can never reverse a bcrypt hash to get the original password. Salt rounds = 10 means 1024 iterations, making brute force attacks take years.

### Q: What is the difference between authentication and authorization?
**A:** Authentication = verifying WHO you are (login with email/password → get JWT token). Authorization = verifying WHAT you're allowed to do (JWT middleware checks if you have a valid token before accessing protected routes). In our app, every user can only see their own transactions — we check `userId: req.userId` in every DB query, so user A can never access user B's data.

### Q: How does the AI insights feature work?
**A:** When a user requests insights, we fetch all their transactions from MySQL, calculate a summary (total income, expenses, balance, savings rate, top spending categories), then build a prompt for Google's Gemini API. The prompt says "You are a financial advisor, give 3 bullet-point insights based on: Income ₹X, Expenses ₹Y...". Gemini returns personalized advice. If the API is unavailable, we fall back to rule-based insights generated locally.

### Q: How do you handle errors in the application?
**A:** Multiple layers: (1) Input validation middleware catches bad data before it reaches controllers. (2) Try-catch in every controller with specific error messages. (3) Global error handler middleware at the end of Express middleware chain catches unhandled errors. (4) Frontend axios interceptor handles 401 (token expired) by refreshing the token. (5) Firebase backup failures are caught and logged but don't break the main operation.

### Q: What is the difference between `sync({ force: true })` and `sync({ force: false })`?
**A:** `force: true` drops and recreates all tables on every server start — destroys all data, only for development. `force: false` creates tables if they don't exist but leaves existing tables untouched — safe for production. We use `force: false` so deployed data is never accidentally deleted.

### Q: Why did you use Firebase as a backup if you already have MySQL?
**A:** Defense in depth. Railway's free tier MySQL can go down or have connection limits. Firebase provides a secondary copy of all transaction data. Firebase is also a NoSQL document store — good for flexible queries and real-time features if we add them later. The backup is non-blocking (fire-and-forget) so it never slows down the main API response.

### Q: How does the budget overspending alert work?
**A:** Every time a user adds an expense transaction, `checkAndNotifyOverspending()` runs asynchronously in the background. It fetches the current month's budget, sums all expense transactions for that month using a DB date filter, and compares to the budget limit. If overspending AND `emailSent === false`, it sends an email via Nodemailer (Gmail SMTP) and sets `emailSent = true`. This flag prevents sending duplicate emails for the same overspending event. If spending drops back under budget, the flag resets.

### Q: How do you handle the case where the same email is registered twice?
**A:** Two layers: (1) The `email` column has a `unique: true` constraint in Sequelize — MySQL enforces uniqueness at the DB level. (2) Before creating, we do a case-insensitive lookup using `WHERE LOWER(email) = 'email'` — this catches `Test@Gmail.com` and `test@gmail.com` as duplicates. We also catch `SequelizeUniqueConstraintError` as a race condition safety net.

### Q: What is the difference between `.env`, `.env.local`, and `.env.production`?
**A:** In Create React App: `.env` is the base file loaded always. `.env.local` overrides `.env` for local development only (gitignored, never committed). `.env.production` is used when running `npm run build` (for Vercel deployment). Priority: `.env.local` > `.env.production` > `.env`. All CRA env vars must start with `REACT_APP_` to be accessible in the browser bundle.

### Q: How does the collapsible sidebar work?
**A:** The `Layout` component holds a `sidebarOpen` state (boolean). On desktop, it passes this to `Sidebar` which applies CSS class `sidebar-open` or `sidebar-closed`. CSS transitions `width` from `250px` to `64px` smoothly. The main content wrapper uses `margin-left: var(--sidebar-width-open/collapsed)` which also transitions. On mobile (≤768px), the sidebar is completely hidden, replaced by a hamburger button in a fixed top bar. Clicking hamburger shows a slide-in drawer overlay with a dark backdrop.

### Q: What challenges did you face and how did you solve them?
**A:** 
1. **Email case mismatch** — Old users stored with mixed-case emails couldn't login after we added lowercase normalization. Fixed by using `WHERE LOWER(email) = ?` for case-insensitive lookup.
2. **Build folder committed to git** — Vercel was serving the pre-built local bundle with `localhost:5000` hardcoded instead of building fresh. Fixed by removing `build/` from git tracking.
3. **CORS blocking local dev** — Frontend ran on port 3001 (3000 was busy) but CORS only allowed 3000. Fixed by adding 3001 and 3002 to allowed origins.
4. **`import.meta.env` in CRA** — All components were using Vite's env syntax instead of CRA's `process.env.REACT_APP_*`. Fixed by migrating all components to use the centralized `api.js` which uses the correct syntax.

---

## 13. WHAT I WOULD IMPROVE (shows maturity)

1. **TypeScript** — Add type safety to catch bugs at compile time
2. **Redis caching** — Cache AI insights (they don't change every second) to reduce Gemini API calls
3. **Pagination** — For users with thousands of transactions, load 20 at a time
4. **Refresh token rotation** — Store refresh tokens in DB, invalidate on logout (current implementation is stateless)
5. **Unit tests** — Jest tests exist but coverage is low; add tests for all controllers
6. **Rate limiting** — Add `express-rate-limit` to prevent brute force on login endpoint
7. **Input sanitization** — Add `DOMPurify` on frontend to prevent XSS
8. **WebSockets** — Real-time budget alerts instead of polling
9. **Docker** — Containerize for consistent dev/prod environments

---

## 14. QUICK NUMBERS TO REMEMBER

- JWT token expires: **1 day**
- bcrypt salt rounds: **10** (= 1024 iterations)
- Password minimum length: **6 characters**
- Transaction amount max: **999,999,999**
- Sidebar width open: **250px**, collapsed: **64px**
- Mobile breakpoint: **768px**
- AI model for insights: **gemini-2.5-flash**
- AI model for chatbot: **gemini-1.5-flash-latest**
- DB: **MySQL on Railway**
- Backend: **Node.js/Express on Render**
- Frontend: **React on Vercel**

---

*Good luck in your interview! You built this — you know it better than anyone.*
