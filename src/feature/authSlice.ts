import { api } from '../api/api.ts';


const authSlice = api.injectEndpoints({
    endpoints: (build) => ({
        githubAuth: build.query({
            query: () => ({
                url: '/api/auth/github',
                method: 'GET',
                providesTags: ['Auth'],
            })
        }),
        githubCallback: build.query({
            query: ({code, state} : { code: string; state: string }) => ({
                url: '/api/auth/github/callback',
                method: 'POST',
                params: { code, state },
                providesTags: ['Auth'],
            })
        }),
        logout: build.mutation({
            query:(refreshToken: string) => ({
                url: '/api/auth/logout',
                method: 'POST',
                body: { refreshToken },
                providesTags: ['Auth'],
            })
        }),
        me: build.query({
            query: () => ({
                url: '/api/users/me',
                method: 'GET',
                providesTags: ['Auth'],
            })
        })
    })
});

export const { useGithubAuthQuery, useGithubCallbackQuery, useLogoutMutation, useMeQuery } = authSlice;