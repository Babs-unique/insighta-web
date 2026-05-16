import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetCurrentUserQuery } from '@/feature/authSlice';
import { useDispatch } from 'react-redux';
import { login } from '@/feature/apiSlice';

export function AuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const { data: user, isLoading, error: fetchError } = useGetCurrentUserQuery(undefined, {
        skip: hasAttemptedFetch && !user, // Don't keep retrying if it failed
    });

    // Handle GitHub OAuth errors
    useEffect(() => {
        if (error) {
        console.error('OAuth Error:', error, errorDescription);
        navigate('/login?error=' + error);
        }
    }, [error, errorDescription, navigate]);

    useEffect(() => {
        if (!isLoading && user && !hasAttemptedFetch) {
        setHasAttemptedFetch(true);
        dispatch(login(user));
        navigate('/app');
        }
    }, [user, isLoading, hasAttemptedFetch, dispatch, navigate]);

    useEffect(() => {
        if (fetchError && !hasAttemptedFetch) {
        setHasAttemptedFetch(true);
        console.error('Authentication failed:', fetchError);
        navigate('/login?error=auth_failed');
        }
    }, [fetchError, hasAttemptedFetch, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center p-6">
        <div className="text-center">
            <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
            <h2 className="text-xl text-white mt-6 mb-2">
            Setting up your account...
            </h2>
            <p className="text-gray-400 text-sm">
            Please wait while we complete your GitHub authentication.
            </p>

            {fetchError && !hasAttemptedFetch && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-400 text-sm">
                Authentication failed. Please try again.
                </p>
            </div>
            )}
        </div>
        </div>
    );
    }
