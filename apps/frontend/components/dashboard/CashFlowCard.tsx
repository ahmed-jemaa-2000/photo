'use client';

import { useEffect, useState } from 'react';
import { Order } from '@busi/types';
import { CheckCircle2, Coins, Truck, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CashFlowCardProps {
    orders: Order[];
}

export default function CashFlowCard({ orders }: CashFlowCardProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [localOrders, setLocalOrders] = useState<Order[]>(orders);

    useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);

    const calculateTotal = (status: string | string[]) => {
        const statuses = Array.isArray(status) ? status : [status];
        return localOrders
            .filter(o => statuses.includes(o.status))
            .reduce((sum, o) => sum + (o.items?.reduce((s, i) => s + i.totalPrice, 0) || 0), 0);
    };

    // Workflow buckets
    const enRoute = calculateTotal(['confirmed', 'shipped']);
    const toCollect = calculateTotal('delivered');
    const collected = calculateTotal('completed');

    const deliveredOrders = localOrders.filter(o => o.status === 'delivered');

    const handleMarkAsPaid = async (orderId: number) => {
        setLoadingId(orderId);
        const previous = [...localOrders];
        // Optimistic update
        setLocalOrders((current) => current.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
        try {
            const res = await fetch(`/api/dashboard/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' }),
            });

            if (!res.ok) throw new Error('Failed to update order');

            toast.success('Payment collected!');
            router.refresh();
        } catch (error) {
            console.error(error);
            setLocalOrders(previous);
            toast.error('Failed to update status');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                    <Coins className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Cash Flow (COD)</h2>
                    <p className="text-sm text-gray-500">Track your cash on delivery</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                        <Truck className="w-4 h-4" />
                        <span className="text-sm font-medium">En Route</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{enRoute.toFixed(3)} <span className="text-sm font-normal">TND</span></div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-700 mb-2">
                        <Wallet className="w-4 h-4" />
                        <span className="text-sm font-medium">To Collect</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-900">{toCollect.toFixed(3)} <span className="text-sm font-normal">TND</span></div>
                </div>

                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Collected</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{collected.toFixed(3)} <span className="text-sm font-normal">TND</span></div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Pending Collections</h3>
                {deliveredOrders.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                        No delivered COD orders waiting for collection.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {deliveredOrders.map(order => (
                            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                                <div>
                                    <div className="font-medium text-gray-900">#{order.id} - {order.customerName}</div>
                                    <div className="text-sm text-gray-500">
                                        {(order.items?.reduce((s, i) => s + i.totalPrice, 0) || 0).toFixed(3)} TND
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleMarkAsPaid(order.id)}
                                    disabled={loadingId === order.id}
                                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {loadingId === order.id ? 'Saving...' : 'Mark Paid'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
