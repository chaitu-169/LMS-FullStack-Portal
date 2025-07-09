🎓 Full Stack Learning Management System (LMS)
A modern, scalable Learning Management System built with the MERN stack and enhanced with TypeScript, TailwindCSS, and Vite for performance and developer experience. This project includes user authentication, course management, and student enrollment.

🚀 Features
👩‍🎓 User Authentication (JWT-based)

📚 Course Creation and Management

📥 Student Enrollment Functionality

🌐 RESTful APIs using Express

🛡️ Protected Routes using Middleware

🌈 TailwindCSS for elegant UI

⚙️ Vite for blazing-fast builds

🧠 TypeScript Support

🌍 MongoDB Atlas Integration

🔒 Secure Cookie Management

🎯 CORS + Helmet + Morgan for security & logging

🛠️ Tech Stack
Frontend:

React

Vite

TypeScript

TailwindCSS

Backend:

Node.js

Express.js

MongoDB + Mongoose

dotenv

cookie-parser

helmet, cors, morgan

Other Tools:

Git & GitHub

Vercel / Render (for deployment)

Postman (for testing APIs)

📁 Project Structure
LMS/
├── server/                 # Backend
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
├── src/                    # Frontend
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── .env
├── tailwind.config.js
├── postcss.config.cjs
├── vite.config.js
└── README.md


📦 Install Dependencies
npm install

🔐 Create a .env file in server/
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

▶️ Run Development Server
npm run dev

🙌 Acknowledgments
Thanks to the open-source community for tools like Vite, TailwindCSS, and MongoDB Atlas.

Contact:
sriramchaitu383@gmail.com