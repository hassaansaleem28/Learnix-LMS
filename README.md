# Complete Case Study - Learnix LMS

## Overview

**Learnix LMS** is a full-featured **Learning Management System** built with **Next.js** with **Typescript** in frontend and **Node.js** and **Express** with **Typescript** in the backend. The system provides **RESTful APIs** for managing online courses, user authentication, course enrollment, payment processing, content delivery, and analytics. It follows a **multi-layered architecture** ensuring clear separation of concerns between routing, business logic, and data access.

### System is designed to support :

o- **Multi-role user management** (Admin & Regular users)

o- **Course creation & content management** with video streaming

o- **Secure payment processing** via **Stripe**

o- **Interactive learning features** — questions, replies, and reviews

o- **Real-time notifications**

o- **Administrative analytics & reporting**

o- **Dynamic layout management** for frontend content

---

## Project Goals

**Learnix LMS** is a community-driven platform built to help beginner developers grow into confident, industry-ready software engineers. It bridges the gap between theory and practice by offering curated lessons, real-world projects, and expert guidance—focusing on learning by doing rather than just consuming tutorials.

o- **Beginner-friendly, practical learning:** Emphasizes real-world application of concepts to build strong engineering foundations.  
o- **Community-driven growth:** Encourages mentorship, collaboration, and peer feedback in a supportive environment.  
o- **Progress through consistency:** Inspires learners to improve *“one commit, one concept, one breakthrough at a time.”*

---

## System Architecture Overview

**Learnix LMS** follows a **three-tier architecture** consisting of a **Node.js/Express backend**, **MongoDB database**, and **Next.js frontend**.  
This design ensures scalability, modularity, and smooth integration between client and server.

| Layer | Description | Key Components / Features |
|:------|:-------------|:--------------------------|
| **Backend Layer** | Built with **Express.js**, exposing RESTful APIs for core LMS operations. | - **User Management (`/api/v1/user`)** – Authentication, registration, profiles <br> - **Course Management (`/api/v1/course`)** – Courses, questions, reviews <br> - **Order Processing (`/api/v1/order`)** – Purchases, Stripe payments <br> - **Notifications (`/api/v1/notifications`)** – Real-time system updates <br> - **Analytics (`/api/v1/analytics`)** – Usage and performance tracking <br> - **Layout (`/api/v1/layout`)** – Manage banners, FAQs, categories <br><br> **Extras:** Rate limiting (100 req / 15 min / IP), middleware for errors & cookies |
| **Data Layer** | Uses **MongoDB** with **Mongoose ODM** for data modeling and schema validation. | - **User Model:** Credentials, bcrypt hashing, JWT tokens <br> - **Course Model:** Course content, videos, reviews, discussions <br> - **Order Model:** Purchase and payment tracking |
| **Frontend Layer** | Built using **Next.js 13+** and **React**, providing a seamless user experience. | - **Redux Toolkit + RTK Query:** State and API management <br> - **Socket.io Client:** Real-time communication <br> - **NextAuth:** Session and authentication management <br> - **API Slices:** Modular endpoints (analytics, layout, orders) |
| **Security Features** | Ensures data safety and controlled access across the system. | - **JWT Authentication:** Access (5 min) & refresh (3 days) tokens <br> -  **CORS:** Configured for specific frontend origin <br> - **Password Hashing:** Bcrypt encryption for user credentials |

---

## System Architecture Diagram


