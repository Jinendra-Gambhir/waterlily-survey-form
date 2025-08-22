
# Waterlily Survey Form

Build a system to collect demographic, health, and financial data from users through a survey for ML predictions on long-term care.



## Tech Stack

**Backend:** Node.js + Express (lightweight, flexible)

**ORM:** Prisma (type-safe, relational, easy migrations)

**Database:** PostgreSQL (relational structure fits user-question-response model)

Why not Firebase or MongoDB?
- No need for NoSQL flexibility — we benefit from structured relational data
- We’ll eventually feed this into ML, so normalization matters

**Frontend:** React + TypeScript + Tailwind (developer efficiency, fast UI iterations)

**Auth:** JWT in HttpOnly cookie (for session safety)



## Roadmap

🔧 Functional Requirements
- Users can register/login securely
-	Authenticated users can take a survey once
-	Questions grouped by category
-	Each response saved with user reference
-	Prevent duplicate/incomplete submissions
________________________________________
🔐 Non-Functional Requirements
-	Security: JWT-based auth, HttpOnly cookies
-	Performance: Lightweight backend (Express)
-	Scalability: Prisma ORM + PostgreSQL DB schema ready for scale
-	Maintainability: Modular file structure, clean code
-	UX: Minimal, accessible UI
________________________________________
Sample Survey Questions

📊 Demographic
- Full name
-	Age
-	Biological sex
-	Zip code
  
❤️ Health
-	Do you have chronic conditions?
-	Do you use tobacco or alcohol?
-	Height and weight (for BMI)
  
💰 Financial
-	Monthly income
-	Monthly expenses
-	Do you have long-term care insurance?




## Installation

Installation for backend

```bash
npm install express cors dotenv jsonwebtoken bcryptjs cookie-parser prisma @prisma/client
```
```bash
npx prisma init
```
Installation for frontend

```bash
npx create-react-app frontend, npm install -D tailwindcss@3 postcss autoprefixer
```
```bash
npx tailwindcss init -p
```
```bash
npm install typescript --save-dev
```
```bash
npx tsc –init
```
```bash
npm install axios
```
## Optimizations

With more time, I would’ve liked to add a few things. For example:

- A review screen so users can double-check their answers before submitting

- Better form validation not just required fields, but things like “Age must be over 18”

- A way to save progress if someone closes the tab mid-survey

- And maybe even some basic admin tools to manage or add survey questions without touching the database

But overall, I focused on building a clean, working foundation — so it’d be easy to layer those things on later.
## Authors

- [Jinendra Gambhir](https://github.com/Jinendra-Gambhir/waterlily-survey-form)

