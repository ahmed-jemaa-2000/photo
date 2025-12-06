'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Order } from '@busi/types';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Phone,
  User,
  CreditCard
} from 'lucide-react';
import CreateOrderModal from '@/components/dashboard/orders/CreateOrderModal';
import PageTransition from '@/components/ui/PageTransition';
import { Skeleton } from '@/components/ui/Skeleton';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200', icon: Package },
  completed: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const STATUS_FLOW: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'completed'];

const getNextStatus = (status: Order['status']): Order['status'] | null => {
  const idx = STATUS_FLOW.indexOf(status);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/dashboard/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    const previousOrders = orders;
    const previousSelected = selectedOrder;

    // Optimistic UI update so the select reflects instantly
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    try {
      const response = await fetch(`/api/dashboard/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Order status updated');
        fetchOrders();
      } else {
        setOrders(previousOrders);
        setSelectedOrder(previousSelected);
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setOrders(previousOrders);
      setSelectedOrder(previousSelected);
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders
    .filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm) ||
      order.customerPhone.includes(searchTerm)
    )
    .filter(order => statusFilter === 'all' ? true : order.status === statusFilter);

  const statusCounts = STATUS_FLOW.reduce<Record<string, number>>((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status).length;
    return acc;
  }, {});

  const calculateTotal = (order: Order) => {
    return order.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="glass-card p-6 rounded-xl space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
            <p className="text-gray-500 mt-1">Manage and track your customer orders</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group relative overflow-hidden rounded-xl bg-primary px-6 py-3 text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/25 active:scale-95"
          >
            <div className="relative flex items-center gap-2 font-semibold">
              <span className="text-xl leading-none">+</span>
              New Order
            </div>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="glass-panel p-4 rounded-xl space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', ...STATUS_FLOW] as const).map((statusKey) => {
              const isAll = statusKey === 'all';
              const isActive = statusFilter === statusKey;
              const label = isAll ? 'All' : STATUS_CONFIG[statusKey as keyof typeof STATUS_CONFIG].label;
              const count = isAll ? orders.length : statusCounts[statusKey as keyof typeof statusCounts] || 0;

              return (
                <button
                  key={statusKey}
                  onClick={() => setStatusFilter(statusKey as any)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    isActive ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or create a new order.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const StatusIcon = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.icon || Clock;
                    const statusStyle = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;

                  return (
                    <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-medium text-gray-900">#{order.id}</span>
                      </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                              {order.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{order.customerName}</div>
                              <div className="text-xs text-gray-500">{order.customerPhone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {calculateTotal(order).toFixed(3)} <span className="text-xs text-gray-500 font-normal">TND</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {getNextStatus(order.status) && (
                          <button
                            onClick={() => {
                              const next = getNextStatus(order.status);
                              if (next) handleStatusChange(order.id, next);
                            }}
                            className="ml-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Advance to {STATUS_CONFIG[getNextStatus(order.status) as keyof typeof STATUS_CONFIG]?.label || 'Next'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-8">
                {/* Customer & Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Details</h3>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                          <p className="text-sm text-gray-500">Customer</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedOrder.customerPhone}</p>
                          <p className="text-sm text-gray-500">Mobile</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedOrder.customerAddress || 'No address provided'}</p>
                          <p className="text-sm text-gray-500">Delivery Address</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Status</h3>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Current Status</label>
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        >
                          {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                            <option key={value} value={value}>
                              {config.label}
                            </option>
                          ))}
                        </select>
                        {getNextStatus(selectedOrder.status) && (
                          <button
                            onClick={() => {
                              const next = getNextStatus(selectedOrder.status);
                              if (next) handleStatusChange(selectedOrder.id, next);
                            }}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90"
                          >
                            Move to {STATUS_CONFIG[getNextStatus(selectedOrder.status) as keyof typeof STATUS_CONFIG]?.label}
                          </button>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {STATUS_FLOW.map((status) => {
                            const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                            const isActive = selectedOrder.status === status;
                            const isDone = STATUS_FLOW.indexOf(status) < STATUS_FLOW.indexOf(selectedOrder.status);
                            return (
                              <span
                                key={status}
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ${
                                  isActive
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : isDone
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-200 bg-gray-100 text-gray-600'
                                }`}
                              >
                                {config.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CreditCard className="w-4 h-4" />
                        <span className="capitalize">{selectedOrder.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Order Items</h3>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-500">Item</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-500">Qty</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-500">Price</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedOrder.items?.map((item, index) => {
                          const product = typeof item.product === 'object' ? item.product : null;
                          return (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                <p className="font-medium text-gray-900">{product?.name || 'Product'}</p>
                                <p className="text-xs text-gray-500">
                                  {item.size && `Size: ${item.size}`}
                                  {item.size && item.color && ' • '}
                                  {item.color && `Color: ${item.color}`}
                                </p>
                              </td>
                              <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                              <td className="px-4 py-3 text-right text-gray-600">{item.unitPrice.toFixed(3)}</td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900">{item.totalPrice.toFixed(3)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-900">Total Amount</td>
                          <td className="px-4 py-3 text-right font-bold text-primary text-lg">
                            {calculateTotal(selectedOrder).toFixed(3)} <span className="text-xs font-normal text-gray-500">TND</span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-amber-800 mb-1">Notes</h4>
                    <p className="text-sm text-amber-700">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <CreateOrderModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onOrderCreated={fetchOrders}
        />
      </div>
    </PageTransition>
  );
}
