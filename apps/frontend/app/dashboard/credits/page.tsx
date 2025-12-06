'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Transaction {
    id: number;
    type: string;
    amount: number;
    balanceAfter: number;
    createdAt: string;
    metadata?: Record<string, unknown>;
}

interface Credits {
    balance: number;
    totalPurchased: number;
    totalUsed: number;
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function CreditsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Fetch current user's credits
    const fetchMyCredits = async () => {
        try {
            setLoading(true);

            // Get auth token from server (httpOnly cookie can't be read client-side)
            const authRes = await fetch('/api/auth/check');
            const authData = await authRes.json();

            if (!authData.authenticated || !authData.token) {
                router.push('/dashboard/login');
                return;
            }

            const token = authData.token;

            // Fetch my credits
            const creditsRes = await fetch(`${STRAPI_URL}/api/user-credits/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (creditsRes.ok) {
                const data = await creditsRes.json();
                setCredits(data);
            } else {
                // User might not have credits yet - show 0
                setCredits({ balance: 0, totalPurchased: 0, totalUsed: 0 });
            }

            // Fetch my transactions
            const txRes = await fetch(`${STRAPI_URL}/api/credit-transactions/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (txRes.ok) {
                const txData = await txRes.json();
                setTransactions(txData.data || []);
            }
        } catch (error) {
            console.error('Error fetching credits:', error);
            toast.error('Failed to load credits');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCredits();
    }, []);

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'admin_add':
            case 'signup_bonus':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'photo_generation':
            case 'video_generation':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'refund':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const formatTransactionType = (type: string) => {
        const labels: Record<string, string> = {
            admin_add: 'Credits Added',
            signup_bonus: 'Welcome Bonus',
            photo_generation: 'Photo Generated',
            video_generation: 'Video Generated',
            refund: 'Refund',
        };
        return labels[type] || type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'admin_add':
            case 'signup_bonus':
                return '➕';
            case 'photo_generation':
                return '📸';
            case 'video_generation':
                return '🎬';
            case 'refund':
                return '↩️';
            default:
                return '💫';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Credits</h1>
                <p className="text-gray-500">View your AI generation credits</p>
            </div>

            {/* Credit Balance Card */}
            <div className="bg-gradient-to-br from-primary via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/70 text-sm font-medium mb-1">Available Credits</p>
                        <p className="text-6xl font-bold">{credits?.balance || 0}</p>
                    </div>
                    <div className="text-8xl opacity-30">💎</div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-white/70 text-sm">Total Received</p>
                        <p className="text-2xl font-semibold">{credits?.totalPurchased || 0}</p>
                    </div>
                    <div>
                        <p className="text-white/70 text-sm">Total Used</p>
                        <p className="text-2xl font-semibold">{credits?.totalUsed || 0}</p>
                    </div>
                </div>
            </div>

            {/* Pricing Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                        📸
                    </div>
                    <div>
                        <p className="text-gray-900 font-semibold">Photo Generation</p>
                        <p className="text-gray-500">1 credit per photo</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">
                        🎬
                    </div>
                    <div>
                        <p className="text-gray-900 font-semibold">Video Generation</p>
                        <p className="text-gray-500">3 credits per video</p>
                    </div>
                </div>
            </div>

            {/* Need More Credits */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">💡</div>
                    <div>
                        <h3 className="font-semibold text-amber-800">Need More Credits?</h3>
                        <p className="text-amber-700 text-sm mt-1">
                            Contact us to purchase additional credits for your AI photo generation needs.
                        </p>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
                    <p className="text-sm text-gray-500">Your recent credit activity</p>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-5xl mb-4">📋</div>
                        <p className="text-gray-500">No transactions yet</p>
                        <p className="text-gray-400 text-sm">Your credit activity will appear here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                        {getTransactionIcon(tx.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{formatTransactionType(tx.type)}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(tx.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </p>
                                    <p className="text-xs text-gray-400">Balance: {tx.balanceAfter}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
