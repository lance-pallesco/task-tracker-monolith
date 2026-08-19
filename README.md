# Multi-Tenant Task Tracker

A modular monolithic task management module built with **Laravel, Inertia.js, React, TypeScript, Tailwind CSS, and Pest PHP**, designed around strict company-level tenant isolation and a clean, icon-free Shadcn UI.

---

## Features

- **Full CRUD Operations**: Create, view, edit, and delete company tasks with title, description, status, priority, and due date.
- **Strict Multi-Tenant Isolation**: 3-layer defensive authorization ensuring users cannot view, query, or mutate tasks belonging to other companies.
- **Inertia.js Monolithic Flow**: Server-driven state delivering strongly typed props directly to React components without REST/CORS boilerplate.
- **Clean & Modern UI**: Built with **Shadcn UI** components, Google Font **Manrope**, metric summary cards, and clean typography with zero icons and emojis.
- **Automated Pest PHP Tests**: Comprehensive test suite verifying multi-tenant isolation boundaries and complete CRUD lifecycle.

---

## Tech Stack

- **Backend**: PHP 8.2+, Laravel 11/12/13, SQLite
- **Frontend**: React 18, TypeScript, Inertia.js, Tailwind CSS, Shadcn UI
- **Typography**: Google Fonts (Manrope)
- **Testing**: Pest PHP

---

## How to Run Locally

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+ & NPM

### Setup Steps

```bash
# 1. Install dependencies
composer install
npm install --legacy-peer-deps

# 2. Environment configuration
cp .env.example .env
php artisan key:generate

# 3. Migrate and Seed Demo Tenants
php artisan migrate --seed

# 4. Build frontend assets
npm run build

# 5. Start dev servers (in separate terminals)
php artisan serve
npm run dev
```

The application will be accessible at: **`http://localhost:8000`**

---

## Demo Credentials

The database seeder provisions two isolated company tenants with ready-to-test accounts:

| Company Tenant | Email | Password | Scope |
|---|---|---|---|
| **Acme Corp** | `alex@acme.com` | `password` | Tenant A Tasks |
| **Globex Inc** | `sarah@globex.com` | `password` | Tenant B Tasks |

Log in as `alex@acme.com` to manage Acme Corp's tasks. Log in as `sarah@globex.com` to confirm that Acme Corp's tasks are completely isolated and unreachable.

---

## Running Automated Tests

Run the Pest PHP test suite to verify tenant security and CRUD features:

```bash
php artisan test
```

---

## Architectural Decisions

1. **Monolith with Inertia.js over REST SPA**:
   - The frontend and backend live in a unified repository. Inertia eliminates boilerplate REST endpoints, duplicate route definitions, and client-side token management while retaining server-side session authentication and CSRF protection.

2. **3-Layer Defensive Tenancy Architecture**:
   - **Layer 1 (Controller Query Scope)**: All task queries explicitly chain `Task::forCompany($companyId)`.
   - **Layer 2 (Policy Authorization)**: `TaskPolicy` validates `$user->company_id === $task->company_id` on every action.
   - **Layer 3 (Form Request Sanitization & Injection)**: `StoreTaskRequest` automatically injects `$request->user()->company_id` directly from the authenticated session, preventing foreign tenant ID spoofing in the client payload.

3. **Composite Database Indexing**:
   - The `tasks` table includes a composite index on `['company_id', 'status', 'created_at']` for optimal tenant-scoped query and filter performance.

4. **Clean, Text-First UI**:
   - Built with Shadcn UI components styled with neutral tones and Google Font Manrope. Avoids visual clutter by using clean text labels and pill badges instead of icons or emojis.

---

## AI Tools Used & Reflection

### Tools Used
- **Antigravity / Cursor / Claude**: Used for rapid boilerplate scaffolding, migrations, Shadcn UI setup, and initial Pest test skeletons.

### Engineering Reflection: Tenant Safety in Form Requests
When scaffolding the `TaskController@store` method, standard boilerplate often generates un-scoped `Task::create($request->all())` and passes `company_id` via a hidden input on the client form.

- **Risk Identified**: Passing `company_id` in the client request payload exposes a vulnerability where a malicious user could tamper with the request body to create tasks under a foreign company.
- **Resolution**: Removed `company_id` from the client request payload entirely. Implemented a `tenantData()` helper method on `StoreTaskRequest` that securely injects the tenant ID from the trusted session (`$this->user()->company_id`).
