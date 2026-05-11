import { api } from '../api/api.ts';

/**
 * Auth API endpoints for GitHub OAuth PKCE flow
 * 
 * Flow:
 * 1. getAuthUrl() - GET /api/auth/github - Backend generates PKCE values and redirects to GitHub
 * 2. Backend handles callback - GET /api/auth/github/callback?code=...&state=... (backend redirects back to frontend)
 * 3. getCurrentUser() - GET /api/users/me - Fetch authenticated user
 * 4. logout() - POST /api/auth/logout - Clear session
 */
const authSlice = api.injectEndpoints({
    endpoints: (build) => ({
        // Step 1: Get OAuth redirect URL from backend
        // Backend generates PKCE values (code_challenge, state) and returns GitHub OAuth URL
        // OR redirects directly to GitHub (depending on implementation)
        getAuthUrl: build.query<{ authorizationUrl: string }, void>({
            query: () => ({
                url: '/api/auth/github',
                method: 'GET',
            }),
        }),

        // Step 2: Fetch current authenticated user
        // Used to check authentication status and get user data
        // With credentials: 'include', session cookie is sent automatically
        getCurrentUser: build.query<any, void>({
            query: () => ({
                url: '/api/users/me',
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),

        // Step 3: Logout
        // Clears session cookie on backend
        logout: build.mutation<void, void>({
            query: () => ({
                url: '/api/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
    })
});

export const {
    useGetAuthUrlQuery,
    useGetCurrentUserQuery,
    useLogoutMutation,
} = authSlice;