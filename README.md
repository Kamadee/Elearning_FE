# E-learning Platform - Learner Frontend

A Vue 3 single-page application for an e-learning platform. It gives learners a
complete journey from course discovery and enrollment to video learning,
progress tracking, weekly streaks, and purchase-history management.

This repository is the learner-facing frontend. It integrates with the
[Laravel CMS/API](https://github.com/tahieuthang/Elearning_CMS) for authentication,
course data, payments, learning activity, and notifications.

## Highlights

- Browse hot courses, search courses, filter by category, paginate results, and
  view course details and reviews.
- Register an account, verify the email confirmation code, reset a password,
  and restore an authenticated session with an HttpOnly refresh cookie.
- Add or remove courses from the cart and start the VNPay sandbox checkout flow.
- Learn in a protected course player with video progress tracking and automatic
  resume data.
- Display purchased and free in-progress courses in **My Learn**.
- Track weekly learning streaks from eligible course-player activity, including
  offline progress queuing and synchronization after the connection returns.
- Show order-payment-success notifications in real time through authenticated
  Laravel Reverb private channels; notification history remains available after
  a page reload.
- View profiles, completed purchase history, blog posts, and course reviews.

## Frontend Architecture

- **Vue Router** owns navigation and route protection.
- **Pinia** stores authenticated-user and application UI state.
- **TanStack Vue Query** owns cached server state for courses, cart data,
  streaks, and notifications.
- **Axios** centralizes API calls, credentialed requests, access-token refresh,
  and request retry behavior.
- **Laravel Echo + Pusher JS** subscribe to Reverb channels for real-time order
  payment notifications.

The access token is kept in browser memory. The backend owns the refresh token
through an HttpOnly cookie; no refresh token or backend secret belongs in this
repository or in `VITE_*` variables.

## Tech Stack

- Vue 3 and Vite
- Vue Router and Pinia
- TanStack Vue Query and Axios
- Ant Design Vue, Bootstrap, and Swiper
- Laravel Echo and Pusher JS (Reverb-compatible WebSocket client)
- VeeValidate and Vue Toastification
- Sentry for optional client-side error monitoring

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- A running instance of the Laravel CMS/API

## Local Setup

```bash
git clone https://github.com/tahieuthang/Elearning_FE.git
cd Elearning_FE
npm install
cp .env.example .env
npm run dev
```

The Vite development server runs at `http://localhost:5173` by default.

For the Dockerized backend development environment, the API base URL is usually
`http://localhost:8081`.

## Environment Variables

Copy `.env.example` to `.env` and adjust values for the current environment.

| Variable              | Purpose                                    | Local example           |
| --------------------- | ------------------------------------------ | ----------------------- |
| `VITE_API_URL`        | Laravel API and broadcasting-auth base URL | `http://localhost:8081` |
| `VITE_REVERB_APP_KEY` | Public Reverb application key              | `local-app-key`         |
| `VITE_REVERB_HOST`    | Reverb WebSocket host                      | `localhost`             |
| `VITE_REVERB_PORT`    | Reverb WebSocket port                      | `8081`                  |
| `VITE_REVERB_SCHEME`  | WebSocket scheme: `http` or `https`        | `http`                  |
| `VITE_SENTRY_DSN`     | Optional public Sentry DSN                 | Omit locally if unused  |

`VITE_*` values are bundled into browser code. Never place passwords, private
keys, access tokens, refresh tokens, or server-side credentials in these
variables.

After changing a `VITE_*` variable, restart `npm run dev`. A production build
must be rebuilt and redeployed for the change to take effect.

## Available Scripts

| Command                    | Description                                       |
| -------------------------- | ------------------------------------------------- |
| `npm run dev`              | Start the Vite development server.                |
| `npm test`                 | Run the Node.js test suite.                       |
| `npx eslint .`             | Run ESLint without changing files.                |
| `npx prettier --check src` | Check Prettier formatting without changing files. |
| `npm run build`            | Create an optimized production build in `dist/`.  |
| `npm run preview`          | Preview the local production build.               |

`npm run lint` and `npm run format` are intentionally omitted from the table
above because they run with write/fix behavior.

## Project Structure

```text
src/
├── components/       Reusable course, cart, learning, dashboard, and notification UI
├── composables/      API, Vue Query, authentication, streak, and notification logic
├── config/           API endpoint and HTTP defaults
├── layouts/          Application layouts
├── pages/            Route-level pages
├── services/         Realtime Echo client and offline streak queue
├── stores/           Pinia application state
└── utils/            Pure UI, auth-token, formatting, and tracking helpers
```

## Integration Notes

- The application requires the Laravel backend to serve REST endpoints,
  broadcasting authorization, and Reverb configuration.
- The payment flow depends on VNPay sandbox credentials and an approved sandbox
  callback URL configured on the backend.
- Realtime order notifications require the backend queue worker and Reverb
  server to be running. If the WebSocket is temporarily unavailable, the REST
  notification list remains the durable source of truth and is refreshed after
  reconnection.

## Scope

This is a portfolio/demo application. Production availability depends on the
configured API, database, object storage, payment sandbox, email provider, DNS,
and WebSocket infrastructure.

## License

Maintained as a portfolio project.
