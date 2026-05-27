# Frontend File Structure
**Branch:** `nandini`  
**Framework:** React 19 + Vite 6 · Tailwind CSS 4 · Axios  
**Entry point:** `frontend/index.html` → `src/main.jsx`  
**Dev server:** `http://localhost:5173` (Vite default)  
**API target:** `http://localhost:3000` (proxied via axios base URL)

---

## Directory Tree

```
frontend/
├── package.json                        # Dependencies & npm scripts (dev|build|lint|preview)
├── vite.config.js                      # Vite config — React plugin, Tailwind integration
├── eslint.config.js                    # ESLint flat config — React hooks + refresh rules
├── index.html                          # Shell HTML — mounts <div id="root">, loads main.jsx
├── design.md                           # UI/UX design notes & component decisions
├── README.md                           # Frontend-specific readme
│
├── public/                             # Static assets served as-is (no hashing)
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    ├── main.jsx                        # ReactDOM.createRoot — wraps App in AuthProvider
    ├── App.jsx                         # Root component — React Router routes definition
    ├── App.css                         # Global app-level styles
    ├── index.css                       # Tailwind base/components/utilities directives
    │
    ├── api/
    │   └── axios.js                    # Axios instance — baseURL, withCredentials:true,
    │                                   #   request/response interceptors (auth headers, 401 handling)
    │
    ├── context/
    │   └── AuthContext.jsx             # AuthProvider — user state, login(), logout(), me()
    │                                   #   Wraps the app; exposes useAuth() hook
    │
    ├── components/
    │   ├── index.js                    # Barrel export for all components
    │   ├── ProtectedRoute.jsx          # HOC — redirects to /login if unauthenticated
    │   ├── Unauthorized.jsx            # 403 page — shown when role check fails
    │   │
    │   ├── LoginPage/
    │   │   └── LoginPage.jsx           # Email + password form → POST /api/auth/login
    │   │
    │   ├── RegisterPage/
    │   │   └── RegisterPage.jsx        # Registration form → POST /api/auth/signup
    │   │
    │   ├── SignupPage/
    │   │   └── SignupPage.jsx          # Alternate signup page (variant / A-B)
    │   │
    │   ├── HeroSection/
    │   │   └── HeroSection.jsx         # Landing hero — headline, CTA buttons
    │   │
    │   ├── HeroGraphic/
    │   │   └── HeroGraphic.jsx         # Decorative graphic/illustration for the hero
    │   │
    │   ├── ApiStatusBadge/
    │   │   └── ApiStatusBadge.jsx      # Polls GET /api/health, shows live API status
    │   │
    │   ├── CounterButton/
    │   │   └── CounterButton.jsx       # Demo interactive counter component
    │   │
    │   ├── DividerTicks/
    │   │   └── DividerTicks.jsx        # Decorative section divider with tick marks
    │   │
    │   └── NextSteps/
    │       └── NextSteps.jsx           # Onboarding / "what to do next" guide component
    │
    └── assets/                         # Bundled static assets (hashed in prod build)
        ├── hero.png                    # Hero section background / illustration
        ├── react.svg                   # React logo (Vite starter leftover)
        └── vite.svg                    # Vite logo (Vite starter leftover)
```

---

## Component Map

| Component | Route / Usage | Purpose |
|---|---|---|
| `App.jsx` | — | Defines all `<Route>` entries via React Router |
| `AuthContext` | Wraps entire app | Global user session state + auth actions |
| `ProtectedRoute` | Wraps private routes | Redirect to `/login` if no session |
| `Unauthorized` | `/unauthorized` | Shown on 403 / role mismatch |
| `LoginPage` | `/login` | Auth form, sets cookie via API |
| `RegisterPage` | `/register` | New account creation |
| `SignupPage` | `/signup` | Alternate signup flow |
| `HeroSection` | `/` (landing) | Marketing hero with headline + CTA |
| `HeroGraphic` | Inside `HeroSection` | Illustration / animation |
| `ApiStatusBadge` | Dev toolbar / landing | Live backend health indicator |
| `CounterButton` | Demo page | Stateful counter (starter demo) |
| `DividerTicks` | Layout | Visual section separator |
| `NextSteps` | Post-login / onboarding | Guides new users to next actions |

---

## Data Flow

```
main.jsx
  └─ <AuthProvider>          ← AuthContext — holds { user, login, logout }
       └─ <App />
            ├─ <ProtectedRoute>
            │    └─ [private pages]
            └─ [public pages]  /login  /register  /signup
```

```
Component  →  axios instance (src/api/axios.js)
                  ├─ baseURL: http://localhost:3000
                  ├─ withCredentials: true  (sends cookie)
                  └─ 401 interceptor → redirect to /login
```

---

## npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Start dev server with HMR on `:5173` |
| `build` | `vite build` | Production bundle → `dist/` |
| `preview` | `vite preview` | Serve the `dist/` build locally |
| `lint` | `eslint .` | Run ESLint across all source files |

---

## Key Dependencies

| Package | Version | Role |
|---|---|---|
| `react` + `react-dom` | 19 | UI framework |
| `tailwindcss` + `@tailwindcss/vite` | 4 | Utility-first CSS (Vite plugin) |
| `axios` | latest | HTTP client with interceptors |
| `vite` | 6 | Build tool & dev server |
| `@vitejs/plugin-react` | latest | JSX transform + Fast Refresh |
