#  EcoServe — Smart E-Waste Management Platform

> Digitizing the circular economy through AI-powered diagnostics, 
> geospatial precision, and Digital Product Passports.

Built for **I/O Festival 2026 Web Development Competition**  
BEM FTI Universitas Tarumanagara

---

##  Live Demo
- **Frontend**: [coming soon after deploy]
- **Backend API**: https://ecoserve-api.onrender.com
- **API Docs**: https://ecoserve-api.onrender.com/swagger/index.html

---

##  Features

### Consumer
-  **AI Diagnosis** — Gemini AI-powered device triage with confidence scoring
-  **Report Damage** — Public order board for available technicians
-  **Digital Product Passport (DPP)** — Track device lifecycle and repair history
-  **Order Tracking** — Real-time order status with technician info
-  **Track on Map** — Static routing visualization of technician route
-  **Review System** — Anti-spam rating system for technicians
-  **Eco Impact** — Personal CO₂ avoided tracker using EPA WARM methodology

### Technician
-  **Incoming Orders** — Public job board for available orders
-  **Accept & Complete** — Full order lifecycle management
-  **Navigation** — Leaflet Routing Machine for turn-by-turn directions
-  **Earnings** — Commission-based earning tracker (10% platform fee)
-  **Performance** — Rating, total repairs, CO₂ saved metrics

### Platform
-  **OTP Authentication** — Passwordless login via email OTP
-  **Anti-Fraud** — GPS Lock + Photo Proof validation
-  **PWA** — Installable on mobile and desktop
-  **EPA WARM Methodology** — Scientific CO₂ calculation per repair

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Leaflet + React Leaflet | Interactive maps |
| Leaflet Routing Machine | Turn-by-turn routing via OSRM |
| Supabase Storage | Profile photo upload |
| next-pwa | Progressive Web App |
| Framer Motion | Animations |

### Backend
| Technology | Purpose |
|-----------|---------|
| Go + Fiber | REST API framework |
| PostgreSQL + PostGIS | Database with geospatial support |
| GORM | ORM |
| JWT HttpOnly Cookie | Authentication |
| Gemini AI | Device diagnosis |
| Mailjet SMTP | OTP email delivery |
| Render | Deployment |

---

##  Architecture

```
┌─────────────────────────────────────────┐
│           Next.js Frontend (PWA)        │
│                                         │
│  Consumer Flow:                         │
│  Auth → Dashboard → AI Diagnosis        │
│       → Report Damage → Orders          │
│       → Track Map → Review              │
│                                         │
│  Technician Flow:                       │
│  Auth → Onboarding → Dashboard          │
│       → Accept Order → Navigate         │
│       → Complete → Earnings             │
└──────────────┬──────────────────────────┘
               │ HTTPS + JWT HttpOnly Cookie
               │ (credentials: include)
┌──────────────▼──────────────────────────┐
│         Go Fiber REST API               │
│                                         │
│  /api/users/auth/*  → OTP Auth          │
│  /api/devices/*     → DPP Management    │
│  /api/orders/*      → Order Lifecycle   │
│  /api/chatbot/*     → Gemini AI Triage  │
│  /api/technicians/* → Technician Ops    │
│  /api/reviews/*     → Rating System     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│     PostgreSQL + PostGIS                │
│     (Geospatial queries, radius search) │
└─────────────────────────────────────────┘
```

---

##  EPA WARM Methodology

EcoServe uses the **EPA WARM (Waste Reduction Model)** to calculate 
CO₂ emissions avoided per repair:

```
CO₂ Avoided = Device Weight (kg) × Emission Factor (70 kgCO₂/kg)
```

**Why 70 kgCO₂/kg?**  
The largest carbon footprint of electronics comes from manufacturing — 
lithium/cobalt mining, chip fabrication, and global distribution — 
not the physical weight of the device. Repairing a 0.5kg smartphone 
avoids ~35kg of CO₂ that would have been generated producing a new one.

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/noireveil/ecoserve-frontend.git
cd ecoserve-frontend

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Fill in the values (see Environment Variables section)

# Run development server
pnpm dev
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://ecoserve-api.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Landing page & auth
│   ├── consumer/          # Consumer dashboard & features
│   │   ├── (with-nav)/    # Pages with bottom navigation
│   │   └── (no-nav)/      # Full-screen pages
│   └── technician/        # Technician dashboard & features
├── components/
│   ├── auth/              # Authentication components
│   ├── consumer/          # Consumer-specific components
│   ├── technician/        # Technician-specific components
│   └── ui/                # Shared UI components
├── hooks/
│   └── useAuth.ts         # Client-side auth hook
├── lib/
│   ├── api.ts             # API fetch wrapper with rate limit handling
│   ├── auth-cache.ts      # In-memory cache for user data
│   ├── haversine.ts       # Distance calculation utility
│   ├── logout.ts          # Logout handler
│   └── utils.ts           # Utility functions
└── middleware.ts           # Next.js middleware (auth bypass, client-side auth)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/auth/request | Request OTP |
| POST | /api/users/auth/verify | Verify OTP + set JWT cookie |
| POST | /api/users/auth/logout | Logout + clear cookie |
| GET | /api/users/me | Get current user profile |
| PUT | /api/users/me | Update profile |
| DELETE | /api/users/me | Soft delete account |
| GET | /api/devices/ | List user devices |
| POST | /api/devices/ | Register new device (DPP) |
| GET | /api/devices/{id} | Get device detail |
| DELETE | /api/devices/{id} | Remove device |
| GET | /api/orders/ | List orders |
| POST | /api/orders/ | Create order |
| GET | /api/orders/incoming | Public orders (for technicians) |
| PUT | /api/orders/{id}/accept | Accept order (technician) |
| PUT | /api/orders/{id}/cancel | Cancel order (consumer) |
| PUT | /api/orders/{id}/complete | Complete order + CO₂ calc |
| POST | /api/chatbot/triage | AI diagnosis via Gemini |
| POST | /api/reviews/order/{id} | Submit review |
| GET | /api/technicians/performance | Technician metrics |
| GET | /api/technicians/earnings | Technician earnings |
| GET | /api/technicians/nearby | Find nearby technicians |
| POST | /api/technicians/ | Register technician profile |

---

## 👥 Team

| Role | Name |
|------|------|
| Project Manager | Leonard Dwi Chrisdiasa |
| Frontend Developer | Faris Maulana Al Ba I |
| Backend Developer | Muhammad Yasyfi Alhafizh |

---

## 📄 License

Built for educational and competition purposes.  
I/O Festival 2026 — BEM FTI Universitas Tarumanagara
