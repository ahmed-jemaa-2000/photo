'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, X } from 'lucide-react';
import type { Product } from '@busi/types';
import { TUNISIAN_GOVERNORATES } from '@/lib/constants/tunisia';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrderCreated: () => void;
}

interface OrderItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
}

export default function CreateOrderModal({ isOpen, onClose, onOrderCreated }: CreateOrderModalProps) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Form State
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [governorate, setGovernorate] = useState('');
    const [city, setCity] = useState('');
    const [notes, setNotes] = useState('');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

    // Item Selection State
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await fetch('/api/dashboard/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleAddItem = () => {
        if (!selectedProductId) return;

        const product = products.find(p => p.id === parseInt(selectedProductId));
        if (!product) return;

        const newItem: OrderItem = {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor,
        };

        setOrderItems([...orderItems, newItem]);

        // Reset selection
        setSelectedProductId('');
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    const calculateTotal = () => {
        return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (orderItems.length === 0) {
            toast.error('Please add at least one item');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/dashboard/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName,
                    customerPhone,
                    customerAddress: `${governorate} - ${city}`,
                    notes,
                    items: orderItems,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            toast.success('Order created successfully');
            onOrderCreated();
            onClose();

            // Reset form
            setCustomerName('');
            setCustomerPhone('');
            setGovernorate('');
            setCity('');
            setNotes('');
            setOrderItems([]);
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const selectedProduct = products.find(p => p.id === parseInt(selectedProductId));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">Create New Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Walk-in Customer"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    placeholder="20 123 456"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate</label>
                                <select
                                    value={governorate}
                                    onChange={(e) => setGovernorate(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                >
                                    <option value="">Select Governorate</option>
                                    {TUNISIAN_GOVERNORATES.map((gov) => (
                                        <option key={gov} value={gov}>{gov}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City / Address</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="e.g. Ennasr 2, Rue Hedi Nouira..."
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Add Items Section */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                            <h3 className="font-semibold text-gray-900">Add Items</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    >
                                        <option value="">Select a product...</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} - {p.price} TND
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedProduct && (
                                    <>
                                        {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                                <select
                                                    value={selectedSize}
                                                    onChange={(e) => setSelectedSize(e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                >
                                                    <option value="">Select Size</option>
                                                    {selectedProduct.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                                <select
                                                    value={selectedColor}
                                                    onChange={(e) => setSelectedColor(e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                >
                                                    <option value="">Select Color</option>
                                                    {selectedProduct.colors.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <button
                                                type="button"
                                                onClick={handleAddItem}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add to Order
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        {orderItems.length > 0 && (
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Item</th>
                                            <th className="px-4 py-2 text-center">Qty</th>
                                            <th className="px-4 py-2 text-right">Price</th>
                                            <th className="px-4 py-2 text-right">Total</th>
                                            <th className="px-4 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {orderItems.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2">
                                                    <div className="font-medium">{item.productName}</div>
                                                    <div className="text-gray-500 text-xs">
                                                        {item.size && `Size: ${item.size} `}
                                                        {item.color && `Color: ${item.color}`}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-center">{item.quantity}</td>
                                                <td className="px-4 py-2 text-right">{item.price}</td>
                                                <td className="px-4 py-2 text-right">{(item.price * item.quantity).toFixed(2)}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-bold">
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-right">Total:</td>
                                            <td className="px-4 py-2 text-right">{calculateTotal().toFixed(2)} TND</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || orderItems.length === 0}
                                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Order'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
