Goal:
Build a system to collect demographic, health, and financial data from users through a survey — for ML predictions on long-term care.

Functional Requirements
•	Users can register/login securely
•	Authenticated users can take a survey once
•	Questions grouped by category
•	Each response saved with user reference
•	Prevent duplicate/incomplete submissions

Non-Functional Requirements
•	Security: JWT-based auth, HttpOnly cookies
•	Performance: Lightweight backend (Express)
•	Scalability: Prisma ORM + PostgreSQL DB schema ready for scale
•	Maintainability: Modular file structure, clean code
•	UX: Minimal, accessible UI

Questions

•	Full name
•	Age
•	Biological sex
•	Zip code

•	Do you have chronic conditions?
•	Do you use tobacco or alcohol?
•	Height and weight (for BMI)

•	Monthly income
•	Monthly expenses
•	Do you have long-term care insurance?
