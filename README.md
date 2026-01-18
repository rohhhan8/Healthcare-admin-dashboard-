# RagaAI B2B Healthcare Admin Dashboard

![Design vs Implementation](/skeleton-wire.png)

![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

**A scalable, high-performance dashboard for healthcare analytics, built with React, Redux Toolkit, and Feature-Sliced Design principles.**

---

## 🛠️ Development Process

### Phase 1: Design & Planning ✍️
Before writing a single line of code, the architecture was visualized using pen-and-paper sketches. This step was crucial to define:
- **Layout Hierarchy**: Sidebar navigation vs. top-level filtering.
- **Data Flow**: How global filters (Date Range, Clinic ID) would cascade down to individual widgets.
- **Authentication**: Usage of robust protected routes.

*(See the skeleton sketch above for the initial vision)*

### Phase 2: Architectural Setup 🏗️
We adopted **Feature-Sliced Design (FSD)** principles to ensure long-term scalability.
- **Why?** In a standard "by-type" structure (components, hooks, utils), the codebase becomes a spaghetti of dependencies.
- **Solution**: We grouped code by **Feature** (e.g., `features/dashboard`). This means the Authentication logic is completely decoupled from the Dashboard analytics. "Deleting a folder removes the feature," promoting a modular and testable codebase.

### Phase 3: The "Skeleton" 🦴
Implementation began with the core infrastructure:
- **Router**: Setting up `react-router-dom` with a strict `PrioritizedProtectedRoute` wrapper.
- **Layouts**: Building the `DashboardLayout` shell to handle responsive navigation and user context.

### Phase 4: The Logic Core 🧠
Before building the UI, the state management layer was hardened:
- **Redux Store**: configured with strict type safety.
- **Persistence**: Implemented `localStorage` sync for Authentication to persist sessions across reloads.

---

## ⚡ Performance & Optimization (Technical Deep Dive)

This application is engineered to handle "Big Data" scenarios efficiently.

### 1. Smart Mock Data Engine 🏭
We did **NOT** use static JSON files. Instead, we built a **Runtime Generator** (`mockData.ts`) that creates **2,000+ relational records** largely simulating a real production database.
- **Capabilities**: Generates Clinics ↔ Patients ↔ Appointments with referential integrity.
- **Realism**: Uses real-time date math to distribute appointments across weeks/months relative to "today".

### 2. Memoization (`useMemo`) 🧠
Filtering 2,000+ patient records by "Clinic ID" and "Status" every time a user types in the search box is expensive.
- **Solution**: We use `useMemo` to cache filtered results. The heavy filtering logic only re-runs when dependencies (`searchTerm`, `filterCondition`) actually change, keeping the UI silky smooth (60fps).

### 3. Referential Stability (`useCallback`) ⚓
Functions passed down to complex Table components or Charts are wrapped in `useCallback`. This prevents the "Render Loop" problem where child components re-render unnecessarily because the function reference changed.

### 4. Redux Selectors (The "Brain") 🧮
We moved business logic OUT of components and INTO **Memoized Selectors** (`createSelector`).
- **Example**: Calculating "Average Treatment Cost by Age" involves iterating over all patients.
- **Benefit**: By doing this in a selector, the calculation is cached. If the Component re-renders but the Data hasn't changed, Redux returns the cached result instantly.

---

## 🚀 Key Features

*   **Multi-Tenant Analytics**: Seamlessly switch between a "Global Headquarters View" (All Clinics) and granular "Single Clinic View".
*   **Business Intelligence**:
    *   **Predictive Trends**: Line charts showing weekly appointment volume.
    *   **Demographics**: Pie charts for Disease Distribution and Scatter plots for Age vs. Cost analysis.
*   **Authentication & Security**: Full login flow with Route Guards ensuring only authorized access.
*   **Enterprise UI/UX**:
    *   Built with **Radix UI** primitives for accessibility.
    *   Styled with **CSS Variables** for instant Light/Dark mode switching.
    *   **Recharts** for responsive, animated data visualization.

---

## � Project Structure

```text
src/
├── app/
│   ├── hooks.ts         # Typed Redux hooks (useAppDispatch, useAppSelector)
│   └── store.ts         # The Central Brain (Redux Store configuration)
├── features/
│   ├── auth/            # Authentication feature (Slice, Login Page)
│   └── dashboard/
│       ├── api/         # The Generator (mockData.ts)
│       ├── components/  # Smart Widgets (StatsCards, Charts)
│       ├── pages/       # Route Views (Dashboard, Patients, Appointments)
│       ├── dashboard.slice.ts      # State Logic
│       └── dashboard.selectors.ts  # Memoized Performance Logic
├── shared/
│   └── ui/              # Reusable Enterprise Component Library (Atoms)
├── layouts/             # App Shells (Sidebar, Header)
└── styles/              # Global Design Tokens (globals.css)
```

---

## 🏃 Getting Started

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Start the development server**
    ```bash
    npm run dev
    ```

3.  **Build for production**
    ```bash
    npm run build
    ```

---

*Verified strict type safety with TypeScript & ESLint.*
