# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Running the Project Locally-----------

If you are having trouble accessing the server, follow these steps carefully.

📌 Prerequisites

Make sure you have installed:

PostgreSQL
pgAdmin 4
Node.js

Also make sure you have created or imported the database (this is required).

🔧 Step 1 – Run Backend Server

Go inside the pg-backend folder:

cd pg-backend

Install dependencies and start server:

npm install
node server.js

If everything is working correctly, you will see:

Running at http://localhost:4000
PostgreSQL connected successfully
💻 Step 2 – Run Frontend

Open another terminal and go to the main project folder:

cd urban-artisans

Run:

npm run dev

You will see:

Local: http://localhost:5173/

Open this link in your browser.

⚠️ Important Notes
PostgreSQL database must be connected
Backend must be running on port 4000
Frontend and backend must run at the same time

If backend is not running, you will see:

Cannot reach the server on port 4000
✅ Summary
Service	Port	Status Required
Backend	4000	Running
Frontend	5173	Running
PostgreSQL	5432	Connected
