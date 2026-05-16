import {  
    createApi, 
    fetchBaseQuery, 
    BaseQueryFn, 
    FetchArgs, 
    FetchBaseQueryError,
    BaseQueryApi
 } from '@reduxjs/toolkit/query/react';
import { logout } from '../feature/apiSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://insighta-api.onrender.com',
    credentials: 'include',
    prepareHeaders: (headers) => {
        headers.set('x-api-version', "1")
        return headers;
    }
})

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args : string | FetchArgs, api : BaseQueryApi, extraOptions : {}) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery({
            url : '/api/auth/refresh',
            method: 'POST',
        }, 
            api, extraOptions);
        if (refreshResult.data) {
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout()); 
        }
        }
    return result;
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Profile', 'Auth'],
    endpoints: () => ({})
})
