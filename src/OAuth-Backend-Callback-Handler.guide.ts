// OAuth PKCE Flow Implementation Guide - With Backend Callback Handler
// ========================================================================
//
// Your backend handles the entire OAuth exchange:
// - GET /api/auth/github - Redirects to GitHub
// - GET /api/auth/github/callback - Handles GitHub callback, exchanges code, redirects back to frontend

// ============================================================================
// ARCHITECTURE OVERVIEW
// ============================================================================

/**
 * Frontend OAuth Flow with Backend Callback Handler:
 *
 * 1. USER INITIATES LOGIN
 *    └─> LoginPage.tsx
 *        ├─ Calls getAuthUrl query (GET /api/auth/github)
 *        ├─ Backend returns GitHub OAuth URL
 *        └─ On button click: window.location.href = authData.url
 *
 * 2. GITHUB REDIRECTS TO BACKEND CALLBACK
 *    └─> Backend's handleGitHubCallback() at GET /api/auth/github/callback?code=...&state=...
 *        ├─ Validates state (CSRF protection)
 *        ├─ Exchanges code + code_verifier with GitHub
 *        ├─ Creates JWT or session cookie
 *        ├─ Sets HttpOnly Set-Cookie header
 *        └─ Redirects back to frontend: https://yourapp.com/auth/callback
 *
 * 3. FRONTEND CALLBACK PAGE
 *    └─> AuthCallbackPage.tsx receives redirect
 *        ├─ Backend has already set session cookie
 *        ├─ Calls getCurrentUser query (validates session)
 *        ├─ Dispatches login action to Redux
 *        └─ Redirects to /app on success
 *
 * 4. USER ACCESSING PROTECTED ROUTES
 *    └─> ProtectedRoute.tsx wraps protected pages
 *        ├─ Calls getCurrentUser query
 *        ├─ Session cookie included automatically (credentials: 'include')
 *        └─ If valid: render children | If invalid: redirect to /login
 */

// ============================================================================
// BACKEND REQUIREMENTS (Your Implementation)
// ============================================================================

/**
 * GET /api/auth/github
 * 
 * Responsibility:
 * - Option A: Generate PKCE values and return GitHub OAuth URL
 *   Returns: { url: "https://github.com/login/oauth/authorize?..." }
 * 
 * - Option B: Generate PKCE values and redirect directly to GitHub
 *   Returns: 302 redirect to GitHub
 * 
 * Example:
 * app.get('/api/auth/github', (req, res) => {
 *   const state = generateRandomState();
 *   const codeChallenge = generateCodeChallenge();
 *   
 *   // Store in session (server-side)
 *   req.session.oauthState = state;
 *   req.session.codeVerifier = codeVerifier;
 *   
 *   const url = `https://github.com/login/oauth/authorize?` +
 *     `client_id=${GITHUB_CLIENT_ID}&` +
 *     `redirect_uri=${CALLBACK_URL}&` +
 *     `scope=user&` +
 *     `state=${state}&` +
 *     `code_challenge=${codeChallenge}&` +
 *     `code_challenge_method=S256`;
 *   
 *   // Option A: Return URL
 *   res.json({ url });
 *   
 *   // Option B: Redirect directly
 *   // res.redirect(url);
 * });
 */

/**
 * GET /api/auth/github/callback?code=...&state=...
 * 
 * This is YOUR implementation. Responsibility:
 * - Validate state matches stored state (CSRF protection)
 * - Retrieve stored code_verifier
 * - Exchange code + code_verifier with GitHub
 * - Create JWT or session cookie
 * - Set HttpOnly Set-Cookie header with SameSite and Secure flags
 * - Redirect to frontend: /auth/callback
 * 
 * Example:
 * app.get('/auth/github/callback', handleGitHubCallback);
 * 
 * async function handleGitHubCallback(req, res) {
 *   const { code, state } = req.query;
 *   
 *   // Validate state
 *   if (state !== req.session.oauthState) {
 *     return res.redirect('/?error=state_mismatch');
 *   }
 *   
 *   try {
 *     // Exchange code with GitHub
 *     const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
 *       method: 'POST',
 *       headers: { 'Accept': 'application/json' },
 *       body: new URLSearchParams({
 *         client_id: GITHUB_CLIENT_ID,
 *         client_secret: GITHUB_CLIENT_SECRET,
 *         code,
 *         redirect_uri: CALLBACK_URL,
 *         code_verifier: req.session.codeVerifier,
 *       })
 *     });
 *     
 *     const tokenData = await tokenResponse.json();
 *     
 *     // Get user info from GitHub
 *     const userResponse = await fetch('https://api.github.com/user', {
 *       headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
 *     });
 *     
 *     const user = await userResponse.json();
 *     
 *     // Create session or JWT
 *     req.session.userId = user.id;
 *     req.session.user = user;
 *     
 *     // Redirect to frontend callback
 *     res.redirect('https://yourapp.com/auth/callback');
 *   } catch (error) {
 *     res.redirect('/?error=auth_failed');
 *   }
 * }
 */

/**
 * GET /api/users/me
 * Cookie: [session cookie sent automatically]
 * Returns: { id, email, name, ... } or 401
 * 
 * Responsibility:
 * - Validate session cookie
 * - Return authenticated user data
 * - Return 401 if session invalid/expired
 * 
 * Example:
 * app.get('/api/users/me', (req, res) => {
 *   if (!req.session.userId) {
 *     return res.status(401).json({ error: 'Not authenticated' });
 *   }
 *   res.json(req.session.user);
 * });
 */

/**
 * POST /api/auth/logout
 * Cookie: [session cookie sent automatically]
 * Returns: 200 OK
 * 
 * Responsibility:
 * - Invalidate session cookie
 * - Clear server-side session
 * - Return 200 OK
 * 
 * Example:
 * app.post('/api/auth/logout', (req, res) => {
 *   req.session.destroy();
 *   res.clearCookie('connect.sid'); // or your session cookie name
 *   res.json({ success: true });
 * });
 */

// ============================================================================
// FRONTEND FLOW EXPLANATION
// ============================================================================

/**
 * Step 1: User clicks "Continue with GitHub" on LoginPage
 * 
 * Action:
 * - useGetAuthUrlQuery fetches GET /api/auth/github
 * - Backend returns { url: "https://github.com/login/oauth/authorize?..." }
 * - window.location.href = url (full page redirect)
 * 
 * Why window.location.href:
 * - RTK Query is for same-origin API calls
 * - GitHub is different origin, requires full page navigation
 * 
 * Backend State:
 * - Generates random state token
 * - Generates code_verifier and code_challenge (PKCE)
 * - Stores state and code_verifier in session (server-side)
 * - Returns OAuth URL with challenge
 */

/**
 * Step 2: User Authenticates on GitHub
 * 
 * Action:
 * - Full page at github.com
 * - User enters GitHub credentials
 * - GitHub approves access to your app
 * 
 * Backend State:
 * - Session still contains state, code_verifier, code_challenge
 */

/**
 * Step 3: GitHub Redirects Back to Backend Callback
 * 
 * GitHub redirects to:
 * GET /api/auth/github/callback?code=...&state=...
 * 
 * Your Backend:
 * 1. Validates state (CSRF protection)
 * 2. Exchanges code + code_verifier with GitHub
 * 3. Gets user data from GitHub
 * 4. Creates session or JWT
 * 5. Sets HttpOnly Set-Cookie header
 * 6. Redirects to frontend: /auth/callback
 */

/**
 * Step 4: Frontend Receives Callback
 * 
 * AuthCallbackPage mounted at:
 * GET https://yourapp.com/auth/callback
 * 
 * Component:
 * 1. Backend has already set session cookie
 * 2. Calls useGetCurrentUserQuery (GET /api/users/me)
 * 3. Session cookie sent automatically (credentials: 'include')
 * 4. Backend validates session and returns user
 * 5. Component dispatches login(user) to Redux
 * 6. Redirects to /app
 */

/**
 * Why NOT fetch user on backend redirect?
 * 
 * Frontend immediately after backend redirect could have:
 * - Cookie not set yet (race condition)
 * - Cookie set but not readable to JavaScript
 * 
 * Solution:
 * - Call useGetCurrentUserQuery to validate session
 * - If 401: session not set properly, redirect to /login
 * - If 200: session valid, store user and redirect to /app
 */

// ============================================================================
// SECURITY FLOW
// ============================================================================

/**
 * PKCE (Proof Key for Code Exchange)
 * 
 * Why it's important:
 * - Authorization code can be intercepted in URL
 * - Without PKCE, attacker could exchange code for token
 * - With PKCE, attacker needs code_verifier (stored on backend)
 * 
 * Flow:
 * 1. Backend generates code_verifier (random string)
 * 2. Backend creates code_challenge = SHA256(code_verifier)
 * 3. Backend stores code_verifier securely (server-side)
 * 4. Backend redirects to GitHub with code_challenge
 * 5. GitHub returns authorization code
 * 6. Backend proves it owns code_verifier when exchanging code
 * 7. GitHub validates code_challenge matches code_verifier
 * 8. Token exchange only succeeds with correct code_verifier
 */

/**
 * State Parameter (CSRF Protection)
 * 
 * Why it's important:
 * - Prevents forged OAuth requests from attacker sites
 * - Validates response came from expected flow
 * 
 * Flow:
 * 1. Backend generates random state token
 * 2. Backend stores state in session
 * 3. Backend redirects to GitHub with state in URL
 * 4. GitHub includes state in redirect back
 * 5. Backend validates returned state matches stored state
 * 6. If mismatch: reject request, possible CSRF attack
 */

/**
 * HttpOnly Cookies
 * 
 * Why it's important:
 * - JavaScript cannot access session cookie
 * - XSS attack cannot steal token
 * - Only HTTP requests can send cookie
 * 
 * Flow:
 * 1. Backend sets Set-Cookie: connect.sid=...; HttpOnly; Secure; SameSite=Strict
 * 2. Browser stores cookie automatically
 * 3. JavaScript cannot access it (window.document.cookie won't show it)
 * 4. Every HTTP request includes it automatically
 * 5. Browser enforces SameSite: same-site requests only
 */

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * GitHub OAuth Errors:
 * 
 * GitHub can redirect with:
 * - ?error=access_denied (user declined)
 * - ?error=invalid_scope
 * - ?error=redirect_uri_mismatch
 * 
 * Frontend AuthCallbackPage handles this:
 * - Checks for error parameter
 * - Redirects to /login?error=...
 */

/**
 * Backend Exchange Errors:
 * 
 * Can happen during code exchange:
 * - Code already used (prevents replay attacks)
 * - Code expired (usually 10 minutes)
 * - State mismatch (possible CSRF attack)
 * - Network error with GitHub
 * 
 * Backend should:
 * - Catch errors in handleGitHubCallback
 * - Redirect to frontend with error: /?error=auth_failed
 */

/**
 * Session Expired:
 * 
 * When user's session expires:
 * 1. ProtectedRoute calls useGetCurrentUserQuery
 * 2. Backend returns 401 Unauthorized
 * 3. baseQueryWithReauth calls POST /api/auth/refresh
 * 4. If refresh succeeds: retry original request
 * 5. If refresh fails: dispatch logout() and redirect to /login
 */

// ============================================================================
// TESTING CHECKLIST
// ============================================================================

/**
 * [ ] GET /api/auth/github returns valid GitHub OAuth URL
 * [ ] Frontend button click redirects to GitHub
 * [ ] Cancel GitHub oauth shows error page
 * [ ] Complete GitHub oauth: backend callback endpoint works
 * [ ] Backend redirects to /auth/callback
 * [ ] Frontend fetches user successfully
 * [ ] Session cookie is set (check DevTools)
 * [ ] Frontend redirects to /app
 * [ ] Refreshing /app keeps user logged in
 * [ ] GET /api/users/me returns current user when authenticated
 * [ ] GET /api/users/me returns 401 when not authenticated
 * [ ] Logout clears session cookie
 * [ ] Accessing /app without session redirects to /login
 * [ ] Protected routes work with session cookies
 * [ ] Multiple tabs share same session
 */

export {};
