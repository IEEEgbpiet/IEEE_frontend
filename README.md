# IEEE GBPIET Student Branch Website

A React and Vite website for the IEEE Student Branch at G.B. Pant Institute of Engineering and Technology.

## Stack

- React 18 and TypeScript
- Vite
- React Router
- ESLint and Prettier

## Module-based structure

```text
src/
├── components/                 # Cross-module layout and UI components
├── config/                     # Site and navigation configuration
├── data/                       # Feature-scoped static content
│   ├── home/
│   ├── about/
│   ├── teams/
│   ├── contact/
│   └── activities/
├── lib/                        # Reusable application logic
├── modules/                    # Feature modules
│   ├── home/
│   │   ├── components/
│   │   └── page.tsx
│   ├── about/
│   │   ├── components/
│   │   └── page.tsx
│   ├── teams/
│   │   ├── components/
│   │   └── page.tsx
│   ├── contact/
│   │   ├── components/
│   │   └── page.tsx
│   └── activities/
│       ├── components/
│       └── page.tsx
├── pages/NotFoundPage.tsx      # 404 route
├── utils/                      # Small generic helpers
├── main.tsx                    # React entry point
└── router.tsx                  # Application routes
```

Shared components belong in `src/components`. Components used only by one feature should stay inside that feature's `modules/<name>/components` directory. Its content belongs under the matching `src/data/<name>` directory.

## Routes

| URL           | Module     |
| ------------- | ---------- |
| `/`           | Home       |
| `/about`      | About      |
| `/activities` | Activities |
| `/teams`      | Teams      |
| `/contact`    | Contact    |
| any other URL | 404 page   |

## Run locally

Requires Node.js 18.17 or newer.

```bash
npm install
copy env.example .env
npm run dev
```

The development server defaults to `http://localhost:5173`.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run format:check
npm run build
```

`public/` contains static assets and is preserved during builds. Add only browser-safe variables beginning with `VITE_` to `.env`; those values are exposed to client-side code.
