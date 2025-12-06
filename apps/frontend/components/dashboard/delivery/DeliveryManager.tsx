'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Order } from '@busi/types';
import { Loader2, Printer, Truck } from 'lucide-react';

interface DeliveryManagerProps {
    initialOrders: Order[];
    shopName?: string;
}

export default function DeliveryManager({ initialOrders, shopName }: DeliveryManagerProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [selectedOrderIds, setSelectedOrderIds] = useState<Set<number>>(new Set());
    const [isPrinting, setIsPrinting] = useState(false);

    // Filter only confirmed orders for delivery
    const readyOrders = orders.filter(o => o.status === 'confirmed');

    const toggleOrder = (orderId: number) => {
        const newSelected = new Set(selectedOrderIds);
        if (newSelected.has(orderId)) {
            newSelected.delete(orderId);
        } else {
            newSelected.add(orderId);
        }
        setSelectedOrderIds(newSelected);
    };

    const toggleAll = () => {
        if (selectedOrderIds.size === readyOrders.length) {
            setSelectedOrderIds(new Set());
        } else {
            setSelectedOrderIds(new Set(readyOrders.map(o => o.id)));
        }
    };

    const handlePrintBordereau = async () => {
        if (selectedOrderIds.size === 0) {
            toast.error('Select at least one order');
            return;
        }

        setIsPrinting(true);

        try {
            // 1. Update status to 'shipped'
            // In a real app, we would call an API here to update statuses
            // For now, we'll just simulate it and open the print window

            // 2. Open Print Window
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                toast.error('Please allow popups to print');
                return;
            }

            const selectedOrders = orders.filter(o => selectedOrderIds.has(o.id));
            const totalAmount = selectedOrders.reduce((sum, o) => sum + (o.items?.reduce((s, i) => s + i.totalPrice, 0) || 0), 0);

            const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Bordereau de Livraison - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
            .header { margin-bottom: 40px; display: flex; justify-content: space-between; }
            .total { margin-top: 20px; text-align: right; font-size: 1.2em; font-weight: bold; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; }
            .signature { border-top: 1px solid #000; padding-top: 10px; width: 200px; text-align: center; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Bordereau de Livraison</h1>
              <p>Date: ${new Date().toLocaleDateString()}</p>
              <p>Commandes: ${selectedOrders.length}</p>
            </div>
            <div style="text-align: right;">
              <h2>${shopName || selectedOrders[0]?.shop?.name || 'Boutique'}</h2>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Ref</th>
                <th>Client</th>
                <th>Téléphone</th>
                <th>Adresse / Gouvernorat</th>
                <th>Montant (TND)</th>
                <th>Signature Client</th>
              </tr>
            </thead>
            <tbody>
              ${selectedOrders.map(o => `
                <tr>
                  <td>#${o.id}</td>
                  <td>${o.customerName}</td>
                  <td>${o.customerPhone}</td>
                  <td>${o.customerAddress || '-'}</td>
                  <td>${(o.items?.reduce((s, i) => s + i.totalPrice, 0) || 0).toFixed(3)}</td>
                  <td></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            Total à Encaisser: ${totalAmount.toFixed(3)} TND
          </div>

          <div class="footer">
            <div class="signature">Signature Livreur</div>
            <div class="signature">Cachet & Signature Shop</div>
          </div>

          <script>
            window.onload = () => window.print();
          </script>
        </body>
        </html>
      `;

            printWindow.document.write(html);
            printWindow.document.close();

            toast.success('Bordereau generated!');

            // Optimistically update UI
            // In reality, we should refetch or update based on API response

        } catch (error) {
            console.error('Error printing:', error);
            toast.error('Failed to generate bordereau');
        } finally {
            setIsPrinting(false);
        }
    };

    if (readyOrders.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No Orders Ready for Delivery</h3>
                <p className="text-gray-500 mt-1">Confirm some orders first to generate a bordereau.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectedOrderIds.size === readyOrders.length && readyOrders.length > 0}
                            onChange={toggleAll}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">Select All ({readyOrders.length})</span>
                    </div>
                    <div className="h-6 w-px bg-gray-200" />
                    <span className="text-sm text-gray-600">
                        {selectedOrderIds.size} selected
                    </span>
                </div>

                <button
                    onClick={handlePrintBordereau}
                    disabled={selectedOrderIds.size === 0 || isPrinting}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                    Imprimer Bordereau
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="w-12 p-4"></th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Order</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Location</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Amount (COD)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {readyOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedOrderIds.has(order.id)}
                                        onChange={() => toggleOrder(order.id)}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </td>
                                <td className="p-4">
                                    <span className="font-medium text-gray-900">#{order.id}</span>
                                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{order.customerName}</div>
                                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {order.customerAddress || '-'}
                                </td>
                                <td className="p-4 text-right font-medium text-gray-900">
                                    {(order.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0).toFixed(3)} TND
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
