# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Product Overview

**Product Name:** Task Approval System  
**Type:** Internal Web Application (User Panel + Admin Panel)  
**Architecture:** Monorepo (Turborepo)

Task Approval System, şirket içi çalışanların görev/talep oluşturabildiği ve yöneticilerin bu talepleri rol bazlı olarak inceleyip onaylayabildiği bir web uygulamasıdır.

Bu proje, gerçek hayata yakın bir frontend–backend ayrımı ile **profesyonel mimari tasarım** hedeflenerek geliştirilmiştir.

---

## 2. Goals & Objectives

### Business Goals

- Çalışan taleplerinin merkezi ve izlenebilir şekilde yönetilmesi
- Onay süreçlerinde rol bazlı yetkilendirme
- Kullanıcı dostu, responsive ve hızlı arayüz

### Technical Goals

- Frontend ve backend ayrımının net olması
- Paylaşılan domain modelleri ile tutarlı yapı
- Gerçekçi ancak **lightweight** backend kullanımı
- Ölçeklenebilir monorepo mimarisi

---

## 3. User Personas

### Employee (User Panel)

- Talep oluşturur
- Taleplerinin durumunu takip eder
- Red sebebini görüntüler

### Admin Roles (Admin Panel)

| Role      | Capabilities                           |
| --------- | -------------------------------------- |
| Viewer    | Talepleri görüntüleyebilir             |
| Moderator | Talepleri onaylayabilir / reddedebilir |
| Admin     | Tüm yetkiler + kullanıcı yönetimi      |

---

## 4. Functional Requirements (Full Case Coverage)

This section is updated to **explicitly map every requirement from the provided case study**. Each feature listed below directly corresponds to an item in the original case description.

> This section strictly follows and fully covers all requirements defined in the original case study. No requirement is intentionally omitted.

### 4.1 User Panel (Port: 3000)

#### Pages & Features (Case-Aligned)

**Login**

- Email & password authentication
- Session persistence (JWT)
- Invalid credentials error handling

**Dashboard**

- Total task count
- Pending / Approved / Rejected task counts
- Recent tasks summary

**Create Task**

- Required fields: title, description
- Priority selection (low / normal / high / urgent)
- Category selection (Technical Support / Leave Request / Purchase / Other)
- Client-side form validation
- Error messages for invalid input
- Success notification after submission

**My Tasks**

- Table view of created tasks
- Status filter (All / Pending / Approved / Rejected)
- Task detail view
- Display rejection reason for rejected tasks

---

### 4.2 Admin Panel (Port: 3001)

#### Roles & Permissions (As Defined in Case)

| Role      | Permissions                       |
| --------- | --------------------------------- |
| Viewer    | View tasks only                   |
| Moderator | View, approve, reject tasks       |
| Admin     | All permissions + user management |

#### Pages & Features

**Login**

- Email & password authentication
- Role-based menu and button access

**Dashboard**

- Total pending task count
- Daily approved / rejected statistics
- Priority-based task distribution

**Pending Tasks**

- List of pending tasks
- Filter by priority and category
- Search by task title or creator
- Pagination
- Row actions:
  - Approve task
  - Reject task (rejection reason required)
- Viewer role:
  - Action buttons disabled
  - Tooltip explaining insufficient permission

**All Tasks (Admin, Moderator)**

- List of all tasks (all statuses)
- Filters: status, priority, date
- Task detail view

**User Management (Admin Only)**

- List admin panel users
- Create new user (name, email, password, role)
- Edit user
- Delete user with confirmation dialog
- Route-level access restriction (Viewer & Moderator blocked)

---

## 5. Non-Functional Requirements

- Responsive design
- Loading ve error state yönetimi
- Toast notification sistemi
- Tooltip ile disabled buton açıklamaları
- Dark / Light mode (Mantine)

---

# 🛠 TECHNICAL DESIGN DOCUMENT

> This technical design is explicitly aligned with the original case study requirements, including Redux Toolkit usage, async handling, role-based access control, and UI expectations.

## 1. Architecture Overview

### Case Alignment Statement

This architecture was designed to **fully satisfy the original case requirements**, while extending them in a controlled and documented manner (Express API, Prisma, Docker) without violating scope expectations.

### Monorepo Structure (Turborepo)

```txt
case-study/
├── apps/
│   ├── user-panel/        # React + Vite + Mantine
│   ├── admin-panel/       # React + Vite + Mantine
│   └── api/               # Express + Prisma + SQLite
│
├── packages/
│   ├── ui/                # Shared UI components
│   ├── api-client/        # Axios instance & services
│   ├── store/             # Redux Toolkit slices
│   ├── types/             # Shared TypeScript types
│   └── config/            # ESLint & TS configs
│
├── docker/
│   └── docker-compose.yml
│
├── turbo.json
└── README.md
```

---

## 2. Frontend Technology Stack (Case-Compliant)

**Mandatory (as per case):**

- React
- TypeScript
- Redux Toolkit
- React Router
- Axios
- SCSS / CSS Modules

**Chosen Additions (Allowed by case):**

- Vite (build tool)
- Mantine UI (UI library)

All mandatory technologies listed in the case study are explicitly used.

- React 18 + TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- Mantine UI
- SCSS / CSS Modules

### State Management Strategy (Redux Toolkit)

The following Redux Toolkit patterns required by the case are implemented:

- `createSlice`
- `createAsyncThunk`
- Centralized loading & error states
- Async request lifecycle handling

| State Type                | Tool          |
| ------------------------- | ------------- |
| Auth                      | Redux Toolkit |
| Tasks                     | Redux Toolkit |
| Admin Users               | Redux Toolkit |
| UI (modal, tooltip, form) | Local State   |

| State Type     | Tool        |
| -------------- | ----------- |
| Auth           | Redux       |
| Tasks          | Redux       |
| Admin Users    | Redux       |
| Forms / Modals | Local State |

---

## 3. Backend Architecture (Express API)

Although the original case allowed mock APIs, this project implements a **lightweight Express.js API** to fully support all required flows:

- Authentication for User & Admin panels
- Task creation, listing, approval, rejection
- Role-based authorization aligned with case table

### Supported API Endpoints (Case-Mapped)

- `POST /auth/login`
- `GET /tasks` (filters: status, priority, category)
- `POST /tasks`
- `PATCH /tasks/:id/approve`
- `PATCH /tasks/:id/reject`
- `GET /admin/users`
- `POST /admin/users`
- `PUT /admin/users/:id`
- `DELETE /admin/users/:id`

The API strictly mirrors the task lifecycle and role permissions defined in the case study.

---

## 4. Database Design (Prisma)

### Models

- User (Employee)
- AdminUser
- Task

Enums:

- Role
- Priority
- Status

### Persistence Strategy

SQLite is used for simplicity and persistence without production-level complexity.

---

## 5. Authentication & Authorization (Case Mapping)

### Authentication (Case Requirement)

- Email & password login
- JWT-based session handling
- 401 responses redirect users to login pages

### Authorization (Case Requirement)

- Backend: Role-based middleware
- Frontend: Route guards + disabled UI

| Action           | Admin | Moderator | Viewer |
| ---------------- | ----- | --------- | ------ |
| View Dashboard   | ✓     | ✓         | ✓      |
| Approve / Reject | ✓     | ✓         | ✗      |
| View All Tasks   | ✓     | ✓         | ✗      |
| User Management  | ✓     | ✗         | ✗      |

### Authentication

- JWT issued on login
- Token stored on client
- Axios interceptor for auth header

### Authorization

- Backend: role middleware (403)
- Frontend: route guards + disabled UI

---

## 6. Shared Packages Strategy (Case-Oriented)

Shared packages are designed to **reduce duplication between User Panel and Admin Panel**, while keeping both applications independently runnable as required by the case.

### @repo/types

- Task
- AdminUser
- Priority / Status / Role enums

### @repo/api-client

- Axios instance
- Auth interceptor (Authorization header)
- 401 global handler (redirect to login)

### @repo/ui

- PriorityBadge (color-coded)
- StatusBadge (color-coded)
- ConfirmDialog (approve / reject / delete)
- Shared loading and empty states

### @repo/types

- Task
- User
- AdminUser
- Enums

### @repo/api-client

- Axios instance
- Auth service
- Task service

### @repo/ui

- StatusBadge
- PriorityBadge
- ConfirmDialog

---

## 7. Docker Strategy (Optional Case Enhancement)

Docker support is added **optionally** and does not replace local setup.

- Used only for API
- Intended for local development convenience
- Not production-oriented

This aligns with the case's optional tooling flexibility.

- Docker is provided for local development convenience
- Single container for API
- SQLite volume persistence

---

## 8. Error Handling & UX (UI Expectations Compliance)

All UI expectations from the case are explicitly implemented:

- Color-coded priority badges (urgent: red, high: orange, etc.)
- Color-coded status badges (pending: yellow, approved: green, rejected: red)
- Loading spinners / skeletons for async states
- Toast notifications for all CRUD operations
- Confirmation dialogs for destructive actions (reject, delete)
- Responsive layout for all screens
- Disabled buttons with explanatory tooltips

- Centralized API error handling
- Toast notifications for success/error
- Skeleton loaders for async views

---

## 9. Known Limitations (Case Transparency)

- Backend implementation exceeds mock API requirement but remains lightweight
- SQLite is used for simplicity and persistence
- Real-time updates are not implemented (optional bonus)
- Automated tests are not included (optional bonus)

These limitations are disclosed intentionally and align with the scope of the original case study. (Transparent Disclosure)

- Backend is intentionally lightweight
- SQLite is not intended for production usage
- No real-time socket implementation
- No automated tests (optional bonus item)

These limitations are acknowledged intentionally to keep focus on frontend architecture, as required by the case.

- SQLite is not intended for production
- No real-time socket implementation
- No automated tests (optional bonus)

---

## 10. Future Improvements (Bonus Case Items)

- Multi-language support (TR / EN)
- Dark / Light theme toggle
- WebSocket-based real-time updates
- Unit and integration tests
- CI pipeline integration

- WebSocket for real-time updates
- Unit & integration tests
- CI pipeline
- PostgreSQL support

---

✅ This document intentionally balances professional architecture with controlled scope to demonstrate real-world frontend system design skills.
