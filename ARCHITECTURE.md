# Raga AI - Project Architecture

> **Status**: Skeleton Complete ✅ | **Created**: January 17, 2026

---

## 📁 Complete Folder Structure

```
raga-ai/
├── public/
├── src/
│   ├── app/                          # Application-level wiring
│   │   ├── store.ts                  # Redux store setup
│   │   ├── hooks.ts                  # Typed Redux hooks
│   │   ├── router.tsx                # React Router configuration
│   │   └── providers.tsx             # Global providers wrapper
│   │
│   ├── features/                     # Business domains
│   │   ├── auth/                     # Authentication feature
│   │   │   ├── pages/                # Auth page components
│   │   │   │   └── .gitkeep
│   │   │   ├── components/           # Auth UI components
│   │   │   │   └── .gitkeep
│   │   │   ├── auth.slice.ts         # Redux slice
│   │   │   ├── auth.data.ts          # API/data layer
│   │   │   └── index.ts              # Public exports
│   │   │
│   │   └── dashboard/                # Dashboard feature
│   │       ├── pages/                # Dashboard pages
│   │       │   └── .gitkeep
│   │       ├── components/           # Dashboard components
│   │       │   └── .gitkeep
│   │       ├── dashboard.slice.ts    # Redux slice
│   │       ├── dashboard.data.ts     # API/data layer
│   │       └── index.ts              # Public exports
│   │
│   ├── shared/                       # Reusable, non-business code
│   │   ├── ui/                       # Design system components
│   │   │   └── index.ts
│   │   └── lib/                      # Shared utilities
│   │       └── index.ts
│   │
│   ├── layouts/                      # App-wide layouts
│   │   └── DashboardLayout.tsx
│   │
│   ├── styles/                       # Global styles
│   │   └── globals.css
│   │
│   ├── assets/                       # Static assets
│   │   └── react.svg
│   │
│   ├── App.tsx                       # Root component
│   └── main.tsx                      # Entry point
│
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── ARCHITECTURE.md                   # This file
```

---

## 📄 Files Created

### `src/app/` - Application Infrastructure

| File | Purpose |
|------|---------|
| `store.ts` | Redux store configuration (placeholder) |
| `hooks.ts` | Typed `useAppDispatch` and `useAppSelector` hooks |
| `router.tsx` | React Router setup with route definitions |
| `providers.tsx` | Wraps app with Redux Provider, Router, etc. |

### `src/features/auth/` - Authentication Feature

| File | Purpose |
|------|---------|
| `auth.slice.ts` | Redux slice for auth state management |
| `auth.data.ts` | API calls and data layer for auth |
| `index.ts` | Barrel exports for the auth feature |
| `pages/.gitkeep` | Placeholder for auth pages (LoginPage, etc.) |
| `components/.gitkeep` | Placeholder for auth components |

### `src/features/dashboard/` - Dashboard Feature

| File | Purpose |
|------|---------|
| `dashboard.slice.ts` | Redux slice for dashboard state |
| `dashboard.data.ts` | API calls and data layer for dashboard |
| `index.ts` | Barrel exports for dashboard feature |
| `pages/.gitkeep` | Placeholder for dashboard pages |
| `components/.gitkeep` | Placeholder for dashboard components |

### `src/shared/` - Reusable Code

| File | Purpose |
|------|---------|
| `ui/index.ts` | Design system components (Radix UI based) |
| `lib/index.ts` | Shared utilities (http client, helpers) |

### `src/layouts/` - Application Layouts

| File | Purpose |
|------|---------|
| `DashboardLayout.tsx` | Main dashboard layout with sidebar/header |

### `src/styles/` - Global Styles

| File | Purpose |
|------|---------|
| `globals.css` | CSS variables, reset, Tailwind directives |

### Root `src/` Files

| File | Purpose |
|------|---------|
| `App.tsx` | Root component that renders Providers |
| `main.tsx` | Entry point, renders App into DOM |

---

## 🏗️ Architectural Rules

### ✅ `app/` Folder Rules
- Contains **only** application infrastructure
- ❌ No feature logic
- ❌ No UI components  
- ❌ No API calls

### ✅ `features/` Folder Rules
- **One folder = One business feature**
- Feature owns: pages, components, Redux slice, data layer
- 🎯 **Deleting a feature folder completely removes that feature**

### ✅ `shared/` Folder Rules
- Only reusable, generic code
- ❌ No business rules
- ❌ No feature-specific state

### 🚫 Strictly Forbidden
- ❌ Global `components/` folder
- ❌ Global `services/` folder
- ❌ Global `utils.ts` dumping file

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React + TypeScript | UI Framework |
| Vite | Build Tool |
| Redux Toolkit | State Management (to be added) |
| React Router | Routing (to be added) |
| Radix UI | Accessible Components (to be added) |
| Tailwind CSS | Styling (to be added) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📋 Next Steps

1. [ ] Install Redux Toolkit: `npm install @reduxjs/toolkit react-redux`
2. [ ] Install React Router: `npm install react-router-dom`
3. [ ] Install Radix UI primitives
4. [ ] Install Tailwind CSS
5. [ ] Implement auth slice and pages
6. [ ] Implement dashboard slice and pages
