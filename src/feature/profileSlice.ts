import { api } from '../api/api.ts';

interface CreateProfileArgs {
    name: string;
}

interface SearchProfilesArgs {
    q: string;
    page: number;
    limit: number;
}
interface ExportProfilesArgs {
    sort_by: string;
    order : 'asc' | 'desc';
    format: 'csv';
}
interface Profile{
    sort_by: string;
    order : 'asc' | 'desc';
}

const profileSlice = api.injectEndpoints({
    endpoints: (build) => ({
        createProfile: build.mutation({
            query: (args: CreateProfileArgs) => ({
                url: `/api/profiles`,
                method: 'POST',
                body: args,
                providesTags: ['Profile'],
            })
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
            query: (args: Profile) => ({
                url: `/api/profiles?sort_by=${args.sort_by}&order=${args.order}`,
                method: 'GET',
                providesTags: ['Profile'],
            })
        }),
        deleteProfile: build.mutation({
            query: (id: string) => ({
                url: `/api/profiles/${id}`,
                method: 'DELETE',
                providesTags: ['Profile'],
            })
        })
    })
})

export const { useCreateProfileMutation, useSearchProfilesQuery, useExportProfilesQuery, useGetProfileByIdQuery, useGetProfilesQuery, useDeleteProfileMutation } = profileSlice;