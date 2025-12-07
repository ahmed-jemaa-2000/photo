import { useState, useEffect, useCallback } from 'react';

// AI API base URL (port 3001 for credits endpoint)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
// Dashboard URL (port 3000 for auth check) - uses subdomain in production
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL ||
    (import.meta.env.PROD ? 'https://dashboard.brandili.shop' : 'http://localhost:3000');

/**
 * Hook to fetch and manage user credits
 * Handles cross-origin auth by fetching token from Dashboard first
 */
export function useCredits() {
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    const fetchCredits = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Step 1: Get auth token from Dashboard (handles httpOnly cookie)
            let token = authToken;
            if (!token) {
                try {
                    const authRes = await fetch(`${DASHBOARD_URL}/api/auth/check`, {
                        credentials: 'include', // Include cookies for Dashboard
                    });
                    if (authRes.ok) {
                        const authData = await authRes.json();
                        if (authData.authenticated && authData.token) {
                            token = authData.token;
                            setAuthToken(token);
                        }
                    }
                } catch (authErr) {
                    console.log('Could not fetch auth from Dashboard:', authErr.message);
                }
            }

            // Step 2: Fetch credits from AI API with Authorization header
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE}/api/credits`, {
                credentials: 'include', // Also try cookies as fallback
                headers,
            });

            if (response.status === 401) {
                // Not authenticated - that's ok, credits are optional
                setCredits(null);
                setAuthToken(null);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch credits');
            }

            const data = await response.json();
            setCredits({
                balance: data.balance,
                costs: data.costs,
            });
        } catch (err) {
            console.error('Error fetching credits:', err);
            setError(err.message);
            setCredits(null);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchCredits();
    }, []);

    const refreshCredits = () => {
        fetchCredits();
    };

    // Update credits after generation (from response)
    const updateCredits = (newBalance) => {
        if (credits) {
            setCredits((prev) => ({
                ...prev,
                balance: newBalance,
            }));
        }
    };

    return {
        credits,
        loading,
        error,
        refreshCredits,
        updateCredits,
        isAuthenticated: credits !== null && !loading,
        authToken, // Expose token for other components to use
    };
}

export default useCredits;

