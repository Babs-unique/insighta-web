import { api } from '../api/api.ts';

const authSlice = api.injectEndpoints({
    endpoints: (build) => ({
        getAuthUrl: build.query<{ authorizationUrl: string }, void>({
            query: () => ({
                url: '/api/auth/github',
                method: 'GET',
            }),
        }),
        getCurrentUser: build.query<any, void>({
            query: () => ({
                url: '/api/users/me',
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),
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