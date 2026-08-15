# Elearning Frontend Agent Rules

This file is the canonical rule source for every AI coding agent working in this
Vue repository. The words MUST, MUST NOT, REQUIRED, SHOULD, and SHOULD NOT are
normative.

## 1. Rule loading and precedence

1. Before searching, running commands, planning, reviewing, or editing, the agent
   MUST read this file completely.
2. The agent MUST also read every applicable `AGENTS.md` or tool-specific rule
   file between the repository root and the target file.
3. More specific scoped rules override general architecture or style rules.
4. Safety, data-preservation, secret-handling, and the prohibition on committing
   or pushing MUST NOT be weakened by a more specific rule.
5. If a user request conflicts with these non-overridable rules, the agent MUST
   stop and explain the conflict instead of silently ignoring a rule.

## 2. Absolute Git and workspace safety rules

- The agent MUST NOT run `git commit`, `git push`, create a pull request, merge,
  rebase, tag, release, publish, or deploy code. The human owner performs those
  operations.
- The agent MUST NOT run destructive Git commands such as `git reset --hard`,
  `git clean`, or checkout/restore commands that discard local changes.
- The agent MUST inspect `git status --short` before editing.
- Existing modified and untracked files belong to the user. The agent MUST
  preserve them and MUST NOT reformat, revert, delete, or include them in scope
  without explicit task requirements.
- The agent MUST keep changes narrowly scoped to the requested behavior.
- The agent MUST NOT edit generated, cached, dependency, or build output such as
  `node_modules/`, `dist/`, coverage, `.cache/`, or generated assets unless the
  task explicitly targets them.
- Secrets, real tokens, passwords, private keys, and production credentials MUST
  NOT be printed, committed, copied into documentation, or placed in frontend
  source. Browser code is public and cannot safely contain secrets.

## 3. Mandatory workflow for every task

### Before making changes

1. Read all applicable rules completely.
2. Inspect `git status --short` and identify pre-existing changes.
3. Trace the real behavior through route, layout/page, component, composable,
   query/store, API service, utility, style, and relevant tests.
4. Inspect the backend API contract before changing request/response assumptions.
5. Read neighboring code and reuse an established pattern when that pattern is
   safe and maintainable.
6. For a bug, reproduce or gather concrete evidence and identify the root cause
   before implementing a fix.
7. For a non-trivial feature or UI redesign, define states, data ownership,
   component boundaries, responsive behavior, and acceptance criteria first.

### While making changes

- Make the smallest coherent change that solves the task.
- Preserve routes, component contracts, API contracts, and query keys unless the
  task explicitly changes them.
- Do not perform opportunistic refactors unrelated to the requested behavior.
- Improve legacy code only in the touched path and only when needed for safety,
  clarity, or testability.
- Add or update focused tests for behavior changes and regressions.
- Never hide failures with empty catches, fake data, silent fallback, or a success
  UI that contradicts server state.

### Before reporting completion

1. Review the complete diff for accidental scope expansion and secrets.
2. Run the most focused relevant tests first, then broader checks proportional to
   risk.
3. Run lint/format checks applicable to changed files and run a production build
   for changes that affect bundling, routing, or components.
4. Run `git diff --check`.
5. Report the exact checks executed, their results, and any check that could not
   run. Never claim a check passed when it was not executed.
6. Separate code completion from browser acceptance, deployment, and backend
   availability.

## 4. Vue architecture and data ownership

The project uses Vue 3, Vite, Vue Router, TanStack Vue Query, Pinia, Axios,
Ant Design Vue, Element Plus, and Bootstrap. New and changed code MUST respect
the following boundaries without rewriting unrelated legacy code.

### Pages and views

- A route page owns route-level orchestration: reading route params, composing
  page sections, selecting layouts, and coordinating page-level loading/error
  states.
- Pages MUST NOT accumulate reusable presentation blocks, low-level HTTP code,
  or large amounts of domain logic.
- Route behavior MUST be declared in the router and remain compatible with direct
  navigation, browser refresh, history navigation, and invalid parameters.
- Authentication and authorization route guards MUST fail safely and MUST NOT
  depend only on hidden UI controls.

### Components

- A component MUST have one clear UI responsibility and a small explicit public
  interface.
- Reusable visual sections belong under `src/components/<domain>/`; route-specific
  composition stays in the page unless it is genuinely reused or independently
  testable.
- Prefer Vue 3 Composition API and `<script setup>` for new components.
- Props MUST be declared, named precisely, treated as immutable, and given safe
  defaults when optional.
- Emits MUST be declared and describe user/domain events rather than internal DOM
  implementation details.
- Parent components own data; child components request changes through emits or
  an explicit shared state boundary.
- Slots SHOULD be used for intentional presentation extension, not to hide an
  unclear component contract.
- Do not split components solely to reduce line count. Split when a section has a
  distinct responsibility, data dependency, lifecycle, reuse case, or test seam.
- A component approaching roughly 250-300 lines MUST be reviewed for mixed
  responsibilities. Keeping it large requires a clear reason.

### Composables

- Reusable stateful Vue logic belongs in a composable named `useXxx`.
- A composable MUST expose a small documented contract of refs/computed values and
  actions; do not expose internal mutable implementation state unnecessarily.
- Composables MUST NOT silently mutate unrelated global state.
- Lifecycle and browser event listeners MUST be registered and cleaned up in the
  same ownership boundary.
- Pure transformations SHOULD live in `src/utils/` rather than a composable.
- Do not create a composable that merely renames one API call without adding a
  meaningful reactive or domain boundary.

### API services

- Endpoint paths MUST be centralized under `src/config/apiEndpoints.js` or the
  established endpoint configuration.
- Axios/request implementation belongs in the API/service boundary, not scattered
  across components.
- Components and pages MUST NOT construct authorization headers or refresh-token
  behavior themselves.
- Request and response normalization MUST happen once at the boundary or in a
  named mapper, not repeatedly in templates.
- Never infer a changed backend contract. Inspect the backend route/controller or
  an authoritative API document before modifying consumers.
- Do not swallow HTTP errors. Convert them into a stable error shape while
  preserving enough information for the correct UI state and diagnosis.

### Vue Query server state

- Remote/server-owned data MUST use TanStack Vue Query when caching, background
  refresh, pagination, invalidation, or shared consumption is required.
- Query keys MUST be defined in focused query-key modules and include every input
  that changes the result, such as category, page, filter, customer, or course ID.
- Query functions MUST return normalized predictable data and MUST NOT depend on
  mutable component-local state outside the key.
- `staleTime`, polling, retry, and refetch behavior MUST be intentional and
  justified by product behavior; do not add polling by habit.
- Mutations MUST update or invalidate every affected cache deliberately. Avoid
  broad invalidation when a precise key is known.
- Never copy Vue Query results into Pinia or duplicate refs merely to create a
  second source of truth.
- Loading, background fetching, empty, partial, and error states MUST remain
  distinguishable in the UI.

### Pinia client state

- Pinia is for durable cross-route client state such as authenticated user state
  and UI/application state that is not owned by the server cache.
- Server collections and API response caches MUST NOT be mirrored in Pinia when
  Vue Query already owns them.
- Store actions contain state transitions, not DOM operations or component
  presentation logic.
- Store state MUST be serializable unless a documented browser-only integration
  requires otherwise.
- Persist only the minimum safe state. Access tokens MUST remain in approved
  in-memory storage; refresh tokens MUST remain in secure HttpOnly cookies and
  MUST NOT be read or persisted by JavaScript.

## 5. Component and UI behavior rules

### Required UI states

Every data-driven screen or section MUST deliberately handle:

- Initial loading.
- Background refresh when it affects interaction.
- Empty data.
- Recoverable error with an appropriate retry path.
- Unauthorized/forbidden state when relevant.
- Success feedback for user-initiated mutations.
- Disabled/submitting state that prevents accidental duplicate actions.

The UI MUST NOT display stale success, zero values, or empty arrays as a fallback
when the actual request failed unless that behavior is explicitly part of the
product contract.

### Accessibility

- Interactive elements MUST use semantic controls (`button`, `a`, form controls)
  instead of click handlers on non-interactive elements.
- Icon-only controls MUST have an accessible name via `aria-label` and SHOULD have
  a tooltip/title when the meaning is not obvious.
- Keyboard focus MUST be visible and navigation must remain usable without a
  mouse.
- Inputs MUST have associated labels; validation errors MUST identify the field
  and be available to assistive technology.
- Images require meaningful `alt` text, or empty `alt` when purely decorative.
- Text/background contrast and status indicators MUST not rely on color alone.

### Responsive layout

- UI changes MUST be checked at desktop and mobile widths relevant to the current
  layout.
- Avoid fixed widths/heights that clip translated text, zoomed content, or dynamic
  API values.
- Tables and sidebars MUST define overflow/collapse behavior rather than extending
  the viewport accidentally.
- Course-player changes MUST consider viewport height, sidebar visibility, video
  aspect ratio, and content below the player.

### UI libraries

- Prefer an existing project UI library/component before introducing another
  dependency or custom clone.
- Do not mix Ant Design Vue, Element Plus, Bootstrap, and custom components inside
  one small interaction without a concrete compatibility reason.
- New dependencies require an explicit need, bundle/runtime impact review, and
  user approval.
- Preserve the visual language of the surrounding feature unless the task is an
  intentional redesign.

## 6. JavaScript and Vue syntax/style

- Code MUST be valid modern ECMAScript supported by the current Vite target.
- Prettier is the formatting authority: no semicolons, single quotes, 100-column
  target, and two-space indentation as configured in the repository.
- ESLint errors in changed code MUST be resolved; rules MUST NOT be disabled
  without a narrow documented reason.
- Components use `PascalCase.vue`; composables use `useXxx.js`; utilities and
  services use descriptive `camelCase` filenames consistent with nearby code.
- Variables/functions use `camelCase`; constants use `UPPER_SNAKE_CASE` only for
  true constants; boolean names SHOULD start with `is`, `has`, `can`, or `should`.
- Names MUST describe domain meaning. Avoid vague names such as `data`, `item`,
  `info`, `temp`, `handleData`, or `result` when a precise name exists.
- Prefer `const`; use `let` only when reassignment is required; never use `var`.
- Use strict equality and explicit nullish handling. Do not use truthiness when
  zero, empty string, `false`, and missing have different meanings.
- Use optional chaining and nullish coalescing intentionally; they MUST NOT conceal
  a malformed API response.
- Use `computed` for derived reactive state. Use `watch` only for side effects,
  with explicit sources and cleanup when needed.
- Do not mutate arrays or objects received through props or Vue Query cache in
  place.
- Templates MUST remain readable. Move complex expressions and repeated
  conditions into named computed values or methods.
- Remove unused imports, dead code, `console.log`, debugger statements, commented
  code, and temporary mock UI unless the task explicitly requires a labeled mock.
- Comments explain why, constraints, or non-obvious contracts; they MUST NOT
  narrate obvious syntax.

## 7. CSS and visual style

- Component-specific styles SHOULD be scoped by default.
- Global CSS is reserved for tokens, reset/base rules, typography, layouts shared
  across routes, and documented utility classes.
- Reuse existing CSS variables/design tokens; introduce a named token when a value
  has shared semantic meaning.
- Avoid `!important`. It is permitted only to override an unavoidable third-party
  rule and MUST include a brief reason when non-obvious.
- Avoid deeply nested selectors and selectors coupled to generated library DOM.
- Class names MUST describe component responsibility/state, not incidental color
  or pixel values.
- Interactive states MUST define hover, focus-visible, active, disabled, and error
  behavior where applicable.
- Do not fix layout with arbitrary absolute positioning, large magic margins, or
  viewport-specific offsets without testing neighboring states.
- Assets MUST be imported/resolved through Vite or a configured public path; never
  use a developer-machine absolute filesystem path.

## 8. Authentication, security, and privacy

- Browser source is public. Never place secrets, private signing keys, privileged
  API credentials, or refresh tokens in JavaScript or `VITE_*` variables.
- Access tokens MUST use the approved in-memory token storage. They MUST NOT be
  moved to localStorage, sessionStorage, or readable cookies.
- Refresh tokens MUST be managed by the backend using HttpOnly/Secure/SameSite
  cookies and credentialed requests.
- Authentication refresh logic MUST have one concurrency-safe owner to prevent
  multiple simultaneous refresh requests and retry loops.
- Never render unsanitized server HTML with `v-html`. If trusted rich content is a
  requirement, use an approved sanitizer and document the trust boundary.
- Do not expose sensitive payloads, tokens, personal data, or complete server
  errors through logs, analytics, query keys, URLs, or UI notifications.
- Frontend route guards improve UX but do not replace backend authorization.

## 9. Testability and testing rules

- Every bug fix MUST include a regression test when behavior can be exercised
  reliably in the repository.
- Pure transformations, query-key factories, mappers, token storage, queues, and
  playback/streak calculations MUST be tested independently of Vue rendering.
- Query tests MUST verify key composition, normalized response shape, mutation
  invalidation/update behavior, and error handling where relevant.
- Component behavior SHOULD be extracted behind testable composables/utilities
  when the current test stack cannot mount components directly.
- Tests MUST be deterministic and MUST NOT rely on real timers, network calls,
  browser accounts, production APIs, or execution order.
- Mock the API boundary, not every internal function.
- Test observable behavior and contracts rather than private implementation.
- For race-prone behavior, test duplicate invocation, stale response ordering,
  cleanup/unmount, and retry/offline cases as applicable.

## 10. Required verification commands

Choose commands proportional to the change. Preferred checks are:

```powershell
npm test
npx eslint .
npx prettier --check src
npm run build
git diff --check
```

Important repository detail: `npm run lint` currently includes `--fix`, and
`npm run format` writes files. Agents MUST use the non-mutating commands above
for verification unless formatting task-scoped files is intentional.

- Run focused tests first when possible, for example:

```powershell
node --test tests/coursePlayer.test.js
node --test tests/cartQuery.test.js
```

- If Node, dependencies, browser access, the backend, or another runtime is
  unavailable, report the limitation and do not claim the check passed.
- A pre-existing failure MUST be separated clearly from failures introduced by
  the task.
- Browser inspection is REQUIRED before claiming visual acceptance for a UI or
  responsive change. A successful build alone does not prove correct layout.

## 11. Definition of done

A task is complete only when:

- The requested behavior and UI states are implemented.
- Data has one clear owner and API/query/store contracts remain coherent.
- Loading, empty, error, accessibility, and responsive behavior were considered.
- Relevant tests were added or an explicit reason was given for not adding them.
- Applicable checks were executed and accurately reported.
- Visual changes were inspected in a browser when the runtime was available.
- The diff contains no secrets, debug code, generated output, or unrelated
  rewrites.
- Documentation/configuration is updated when a public or operational contract
  changed.
- No commit, push, deployment, or publication was performed.

