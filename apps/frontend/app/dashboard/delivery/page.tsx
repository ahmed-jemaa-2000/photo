import { getAuthToken, getUserShopId } from '@/lib/auth-server';
import { getOrdersByShop, getShopById } from '@/lib/strapi';
import DeliveryManager from '@/components/dashboard/delivery/DeliveryManager';

export default async function DeliveryPage() {
    const token = await getAuthToken();

    if (!token) return <div>Unauthorized</div>;

    const shopId = await getUserShopId(token);
    if (!shopId) return <div>No shop found</div>;

    const [orders, shop] = await Promise.all([
        getOrdersByShop(shopId, token),
        getShopById(shopId, token),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
                <p className="text-gray-600 mt-1">Generate manifests (bordereaux) for your delivery partners.</p>
            </div>

            <DeliveryManager initialOrders={orders} shopName={shop?.name} />
        </div>
    );
}
