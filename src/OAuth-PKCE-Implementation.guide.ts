// OAuth PKCE Flow Implementation Guide
// ====================================
//
// This document explains the complete GitHub OAuth PKCE flow implementation
// with RTK Query, Redux, and React Router.

// ============================================================================
// ARCHITECTURE OVERVIEW
// ============================================================================

/**
 * Frontend OAuth Flow:
 *
 * 1. USER INITIATES LOGIN
 *    └─> LoginPage.tsx
 *        ├─ Loads getAuthUrl query (backend generates PKCE values)
 *        └─ On button click: window.location.href = authData.url
 *
 * 2. GITHUB REDIRECTS BACK TO FRONTEND
 *    └─> AuthCallbackPage.tsx receives ?code=...&state=...
 *        ├─ Calls exchangeCodeForToken mutation
 *        ├─ Backend validates code and returns session cookie
 *        ├─ Dispatches login action to Redux
 *        └─ Fetches user with getCurrentUser query
 *           └─> Redirects to /app on success
 *
 * 3. USER ACCESSING PROTECTED ROUTES
 *    └─> ProtectedRoute.tsx wraps protected pages
 *        ├─ Calls getCurrentUser query
 *        ├─ Session cookie included automatically (credentials: 'include')
 *        └─ If valid: render children
 *           If invalid: redirect to /login
 *
 * 4. USER LOGGING OUT
 *    └─> Call logout mutation
 *        ├─ Backend clears session cookie
 *        ├─ Dispatch logout action to Redux
 *        └─ Redirect to /login
 */

// ============================================================================
// KEY CONCEPTS
// ============================================================================

/**
 * WHY PKCE (Proof Key for Code Exchange)?
 * 
 * PKCE prevents authorization code interception attacks:
 * - Backend generates random `code_challenge` before redirecting to GitHub
 * - Backend stores `code_verifier` securely (server-side)
 * - When frontend sends `code` back, backend proves it owns the `code_verifier`
 * - This proves the frontend that intercepted the code actually started the flow
 * - Protects against man-in-the-middle attacks on mobile apps and SPAs
 */

/**
 * WHY credentials: 'include' ?
 * 
 * Allows automatic session cookie management:
 * - Frontend doesn't store tokens in localStorage/state
 * - Backend sets HttpOnly session cookie on exchange endpoint
 * - All subsequent requests include this cookie automatically
 * - Browser security: JavaScript can't access HttpOnly cookies
 * - CSRF protection: Same-site cookie attribute prevents cross-site requests
 */

/**
 * WHY window.location.href instead of RTK Query?
 * 
 * RTK Query is for API data fetching, not browser navigation:
 * - window.location.href is a full page navigation
 * - Redirects to GitHub's domain (different origin)
 * - RTK Query is for same-origin API calls
 * - We use RTK Query ONLY for code exchange after GitHub redirects back
 */

/**
 * WHY separate endpoints for URL and exchange?
 * 
 * getAuthUrl (query):
 * - Frontend needs to know GitHub OAuth URL before redirecting
 * - Backend generates PKCE values and returns URL
 * - Could be called by multiple users on same page
 *
 * exchangeCodeForToken (mutation):
 * - Only called after GitHub redirects user back
 * - Exchanges authorization code for token
 * - Mutations are better for side effects (setting cookies)
 */

// ============================================================================
// COOKIE AUTHENTICATION FLOW
// ============================================================================

/**
 * Why HttpOnly Cookies?
 * 
 * Security benefits:
 * - JavaScript cannot access the cookie (XSS protection)
 * - Only sent with HTTP requests (browser enforces this)
 * - Can include SameSite attribute (CSRF protection)
 * 
 * Flow:
 * 1. Frontend POST /api/auth/github/exchange with code
 * 2. Backend validates code with GitHub
 * 3. Backend creates JWT or session and sets HttpOnly cookie
 * 4. Response includes Set-Cookie header
 * 5. Browser stores cookie automatically
 * 6. All subsequent requests include cookie (credentials: 'include')
 */

/**
 * Why getCurrentUser query?
 * 
 * After exchangeCodeForToken succeeds:
 * - Need to fetch user data to confirm authentication
 * - RTK Query will include session cookie automatically
 * - Serves as both validation and data fetch
 * - On redirect back to /app, getCurrentUser confirms user is logged in
 */

// ============================================================================
// ERROR HANDLING FLOW
// ============================================================================

/**
 * OAuth Errors:
 * 
 * GitHub can return errors:
 * - ?error=access_denied (user declined)
 * - ?error=invalid_scope (scope issues)
 * - ?error=redirect_uri_mismatch (URL misconfiguration)
 * 
 * AuthCallbackPage checks for these and redirects to /login?error=...
 */

/**
 * Exchange Errors:
 * 
 * Code exchange can fail:
 * - Code already used (prevents replay attacks)
 * - Code expired (usually 10 minutes)
 * - State mismatch (CSRF protection)
 * - Network error
 * 
 * AuthCallbackPage catches these in try/catch and redirects to /login
 */

/**
 * Token Refresh (401 Handling):
 * 
 * baseQueryWithReauth in api.ts:
 * 1. Request fails with 401 Unauthorized
 * 2. Automatically calls POST /api/auth/refresh
 * 3. If refresh succeeds: retry original request
 * 4. If refresh fails: dispatch logout() and redirect to /login
 */

// ============================================================================
// REDUX STATE MANAGEMENT
// ============================================================================

/**
 * Redux Store Structure:
 * 
 * {
 *   auth: {
 *     user: { id, email, name, ... } or null,
 *     isAuthenticated: boolean
 *   },
 *   api: {
 *     // RTK Query cache - managed automatically
 *     // Contains cached responses for all queries
 *   }
 * }
 */

/**
 * When to use auth slice vs RTK Query cache:
 * 
 * Use auth slice (login/logout actions):
 * - Setting global auth state
 * - Used by ProtectedRoute to check if user is authenticated
 * - Dispatched when exchanging code or on logout
 * 
 * RTK Query:
 * - Fetch user data with credentials included
 * - Cache responses and invalidate on mutations
 * - Handle loading/error/success states automatically
 */

// ============================================================================
// FILE-BY-FILE EXPLANATION
// ============================================================================

/**
 * src/api/api.ts - RTK Query Setup
 * 
 * Purpose:
 * - Base query with credentials: 'include' (sends session cookie)
 * - Base query with reauth wrapper (handles 401 refresh)
 * - Creates API instance with tagTypes for cache invalidation
 * 
 * Why credentials: 'include':
 * - Session cookie sent with every request
 * - Backend validates session and returns user data
 */

/**
 * src/feature/authSlice.ts - OAuth Endpoints
 * 
 * Endpoints:
 * 
 * getAuthUrl (query):
 * - GET /api/auth/github
 * - Returns: { url: "https://github.com/login/oauth/authorize?..." }
 * - Used to initialize OAuth flow
 * 
 * exchangeCodeForToken (mutation):
 * - POST /api/auth/github/exchange with { code, state }
 * - Backend validates with GitHub
 * - Returns: { user: {...}, token: "..." }
 * - Backend sets HttpOnly session cookie
 * 
 * getCurrentUser (query):
 * - GET /api/users/me
 * - Validates session cookie
 * - Returns: { id, email, name, ... }
 * 
 * logout (mutation):
 * - POST /api/auth/logout
 * - Backend clears session cookie
 */

/**
 * src/feature/apiSlice.ts - Redux State
 * 
 * Actions:
 * 
 * login(user):
 * - Sets user data
 * - Sets isAuthenticated = true
 * - Used after successful exchange
 * 
 * logout():
 * - Clears user data
 * - Sets isAuthenticated = false
 * - Used on logout or 401 refresh failure
 */

/**
 * src/app/pages/LoginPage.tsx - Entry Point
 * 
 * Flow:
 * 1. useGetAuthUrlQuery fetches OAuth URL from backend
 * 2. Backend generates PKCE values and returns GitHub redirect URL
 * 3. User clicks "Continue with GitHub"
 * 4. window.location.href = authData.url (full page redirect to GitHub)
 * 
 * Why useGetAuthUrlQuery:
 * - Could be called multiple times (multiple users on same page)
 * - RTK Query caches the result
 * - Need fresh PKCE values for security
 * 
 * Why window.location.href:
 * - GitHub is different origin
 * - RTK Query is for same-origin API calls
 */

/**
 * src/app/pages/AuthCallbackPage.tsx - Callback Handler
 * 
 * Flow:
 * 1. GitHub redirects to /auth/callback?code=...&state=...
 * 2. Extract code and state from URL
 * 3. Call exchangeCodeForToken mutation with code and state
 * 4. Backend validates code with GitHub, creates session
 * 5. Dispatch login(user) to Redux
 * 6. Call getCurrentUser query to verify session
 * 7. On success: navigate to /app
 * 8. On error: navigate to /login?error=...
 * 
 * Why call getCurrentUser?
 * - Ensures session cookie is working
 * - Confirms backend session is valid
 * - Provides user data for authentication check
 */

/**
 * src/app/components/ProtectedRoute.tsx - Route Guard
 * 
 * Flow:
 * 1. Component mounts
 * 2. useGetCurrentUserQuery runs automatically
 * 3. Session cookie sent with request
 * 4. Backend validates session:
 *    - If valid: returns user data
 *    - If invalid: returns 401 error
 * 5. If user exists: render children
 * 6. If error or no user: redirect to /login
 * 
 * Why this pattern:
 * - Any route can use this wrapper
 * - Automatic session validation on each route
 * - Handles session expiration gracefully
 */

/**
 * src/services/store.ts - Redux Store
 * 
 * Includes:
 * - auth reducer (user state)
 * - api reducer (RTK Query cache)
 * - api middleware (for RTK Query functionality)
 * 
 * Why add api.middleware:
 * - RTK Query needs middleware to manage cache
 * - Handles request deduplication
 * - Handles cache invalidation on mutations
 */

/**
 * src/app/routes.tsx - React Router Setup
 * 
 * Routes:
 * 
 * / - LandingPage (public)
 * /login - LoginPage (public)
 * /auth/callback - AuthCallbackPage (OAuth redirect target)
 * /app/* - DashboardLayout with children (protected)
 * 
 * Why separate callback route:
 * - GitHub redirects to specific route
 * - Must match redirect_uri configured in GitHub app
 * - Only component that handles OAuth params
 */

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Required environment variables:
 * 
 * VITE_API_BASE_URL=http://localhost:3000
 * VITE_BASE_URL=/insighta-web (for routing)
 */

// ============================================================================
// BACKEND REQUIREMENTS
// ============================================================================

/**
 * Backend must implement:
 * 
 * GET /api/auth/github
 * Returns: { url: "https://github.com/login/oauth/authorize?..." }
 * 
 * Responsibility:
 * - Generate random code_challenge and code_verifier (PKCE)
 * - Store code_verifier in secure server-side session
 * - Generate state (CSRF token)
 * - Build GitHub OAuth URL with challenge and state
 * - Return URL to frontend
 * 
 * ---
 * 
 * POST /api/auth/github/exchange
 * Body: { code: string, state: string }
 * Returns: { user: {...}, token: "..." } or 200 with Set-Cookie
 * 
 * Responsibility:
 * - Validate state matches stored state
 * - Retrieve stored code_verifier
 * - Exchange code + code_verifier with GitHub
 * - Create JWT or session
 * - Set HttpOnly Set-Cookie header
 * - Return user data
 * 
 * ---
 * 
 * GET /api/users/me
 * Cookie: [session cookie sent automatically]
 * Returns: { id, email, name, ... } or 401
 * 
 * Responsibility:
 * - Validate session cookie
 * - Return authenticated user data
 * - Return 401 if session invalid/expired
 * 
 * ---
 * 
 * POST /api/auth/refresh
 * Cookie: [session cookie sent automatically]
 * Returns: New user session or 401
 * 
 * Responsibility:
 * - Called automatically on 401
 * - Refresh/validate session
 * - Set new cookie if needed
 * - Return 401 if cannot refresh
 * 
 * ---
 * 
 * POST /api/auth/logout
 * Cookie: [session cookie sent automatically]
 * Returns: 200 OK
 * 
 * Responsibility:
 * - Invalidate session cookie
 * - Clear server-side session
 * - Return 200 OK
 */

// ============================================================================
// SECURITY CONSIDERATIONS
// ============================================================================

/**
 * 1. PKCE Prevents Code Interception
 *    - Backend generates code_challenge before redirecting
 *    - Frontend never sees code_verifier
 *    - Proves ownership of the authorization code
 *
 * 2. State Parameter Prevents CSRF
 *    - Backend generates random state
 *    - Frontend must validate state matches
 *    - AuthCallbackPage validates this
 *
 * 3. HttpOnly Cookies Prevent XSS
 *    - JavaScript cannot access session cookie
 *    - Credentials: 'include' sends it automatically
 *    - Browser enforces same-site policy
 *
 * 4. SameSite Cookie Prevents CSRF
 *    - Backend sets SameSite=Strict or Lax
 *    - Cookie only sent from same site
 *    - Prevents forged cross-site requests
 *
 * 5. HTTPS Only in Production
 *    - Backend sets Secure flag on cookies
 *    - Cookies only sent over HTTPS
 *    - Prevents man-in-the-middle attacks
 */

// ============================================================================
// TESTING CHECKLIST
// ============================================================================

/**
 * [ ] Click "Continue with GitHub" redirects to GitHub
 * [ ] Cancel GitHub oauth returns to /login with error
 * [ ] Complete GitHub oauth redirects to /app
 * [ ] Accessing /app without auth redirects to /login
 * [ ] Refreshing /app keeps user logged in (session cookie works)
 * [ ] Logout clears session and redirects to /login
 * [ ] Session expires -> accessing /app triggers refresh -> works
 * [ ] Refresh fails -> redirects to /login
 * [ ] Network error on exchange -> shows error on callback page
 * [ ] Protected route renders only when authenticated
 * [ ] Multiple protected routes share same auth state
 */

export {};
