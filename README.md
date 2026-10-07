# IEEE GBPIET Student Branch Website & Admin Portal

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.14-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

The official web portal and Content Management System (CMS) for the **IEEE Student Branch** at **G.B. Pant Institute of Engineering and Technology (GBPIET)**, Pauri Garhwal.

This platform provides a modern, responsive web presence for students, faculty, and participants to explore IEEE activities, register for upcoming events and workshops, claim verified digital participation certificates, and submit inquiries. It also includes an authenticated **Admin CMS Portal** for branch coordinators to manage event posts, approve certificates, export participant rosters to PDF/Excel, track support tickets, and monitor student engagement analytics.

---

## 📑 Page Directory & Architecture

The application consists of **31 distinct functional pages and management views** organized into **4 primary architectural zones**:

| Category / Zone                    | Page Count | Description                                                    | Access Level          |
| :--------------------------------- | :--------: | :------------------------------------------------------------- | :-------------------- |
| **1. Public Main Website**         |   **9**    | Public-facing pages for attendees, visitors, and students      | Public                |
| **2. Authentication & Security**   |   **3**    | Administrative login and multi-step OTP password recovery      | Public & Admin        |
| **3. Admin CMS Portal**            |   **17**   | Complete administrative backend, registries, and CMS tools     | Protected (Admin JWT) |
| **4. Error & Fallback**            |   **2**    | 404 Not Found fallback pages for client and admin areas        | Public & Admin        |
| **Total Functional Pages & Views** |   **31**   | **Complete coverage across public and administrative portals** | —                     |

---

### Master Page Index

|  #  | Route / URL                                                                    | Page Name                          | Component File                                                                    |     Access      |
| :-: | :----------------------------------------------------------------------------- | :--------------------------------- | :-------------------------------------------------------------------------------- | :-------------: |
|  1  | `/`                                                                            | Home Page                          | `src/modules/home/page.tsx`                                                       |     Public      |
|  2  | `/about`                                                                       | About IEEE GBPIET                  | `src/modules/about/page.tsx`                                                      |     Public      |
|  3  | `/activities/events`                                                           | Activities & Events                | `src/modules/activities/EventsPage.tsx`                                           |     Public      |
|  4  | `/activities/robotics`                                                         | Robotics Hub                       | `src/modules/activities/RoboticsPage.tsx`                                         |     Public      |
|  5  | `/teams`                                                                       | Branch Team & Committees           | `src/modules/teams/page.tsx`                                                      |     Public      |
|  6  | `/registration`, `/Registration`                                               | Event Registration Portal          | `src/modules/registration/page.tsx`                                               |     Public      |
|  7  | `/certificate`, `/certificates`                                                | Certificate Claim & Verification   | `src/components/Certificate.tsx`                                                  |     Public      |
|  8  | `/contact`                                                                     | Contact & Inquiries                | `src/modules/contact/page.tsx`                                                    |     Public      |
|  9  | `/joinieee`                                                                    | Join IEEE (Coming Soon)            | `src/pages/FrontendCommingSoon.tsx`                                               |     Public      |
| 10  | `/login`                                                                       | Admin Sign In                      | `src/modules/admin/pages/authentication/components/login.tsx`                     | Public (Guest)  |
| 11  | `/forgot-password`, `/reset-password`                                          | Self-Service Password Recovery     | `src/modules/admin/pages/authentication/ForgotPassword.tsx`                       |     Public      |
| 12  | `/admin/change-password`                                                       | Security & Password Reset          | `src/modules/admin/pages/authentication/ChangePassword.tsx`                       | Protected Admin |
| 13  | `/admin`, `/admin/dashboard`                                                   | Admin Analytics Dashboard          | `src/modules/admin/pages/dashboard/page.tsx`                                      | Protected Admin |
| 14  | `/admin/certificates`                                                          | Certificates Hub                   | `src/modules/admin/pages/certificates/pages.tsx`                                  | Protected Admin |
| 15  | `/admin/certificates/issued`                                                   | Issued Certificates Registry       | `src/modules/admin/pages/certificates/issued/CretificateIssued.tsx`               | Protected Admin |
| 16  | `/admin/certificates/requests`                                                 | Certificate Requests Queue         | `src/modules/admin/pages/certificates/request/RequestedCertificates.tsx`          | Protected Admin |
| 17  | `/admin/certificates/templates`                                                | Manual Certificate Issuance        | `src/modules/admin/pages/certificates/templates/page.tsx`                         | Protected Admin |
| 18  | `/admin/upcoming-posts`                                                        | Upcoming Events Hub                | `src/modules/admin/pages/upcomingPosts/page.tsx`                                  | Protected Admin |
| 19  | `/admin/upcoming-posts/add`                                                    | Publish Upcoming Event             | `src/modules/admin/pages/upcomingPosts/components/AddUpcomingPost.tsx`            | Protected Admin |
| 20  | `/admin/upcoming-posts/manage`                                                 | Manage Upcoming Events Directory   | `src/modules/admin/pages/upcomingPosts/components/EditUpcomingDirectory.tsx`      | Protected Admin |
| 21  | `/admin/upcoming-posts/edit/:id`                                               | Edit Upcoming Event Post           | `src/modules/admin/pages/upcomingPosts/components/EditUpcomingPostPanel.tsx`      | Protected Admin |
| 22  | `/admin/department-posts`                                                      | Department Posts Panel             | `src/modules/admin/pages/departmentPosts/page.tsx`                                | Protected Admin |
| 23  | `/admin/department-posts/:dept`                                                | Department Action Hub              | `src/modules/admin/pages/departmentPosts/Components/DepartmentDetail.tsx`         | Protected Admin |
| 24  | `/admin/department-posts/:dept/add`                                            | Create Department Activity Post    | `src/modules/admin/pages/departmentPosts/Components/AddDepartmentPost.tsx`        | Protected Admin |
| 25  | `/admin/department-posts/:dept/manage`                                         | Department Posts Directory         | `src/modules/admin/pages/departmentPosts/Components/DepartmentPostsDirectory.tsx` | Protected Admin |
| 26  | `/admin/department-posts/:dept/edit/:id`                                       | Edit Department Activity Post      | `src/modules/admin/pages/departmentPosts/Components/EditDepartmentPostPanel.tsx`  | Protected Admin |
| 27  | `/admin/registration`                                                          | Event Registrations Manager        | `src/modules/admin/pages/registration/page.tsx`                                   | Protected Admin |
| 28  | `/admin/support`                                                               | Support Tickets & Inquiries        | `src/modules/admin/pages/complain/page.tsx`                                       | Protected Admin |
| 29  | `/admin/reports`                                                               | Reports & Minutes of Meeting       | `src/modules/admin/pages/reports/page.tsx`                                        | Protected Admin |
| 30  | `/admin/logs`                                                                  | Audit Logs & Settings              | `src/modules/admin/pages/logs/page.tsx`                                           | Protected Admin |
| 31  | `/admin/ieeeapplication`, `/admin/members`, `/admin/directory`, `/admin/drive` | Admin Future Modules (Coming Soon) | `src/pages/ComingSoonpage.tsx`                                                    | Protected Admin |
| 32  | `*`                                                                            | Public 404 Not Found Page          | `src/pages/NotFoundPage.tsx`                                                      |    Fallback     |
| 33  | `/admin/*`                                                                     | Admin 404 Not Found Page           | `src/modules/admin/pages/pageNotFound.tsx`                                        |    Fallback     |

---

## 🔍 Detailed Page Breakdown & Functionality

### 1. Public Main Website (9 Pages)

#### 1. Home Page (`/`)

- **Component:** `src/modules/home/page.tsx`
- **Features:**
  - Dynamic Hero section with interactive IEEE call-to-actions (`Hero.tsx`)
  - "Who We Are" introduction to IEEE GBPIET chapter (`whoweare.tsx`)
  - Impact Metrics and statistics (`stats.tsx`)
  - "What We Do" highlighting technical domains, workshops, and competitions (`whatwedo.tsx`)
  - Live Upcoming Events preview strip (`UpcomingEvents.tsx`)
  - Visual Photo Gallery showcase (`Gallery.tsx`)
  - Frequently Asked Questions accordion (`FAQ.tsx`)
  - "Join IEEE" membership call-to-action banner (`join.CTA.tsx`)

#### 2. About Page (`/about`)

- **Component:** `src/modules/about/page.tsx`
- **Features:**
  - Comprehensive history of the GBPIET Student Branch (`AboutHero.tsx`, `whoweare.tsx`)
  - Branch statistics and achievements (`Stats.tsx`)
  - Official Mission & Vision statement (`MissionVision.tsx`)
  - Leadership and organizational governance structure (`LeadershipStructure.tsx`)
  - Quick resource links to IEEE Global, IEEE Region 10, and IEEE UP Section (`QuickLinks.tsx`)

#### 3. Activities & Events Page (`/activities/events`)

- **Component:** `src/modules/activities/EventsPage.tsx`
- **Features:**
  - **Dual-View Switcher:** Seamlessly toggles between "Department Posts" and "Upcoming Events"
  - **Academic Branch Filter:** Filter by CSE, AIML, BT, EE, and ECE with real-time counter badges
  - **Dynamic Category Filter:** Workshops, Competitions, Guest Lectures, Hackathons
  - **Interactive Activity Cards:** Overview, venue, timing, and organizer details (`ActivityCard.tsx`)
  - **Comprehensive Event Detail Modal:** In-depth view featuring discussion points and attendee rosters (`ActivityDetailedCard.tsx`)
  - **Full-Screen Lightbox:** High-resolution photo zoom and viewing dialog (`ImageModal.tsx`)
  - Strictly connected to live backend APIs (`getDepartmentPosts`, `getUpcomingEvents`)

#### 4. Robotics Hub Page (`/activities/robotics`)

- **Component:** `src/modules/activities/RoboticsPage.tsx`
- **Features:**
  - Dedicated showcase for the IEEE Robotics & Automation Society (RAS) student chapter
  - Filtered build sessions, hardware projects, robot wars, and embedded systems workshops
  - Activity modal preview with key discussion topics and attendee lists
  - External link banner to Prasthanam (the official robotics society portal)

#### 5. Teams Page (`/teams`)

- **Component:** `src/modules/teams/page.tsx`
- **Features:**
  - **Executive Committee:** Branch counselor, faculty coordinators, chairperson, vice chair, and secretaries
  - **Student Committee:** Technical leads, web development heads, event managers, and designers
  - Priority-ordered roster loaded from structured data (`src/data/teams/members.ts`)
  - **Alumni / Previous Members Section:** Recognition of past student branch office bearers

#### 6. Event Registration Page (`/registration`, `/Registration`)

- **Component:** `src/modules/registration/page.tsx`
- **Features:**
  - **Dual Registration Modes:**
    - `INDIVIDUAL`: Solo participant registration
    - `TEAM`: Multi-member team registration supporting 2 to 4 members (Leader + Teammates)
  - **Predefined Events:** Automated event selection with synchronized event dates (no manual date guessing)
  - **Validation:** Strict verification of Institute Roll Number, full name, phone number, branch, academic year, and email
  - **Registration Status Lookup Modal:** Participants can look up their submission status using their 7-digit Registration ID (`RegistrationStatusModal.tsx`)
  - **Instant Confirmation Card:** Generates a unique 7-digit `registrationId`, summary card, and copyable confirmation record (`RegistrationSuccessCard.tsx`)
  - **Automated Certificate Provisioning:** Submission automatically registers pending certificate entries for all team members in the backend database

#### 7. Certificate Claim & Verification Page (`/certificate`, `/certificates`, `/certificate/apply`)

- **Component:** `src/components/Certificate.tsx`
- **Features:**
  - Public credential claim form for event participants
  - Fields for Attendee Name, Verified Email, Academic Branch, Event Name, and Event Date
  - Dynamic event suggestions powered by live backend upcoming events datalist
  - Instant application submission returning a unique Certificate Tracking ID
  - One-click copy for tracking IDs and clear verification workflow instructions

#### 8. Contact Us Page (`/contact`)

- **Component:** `src/modules/contact/page.tsx`
- **Features:**
  - Contact and feedback form with Name, Email, Subject, and Detailed Message
  - **Dual Integration:**
    1. Submits directly to the backend Support API to generate a trackable Ticket ID (`TCK-XXXXXX`)
    2. Sends real-time email dispatch notifications via EmailJS
  - Displays instant ticket tracking confirmation upon submission

#### 9. Join IEEE - Coming Soon Page (`/joinieee`)

- **Component:** `src/pages/FrontendCommingSoon.tsx`
- **Features:**
  - Premium glassmorphic "Coming Soon" splash experience for student membership enrollment
  - Radial glowing ambient effects, animated grid backdrop, floating rocket micro-animations, and return navigation

---

### 2. Authentication & Security (3 Pages)

#### 10. Admin Login Page (`/login`)

- **Component:** `src/modules/admin/pages/authentication/components/login.tsx`
- **Features:**
  - Secure administrator portal sign-in
  - Rate-limited endpoint (`POST /api/v1/auth/login`) protecting against brute-force attempts
  - Show/hide password toggle, input validation, and JWT token session persistence via `AuthContext`
  - Automatic redirect to `/admin` upon authentication

#### 11. Self-Service Password Recovery (`/forgot-password`, `/reset-password`)

- **Component:** `src/modules/admin/pages/authentication/ForgotPassword.tsx`
- **Features:**
  - Multi-step cryptographically secure password recovery:
    - **Step 1 (Email):** Validates registered admin email and requests OTP (`POST /api/v1/auth/resetPassword/otp/generateOTP`)
    - **Step 2 (OTP Verification):** 6 individual auto-focusing numeric OTP inputs with 60s resend countdown timer (`POST /api/v1/auth/resetPassword/otp/verifyOtp`)
    - **Step 3 (Password Reset):** Strong password entry with validation, confirmation check, and temporary reset token authorization (`PATCH /api/v1/auth/resetPassword`)
    - **Step 4 (Success):** Animated confirmation banner with direct link back to login

#### 12. Security & Change Password (`/admin/change-password`)

- **Component:** `src/modules/admin/pages/authentication/ChangePassword.tsx`
- **Features:**
  - Authenticated in-portal credential update for administrators
  - Two-factor OTP challenge sent to the active admin email before password modification
  - Full feedback alerts and session synchronization

---

### 3. CMS / Admin Portal (`/admin/*`) (17 Pages & Views)

> Protected by `<PrivateRoute>` route guards. Requires active admin session with valid JWT token.

#### 13. Admin Analytics Dashboard (`/admin`, `/admin/dashboard`)

- **Component:** `src/modules/admin/pages/dashboard/page.tsx`
- **Features:**
  - **Live Registrations KPI Strip:** 4 real-time metrics showing Total Registrations, Total Students, Team Squads, and Individual Entries with direct drilldown links
  - **Department Activity Distribution:** Interactive bar chart displaying post distribution across CSE, AIML, EE, ECE, BT
  - **Certificate Analytics:** Donut chart illustrating Approved, Pending, and Rejected credentials with real-time fulfillment percentage
  - **Upcoming Events Schedule:** Compact view of upcoming deadlines and symposiums
  - **Support Inquiries Breakdown:** Donut chart breakdown of tickets by status (Pending, Rejected, Solved)

#### 14. Certificates Hub (`/admin/certificates`)

- **Component:** `src/modules/admin/pages/certificates/pages.tsx`
- **Features:**
  - Real-time statistics banner (Total Applications, Issued, Pending Review, Rejected)
  - 3 action cards linking to:
    1. _Issued Registry_ (`/admin/certificates/issued`)
    2. _Requested Certificates Queue_ (`/admin/certificates/requests`)
    3. _Manual Certificate Details Entry_ (`/admin/certificates/templates`)

#### 15. Issued Certificates Registry (`/admin/certificates/issued`)

- **Component:** `src/modules/admin/pages/certificates/issued/CretificateIssued.tsx`
- **Features:**
  - Complete history of all dispatched digital credentials
  - Live search across Certificate ID, attendee name, email, department, and event title
  - Quick clipboard copy for verification IDs and formatted issue date badges

#### 16. Requested Certificates Queue (`/admin/certificates/requests`)

- **Component:** `src/modules/admin/pages/certificates/request/RequestedCertificates.tsx`
- **Features:**
  - Real-time queue of pending participant certificate applications
  - Instant one-click **Approve** and **Reject** action handlers
  - Search filter by attendee, event, branch, or email

#### 17. Manual Certificate Issuance (`/admin/certificates/templates`)

- **Component:** `src/modules/admin/pages/certificates/templates/page.tsx`
- **Features:**
  - Form to manually issue official credentials directly
  - Inputs for Attendee Name, Email, Event Name, Event Date, Branch, and Position (Winner / Runner-up / Participant)
  - Direct database registration and credential generation

#### 18. Upcoming Events Hub (`/admin/upcoming-posts`)

- **Component:** `src/modules/admin/pages/upcomingPosts/page.tsx`
- **Features:**
  - Navigation hub for scheduling upcoming IEEE chapter events
  - Quick action routing to "Add New Event Post" and "Edit Posts Directory"

#### 19. Publish Upcoming Event Post (`/admin/upcoming-posts/add`)

- **Component:** `src/modules/admin/pages/upcomingPosts/components/AddUpcomingPost.tsx`
- **Features:**
  - Creator form for upcoming workshops, symposiums, and hackathons
  - Fields for Title, Event Poster Image (URL / Upload), Venue, Event Date, Registration Deadline, and Description

#### 20. Manage Upcoming Events Directory (`/admin/upcoming-posts/manage`)

- **Component:** `src/modules/admin/pages/upcomingPosts/components/EditUpcomingDirectory.tsx`
- **Features:**
  - Searchable list of all scheduled upcoming events
  - One-click deletion and direct edit navigation

#### 21. Edit Upcoming Event Panel (`/admin/upcoming-posts/edit/:id`)

- **Component:** `src/modules/admin/pages/upcomingPosts/components/EditUpcomingPostPanel.tsx`
- **Features:**
  - Pre-populated form to update details, dates, venues, posters, and deadlines of existing events

#### 22. Department Posts Hub (`/admin/department-posts`)

- **Component:** `src/modules/admin/pages/departmentPosts/page.tsx`
- **Features:**
  - Grid cards for all 5 engineering branches: **CSE**, **AIML**, **EE**, **ECE**, and **BT**
  - Displays dynamic live post counts per department

#### 23. Department Action Hub (`/admin/department-posts/:dept`)

- **Component:** `src/modules/admin/pages/departmentPosts/Components/DepartmentDetail.tsx`
- **Features:**
  - Branch-specific management portal routing to "Add Posts" and "Edit Posts" for the selected department

#### 24. Create Department Activity Post (`/admin/department-posts/:dept/add`)

- **Component:** `src/modules/admin/pages/departmentPosts/Components/AddDepartmentPost.tsx`
- **Features:**
  - Form to publish official activity reports: Title, Category, Date, Time, Venue, Organized By, Report Author, Overview, Key Discussions list, Student Attendance list, and Photo

#### 25. Department Posts Directory (`/admin/department-posts/:dept/manage`)

- **Component:** `src/modules/admin/pages/departmentPosts/Components/DepartmentPostsDirectory.tsx`
- **Features:**
  - Searchable archive of branch activities with quick delete and edit controls

#### 26. Edit Department Post Panel (`/admin/department-posts/:dept/edit/:id`)

- **Component:** `src/modules/admin/pages/departmentPosts/Components/EditDepartmentPostPanel.tsx`
- **Features:**
  - Full-featured post editor to modify published departmental activities

#### 27. Event Registrations Manager (`/admin/registration`)

- **Component:** `src/modules/admin/pages/registration/page.tsx`
- **Features:**
  - Comprehensive participant management system
  - Filter by specific event tabs with real-time registration counters
  - Filter by mode (`INDIVIDUAL` vs `TEAM`)
  - Live omni-search across Registration ID, Student Name, Roll Number, Phone, Branch, and Team Name
  - **Export to PDF:** Generates formatted multi-page registration reports via `jspdf` and `jspdf-autotable`
  - **Export to Excel:** Generates full `.xlsx` spreadsheets formatted with all participant metadata via `xlsx`

#### 28. Support Tickets & Complaints (`/admin/support`)

- **Component:** `src/modules/admin/pages/complain/page.tsx`
- **Features:**
  - Help desk and ticket management interface
  - Filter by status (`Pending`, `Solved`, `Rejected`) and search by Ticket ID, sender name, subject
  - Detailed ticket inspection modal
  - Action buttons to resolve (`Mark as Solved`) or reject inquiries

#### 29. Reports & Minutes of Meeting (`/admin/reports`)

- **Component:** `src/modules/admin/pages/reports/page.tsx`
- **Features:**
  - Executive committee meetings archive (MoM) and technical symposium outcome documentation

#### 30. Audit Logs & Settings (`/admin/logs`)

- **Component:** `src/modules/admin/pages/logs/page.tsx`
- **Features:**
  - Activity log recording administrative actions (credential approvals, post creations, support closures)
  - Quick shortcut to administrator password and security settings

#### 31. Admin Future Modules (`/admin/ieeeapplication`, `/admin/members`, `/admin/directory`, `/admin/drive`)

- **Component:** `src/pages/ComingSoonpage.tsx`
- **Features:**
  - Clean placeholder views for upcoming modules: IEEE Membership Applications, Members Directory, User Directory, and Google Drive Cloud Integration

---

### 4. Error & Fallback Handlers (2 Pages)

#### 32. Public 404 Not Found Page (`*`)

- **Component:** `src/pages/NotFoundPage.tsx`
- **Features:** Catch-all route displaying a clean not-found message with return navigation.

#### 33. Admin 404 Not Found Page (`/admin/*`)

- **Component:** `src/modules/admin/pages/pageNotFound.tsx`
- **Features:** Nested fallback inside the Admin Layout for invalid administrative URLs.

---

## 🛠️ Technology Stack

| Layer                      | Technologies                                                                                                                                               |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework & Core**       | [React 18](https://react.dev/) • [TypeScript 5](https://www.typescriptlang.org/) • [Vite 5](https://vitejs.dev/)                                           |
| **Styling & Icons**        | [Tailwind CSS v4](https://tailwindcss.com/) • [Lucide React](https://lucide.dev/) • [React Icons](https://react-icons.github.io/react-icons/)              |
| **Client-Side Routing**    | [React Router DOM v6](https://reactrouter.com/) (Nested Layouts & `<PrivateRoute>`)                                                                        |
| **Document & Data Export** | [jsPDF](https://github.com/parallax/jsPDF) • [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) • [xlsx (SheetJS)](https://sheetjs.com/) |
| **Notification Services**  | [@emailjs/browser](https://www.emailjs.com/)                                                                                                               |
| **Code Quality & Tooling** | ESLint 9 • Prettier 3 • Husky 9 • lint-staged 15                                                                                                           |
| **Backend REST API**       | Node.js / Express deployed on Render (`https://ieee-backend-7z25.onrender.com`)                                                                            |

---

## 📁 Repository Structure

```text
d:/IEEE_Site/
├── public/                         # Static assets (logos, images, manifest)
│   ├── images/                     # Official brand logos and event photos
│   └── favicon.ico
├── src/
│   ├── assets/                     # Project assets and media
│   ├── components/                 # Global UI & Layout components
│   │   ├── Certificate.tsx         # Public certificate claim form
│   │   ├── ImageModal.tsx          # Fullscreen photo lightbox modal
│   │   ├── PrivateRoute.tsx        # Route guard for protected /admin routes
│   │   └── layout/                 # Main header, desktop/mobile navbars, footer
│   ├── config/                     # Configuration files (API URLs, site metadata)
│   │   ├── api.ts                  # Base API URL builder & environment resolution
│   │   ├── navigation.ts           # Top-level navigation items
│   │   └── site.ts                 # Site title and canonical URL
│   ├── context/
│   │   └── AuthContext.tsx         # Admin authentication state & JWT persistence
│   ├── data/                       # Feature-scoped static content (About, Teams, FAQs)
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Cross-cutting utility libraries
│   ├── modules/                    # Feature-based architecture
│   │   ├── about/                  # About page components & sections
│   │   ├── activities/             # Activities (Events & Robotics) components
│   │   ├── admin/                  # Complete Admin CMS Portal
│   │   │   ├── AdminLayout/        # Sidebar, topbar, and layout wrapper
│   │   │   ├── pages/              # Admin pages: dashboard, certificates, posts, support, logs, auth
│   │   │   └── router.tsx          # Admin sub-router definition
│   │   ├── contact/                # Contact Us form & EmailJS handler
│   │   ├── home/                   # Landing page components (Hero, Stats, Gallery, FAQ)
│   │   ├── registration/           # Public event registration form, lookup modal, confirmation
│   │   └── teams/                  # Branch leadership & committee roster
│   ├── pages/                      # Global fallback and coming soon pages
│   │   ├── ComingSoonpage.tsx      # Admin coming soon view
│   │   ├── FrontendCommingSoon.tsx # Public coming soon view
│   │   └── NotFoundPage.tsx        # 404 page
│   ├── services/
│   │   └── adminApi.ts             # Central typed API client for all 33 backend endpoints
│   ├── styles/                     # Global stylesheet & Tailwind rules
│   ├── types/                      # Global TypeScript definitions
│   ├── utils/                      # Helper utilities
│   ├── main.tsx                    # Application bootstrap entry point
│   └── router.tsx                  # Root application router
├── .env                            # Environment variables (local)
├── env.example                     # Sample environment variable template
├── api.md                          # Comprehensive backend API documentation (33 endpoints)
├── package.json                    # Project dependencies and npm scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build configuration
```

---

## ⚡ Environment Configuration

Create a `.env` file in the root directory (refer to `env.example`):

```bash
# Backend REST API Base URL
VITE_API_BASE_URL="https://ieee-backend-7z25.onrender.com"

# Website Metadata
VITE_SITE_NAME="IEEE GBPIET Student Branch"
VITE_SITE_URL="http://localhost:5173"

# EmailJS Service Configuration (Contact Us & Email Notifications)
VITE_EMAILJS_SERVICE_ID=""
VITE_EMAILJS_TEMPLATE_ID=""
VITE_EMAILJS_PUBLIC_KEY=""
```

> **Note:** Only environment variables prefixed with `VITE_` are exposed to client-side code by Vite.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** version `18.17.0` or higher
- **npm:** version `9.x` or higher

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/<your-username>/IEEE_Site.git
   cd IEEE_Site
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**

   ```bash
   copy env.example .env     # Windows
   # or
   cp env.example .env       # macOS / Linux
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available NPM Scripts

| Command                | Action                                                                                |
| :--------------------- | :------------------------------------------------------------------------------------ |
| `npm run dev`          | Starts Vite development server at `http://localhost:5173`                             |
| `npm run build`        | Runs TypeScript compilation (`tsc --noEmit`) and produces production build in `dist/` |
| `npm run preview`      | Locally previews the production build                                                 |
| `npm run typecheck`    | Validates TypeScript types across the entire project                                  |
| `npm run lint`         | Runs ESLint 9 checks                                                                  |
| `npm run lint:fix`     | Automatically fixes autofixable ESLint errors                                         |
| `npm run format`       | Formats all code files with Prettier                                                  |
| `npm run format:check` | Verifies code formatting with Prettier                                                |

---

## 🌐 Connected Backend API Reference

The website interacts with a REST backend covering **33 endpoints across 8 modules**:

- **Auth & OTP (`/api/v1/auth`):** Admin login, logout, password recovery OTP generate/verify, password reset.
- **Registrations (`/api/v1/registration`):** New individual/team registrations, single query by ID, fetch all.
- **Certificates (`/api/v1/certificate`):** Participant applications, admin approval, rejection, manual issuance, issued registry.
- **Department Posts (`/api/v1/departmentPosts`):** Posts by department (CSE, AIML, BT, EE, ECE), add post, delete, update.
- **Upcoming Events (`/api/v1/upcomingPosts`):** Fetch events, publish new event, update, delete.
- **Support Inquiries (`/api/v1/support`):** Send public support message, get tickets, update status (solved/rejected).
- **Dashboard Metrics (`/api/v1/dashboard`):** Real-time aggregation of posts, events, certificates, and inquiries.

_(See [`api.md`](./api.md) for full request/response schemas and authentication headers)._

---

## 👥 Contributors & Maintainers

- **IEEE Student Branch, GBPIET** — G.B. Pant Institute of Engineering and Technology, Pauri Garhwal, Uttarakhand, India.
- Website: [IEEE GBPIET](https://ieee-gbpiet.ac.in)
- Official RAS Website: [Prasthanam GBPIET](https://prasthanam-gbpiet.vercel.app/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
