import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../feature/apiSlice'
import { api } from '../api/api'

/**
 * Redux Store Configuration
 *
 * Includes:
 * - auth: Auth state (user, isAuthenticated)
 * - api: RTK Query cache for all API endpoints
 *
 * The api middleware:
 * - Handles caching of API responses
 * - Invalidates tags when mutations complete
 * - Manages loading/error states
 */
export const store = configureStore({
    reducer: {
        auth: authReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch