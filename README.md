# 🌍 NomadNest — Safe & Premium Solo Travel Planner

> **Empowering solo travelers, especially women, to explore the world with confidence, safety, and a premium planning experience.**

---

## 🚀 Important Links

- **🎨 Figma Design:** [https://ream-plow-46277508.figma.site/](https://www.figma.com/proto/zJsU3EkLp67NMOfD0ZkOmF/Untitled?page-id=0%3A1&node-id=43-4846&p=f&viewport=2109%2C544%2C0.07&t=LXzHwKmgOUZitoX1-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=43%3A4846)
- **🌐 Live Project:** [https://nomadnesttt.netlify.app/](https://nomadnesttt.netlify.app/)
- **📖 API Documentation:** [https://nomadnest-x4an.onrender.com/api-docs/](https://nomadnest-x4an.onrender.com/api-docs/)
- **🛠️ Backend Deployed:** [https://nomadnest-x4an.onrender.com/](https://nomadnest-x4an.onrender.com/)
- **📺 YouTube Demo:** [https://youtu.be/GHAzqBsoEd4]

---

## 🧩 Problem Statement
Solo traveling, particularly for **women**, is often overshadowed by concerns about safety, complex planning, and a lack of reliable local information. Many travelers feel overwhelmed by the fragmentation of tools needed to manage trips, stay safe, and find inspiration, leading to anxiety instead of adventure.

## 💡 The Solution
**NomadNest** is a specialized planning platform designed to be a "digital safety net" for solo travelers. By integrating **Emergency SOS systems**, **Safety Centers**, and **Verified Recommendations** into a premium, easy-to-use interface, we empower travelers to focus on the joy of exploration while the app handles the security and logistics.

---

## ✨ Key Features

### 🛡️ Safety-First Tools (Specially for Solo/Girl Travelers)
- **🆘 SOS Emergency System** — One-tap access to local emergency services and pre-set trusted contacts.
- **📍 Live Safety Center** — Real-time tracking and location sharing with friends/family.
- **🏥 Verified Hospitals & Police** — Instant directory of nearby safe zones based on live GPS data.

### 🗺️ Intelligent Planning
- **🔐 Secure Auth** — JWT-protected personal travel vault.
- **🗺️ Trip Dashboard** — Full CRUD operations to manage flights, stays, and daily itineraries.
- **❤️ Safety-Rated Destinations** — Handpicked destinations with a focus on safety and accessibility.
- **🎨 Travel Style Quiz** — Personalized destination matching based on your solo travel personality.

### 📱 Premium UX/UI
- **🌙 Night Mode** — Eye-straining protection for planning journeys late at night.
- **⚡ Performance** — 100% lazy-loaded pages for fast access even on slow travel networks.
- **📱 Full Responsiveness** — Optimized for one-handed mobile use on the go.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + Redux Toolkit |
| **Styling** | Tailwind CSS + Material UI (MUI) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens) |
| **Documentation** | Swagger / OpenAPI 3.0 |
| **Deployment** | Render (Backend) + Netlify (Frontend) |

---

## 📁 Proper Folder Structure

```
wanderlust/
├── frontend/               # React + Vite application
│   ├── public/             # Static assets & sitemap.xml
│   └── src/
│       ├── components/     # Reusable UI components (Sidebar, Topbar, ErrorBoundary)
│       ├── context/        # Theme & Toast state management
│       ├── services/       # Axios API integration & Analytics
│       ├── store/          # Redux Toolkit slices (Auth, Trips, Emergency)
│       └── pages/          # Lazy-loaded page components (Dashboard, Safety Center)
└── backend/                # Node.js + Express API
    ├── models/             # MongoDB Schemas
    ├── routes/             # API Endpoints
    ├── middleware/         # JWT Auth & Security handlers
    └── server.js           # Server configuration
```

---



## 👨‍💻 Author

**Dhyey Patel** — Full Stack Developer  
GitHub: [@dhyeyptl10](https://github.com/dhyeyptl10)
