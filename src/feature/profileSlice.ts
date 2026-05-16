import { api } from '../api/api.ts';

interface CreateProfileArgs {
    name: string;
    gender?: string;
    age?: number;
    country?: string;
}

interface SearchProfilesArgs {
    q: string;
    page: number;
    limit: number;
}
interface ExportProfilesArgs {
    sort_by: string;
    order: 'asc' | 'desc';
    format: 'csv' | 'json' | 'xlsx' | 'txt';
}

interface GetProfilesArgs {
    page?: number;
    limit?: number;
    gender?: string;
    ageGroup?: string;
    country?: string;
    minAge?: string;
    maxAge?: string;
    sort_by?: string;
    order?: 'asc' | 'desc';
}

interface UpdateProfileArgs {
    id: string;
    name?: string;
    gender?: string;
    age?: number;
    country?: string;
}

const profileSlice = api.injectEndpoints({
    endpoints: (build) => ({
        createProfile: build.mutation({
            query: (args: CreateProfileArgs) => ({
                url: `/api/profiles`,
                method: 'POST',
                body: args,
            }),
            invalidatesTags: ['Profile'],
        }),
        searchProfiles: build.query({
            query: (args: SearchProfilesArgs) => ({
                url: `/api/profiles/search?q=${args.q}&page=${args.page}&limit=${args.limit}`,
                method: 'GET',
                providesTags: ['Profile'],
            })
        }),
        exportProfiles: build.query({
            query: (args: ExportProfilesArgs) => ({
                url: `/api/profiles/export?sort_by=${args.sort_by}&order=${args.order}&format=${args.format}`,
                method: 'GET',
                providesTags: ['Profile'],
            })
        }),
        getProfileById: build.query({
            query: (id: string) => ({
                url: `/api/profiles/${id}`,
                method: 'GET',
                providesTags: ['Profile'],
            })
        }),
        getProfiles: build.query({
            query: (args?: GetProfilesArgs) => {
                const params = new URLSearchParams();
                if (args?.page) params.append('page', args.page.toString());
                if (args?.limit) params.append('limit', args.limit.toString());
                if (args?.gender && args.gender !== 'all') params.append('gender', args.gender);
                if (args?.ageGroup && args.ageGroup !== 'all') params.append('ageGroup', args.ageGroup);
                if (args?.country) params.append('country', args.country);
                if (args?.minAge) params.append('minAge', args.minAge);
                if (args?.maxAge) params.append('maxAge', args.maxAge);
                if (args?.sort_by) params.append('sort_by', args.sort_by);
                if (args?.order) params.append('order', args.order);
                
                const queryString = params.toString();
                return {
                    url: `/api/profiles${queryString ? '?' + queryString : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Profile'],
        }),
        deleteProfile: build.mutation({
            query: (id: string) => ({
                url: `/api/profiles/${id}`,
                method: 'DELETE',
                invalidatesTags: ['Profile'],
            })
        }),
        updateProfile: build.mutation({
            query: (args: UpdateProfileArgs) => ({
                url: `/api/profiles/${args.id}`,
                method: 'PUT',
                body: args,
                invalidatesTags: ['Profile'],
            })
        })
    })
});

export const { useCreateProfileMutation, useSearchProfilesQuery, useExportProfilesQuery, useGetProfileByIdQuery, useGetProfilesQuery, useDeleteProfileMutation, useUpdateProfileMutation } = profileSlice;