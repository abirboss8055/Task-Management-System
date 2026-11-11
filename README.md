<h1 align="center">🧵 Comrades Legacy — Task Operations</h1>

<p align="center">
  <i>A deterministic, high-throughput internal task execution pipeline and workload-scheduling engine engineered for apparel manufacturing operations.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL_8-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Auth.js_v5-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Auth.js v5" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
</p>

---

### ⚡ Elevator Pitch

> **Comrades Legacy Task Operations** is an enterprise-grade, full-stack Next.js App Router platform built to eliminate bottlenecks in clothing brand production cycles. By pairing an immutable relational schema with a deterministic workload state machine, the system automates task dispatch, guarantees zero developer cognitive overload, prevents employee burnout via workload-aware queue auto-scheduling, and maintains real-time feedback loops via React Server Actions and atomic MySQL transactions. Designed with a bespoke **Modern Heritage** editorial aesthetic (zero box-shadows, sharp zero-radius geometry, and high-contrast ivory/maroon/navy palette), it balances aesthetic excellence with strict production engineering.

---

### 🏗️ System Architecture

```plaintext
comrades-legacy-task-manager/
├── actions/                  # Next.js Server Actions (atomic mutations, revalidations)
│   ├── comment-actions.ts    # Thread retrieval, contextual messaging mutations
│   └── task-actions.ts       # Workload-aware task creation, DAG status transitions
├── app/                      # Next.js App Router architecture
│   ├── api/auth/[...nextauth]# Auth.js v5 route handler
│   ├── employee/             # Employee workspace portal (/dashboard, /my-tasks)
│   ├── login/                # Editorial authentication entrypoint
│   ├── manager/              # Manager command portal (/dashboard, /tasks, /team)
│   ├── globals.css           # Modern Heritage CSS variables & reset overrides
│   ├── layout.tsx            # Root layout with font optimization & Sonner toaster
│   └── page.tsx              # Role gateway & redirection portal
├── components/               # Domain-driven React Client Components
│   ├── EmployeeNavbar.tsx    # Employee portal navigation & role badges
│   ├── EmployeeTaskModal.tsx # Read-only inspection modal with chat-style thread
│   ├── FestivalCalendar.tsx  # Bangladeshi seasonal drop milestone widget
│   ├── ManagerNavbar.tsx     # Manager operations navigation & quick actions
│   └── NewTaskModal.tsx      # Task creation modal with dynamic URL link inputs
├── lib/                      # Core infrastructure singletons
│   └── prisma.ts             # Global Prisma Client instance with pool handling
├── prisma/                   # Database modeling & migration layer
│   ├── schema.prisma         # Relational schema (User, Task, Task_Link, Comment)
│   └── seed.ts               # Idempotent database seeder (Manager & Employee)
├── types/                    # Ambient TypeScript module declarations
│   └── next-auth.d.ts        # Typed JWT tokens & session extensions (Role, User_ID)
├── auth.config.ts            # Edge-compatible Auth.js configuration for Middleware
├── auth.ts                   # Node.js Auth.js initialization (Prisma Adapter & bcrypt)
├── middleware.ts             # Edge runtime route protection & RBAC redirect engine
├── tailwind.config.js        # Modern Heritage color palette, 0px radius enforcement
└── tsconfig.json             # Strict TypeScript compiler options
```

---

### 💎 Core Architectural Features

#### 1. Deterministic Workload-Aware Auto-Scheduling
When assigning a production task to an Employee, the backend automatically evaluates the assignee's real-time queue. If the employee already maintains an active `IN_PROGRESS` task, the incoming assignment is automatically intercepted, downgraded to `SCHEDULED`, and deferred by exactly 72 hours (`Date.now() + 3 days`).

#### 2. Atomic FIFO Queue Promotion Pipeline
When an employee transitions a task to `DONE`, an atomic `prisma.$transaction` timestamps `Completed_Date = now()` and locates the oldest queued task (`Status = SCHEDULED`) assigned to that employee. That queued task is promoted instantaneously to `IN_PROGRESS` without human intervention.

#### 3. Edge-Enforced Role-Based Access Control (RBAC)
Protected by **NextAuth.js v5 (Auth.js)** and Next.js Edge Middleware:
- Unauthenticated requests are immediately captured and redirected to `/login` with encoded callback parameters.
- Employees attempting to cross privilege boundaries into `/manager/*` are redirected to `/employee/dashboard`.
- Sessions run on stateless cryptographic JWTs, preserving sub-millisecond response latency.

#### 4. Dynamic Multi-Link Asset Registry
Eliminates heavy binary blob storage on application nodes. Uses a 1-to-many normalized `Task_Link` model linked via foreign keys to track Google Drive tech packs, mood boards, and CAD cut-sheets with cascade deletions.

#### 5. Real-Time Contextual Discussion Threads
Inline discussion stream built directly into the task inspection modal. Submissions trigger optimistic Server Action dispatches and execute Next.js path cache revalidation, reflecting manager directives and fit notes without page reloading.

#### 6. High-Velocity Analytics & Toast Trigger
Prisma aggregate filters scan weekly completion throughput. When an employee completes 5 or more tasks in a rolling 7-day window, managers receive an automated milestone notification (`🔥 [Employee Name] is on fire! 5 tasks completed this week`), safeguarded by `sessionStorage` to fire exactly once per managerial session.

#### 7. Modern Heritage Editorial Aesthetic
A tailored design system inspired by vintage bespoke tailoring houses:
- **Warm Ivory (`#FFFFF0`)**: Page canvas and high-comfort reading backgrounds.
- **Deep Maroon (`#7B1818`)**: Primary action triggers and priority tags.
- **Navy Blue (`#0B2545`)**: Navigation framing, structural headers, and borders.
- **Pure White (`#FFFFFF`)**: High-contrast surface cards.
- **Zero-Radius Geometry**: Global `rounded-none` and flat design (`shadow-none`) for clean editorial typography.

---

### 🚀 Quick Start (Local Setup)

Follow these steps to configure and run the repository on your local workstation:

#### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/your-organization/comrades-legacy-task-manager.git
cd comrades-legacy-task-manager
npm install
```

#### 2. Configure Environment Variables
Copy the template configuration into an active `.env` file:
```bash
cp .env.example .env
```
Open `.env` and configure your credentials:
```env
DATABASE_URL="mysql://<db_user>:<db_password>@<db_host>:3306/<db_name>"
AUTH_SECRET="2b6a7e928007a7fe6d5bc3da92ce23c835696ca38d628d7f0a620927f31b38d0"
NEXTAUTH_SECRET="2b6a7e928007a7fe6d5bc3da92ce23c835696ca38d628d7f0a620927f31b38d0"
NEXTAUTH_URL="http://localhost:3000"
```

#### 3. Sync Database Schema & Generate Prisma Client
Apply the schema directly to your MySQL database instance:
```bash
npx prisma db push
```

#### 4. Seed Initial Accounts
Populate default manager and employee credentials:
```bash
npx tsx prisma/seed.ts
```

| Account Role | Username | Password | Default Portal |
| :--- | :--- | :--- | :--- |
| **MANAGER** | `captain` | `captain123` | `/manager/dashboard` |
| **EMPLOYEE** | `employee` | `employee123` | `/employee/dashboard` |

#### 5. Launch Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to access the operations hub.

---

### 🌐 Hostinger Custom Node.js Deployment Guide

This application is built for a self-hosted custom Node.js execution environment (such as Hostinger VPS or Cloud Application hosting), rather than serverless edge functions.

#### 1. Loopback Database Binding
Because the Node.js application process and the MySQL service execute on the same host instance on Hostinger, your production `.env` must point to the loopback interface:
```env
DATABASE_URL="mysql://<user>:<password>@127.0.0.1:3306/<database>"
```

#### 2. Build for Production
Execute the combined Prisma client generation and Next.js compiler:
```bash
npm run build
```

#### 3. Daemonized Process Management (PM2)
Ensure 24/7 uptime and automated process recovery by daemonizing with PM2:
```bash
# Start the production server
pm2 start npm --name "comrades-tasks" -- start

# Save daemon state across server reboots
pm2 save
pm2 startup
```

---

### 🛡️ Production Verification & Scripts

| Command | Action | Production Target |
| :--- | :--- | :--- |
| `npm run dev` | Boots local Next.js Turbopack development server | Local workstation |
| `npm run build` | Synchronizes Prisma Client and runs Next.js production build | Hostinger / CI-CD |
| `npm run start` | Launches optimized Next.js production server daemon | Hostinger Node.js |
| `npm run db:push` | Pushes local schema state to the active MySQL database | Migration workflow |

---

<p align="center">
  <b>Comrades Legacy Apparel Co.</b> • Internal Systems & Task Architecture
</p>
