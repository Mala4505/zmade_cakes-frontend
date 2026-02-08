import { useState } from 'react';
import { Plus, Search, Filter, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OrderCard } from '../components/orders/OrderCard';
import { OrderTable } from '../components/orders/OrderTable';
import { mockOrders, Order } from '../mockData';
import { OrderStatus } from '../components/ui/StatusBadge';
import { useToast } from '../components/ui/Toast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
interface OrdersListPageProps {
  onNavigate: (page: string, id?: string) => void;
}
export function OrdersListPage({ onNavigate }: OrdersListPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const { showToast } = useToast();
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    id: string;
    newStatus: OrderStatus;
  } | null>(null);
  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const statusFilters: {
    label: string;
    value: OrderStatus | 'all';
  }[] = [
      {
        label: 'All',
        value: 'all'
      },
      {
        label: 'Pending',
        value: 'pending'
      },
      {
        label: 'Preparing',
        value: 'preparing'
      },
      {
        label: 'Ready',
        value: 'ready'
      },
      {
        label: 'Delivered',
        value: 'delivered'
      },
      {
        label: 'Confirmed',
        value: 'customer_confirmed'
      }];

  const handleStatusChangeRequest = (id: string, newStatus: OrderStatus) => {
    setPendingStatusChange({
      id,
      newStatus
    });
    setDialogOpen(true);
  };
  const confirmStatusChange = () => {
    if (pendingStatusChange) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === pendingStatusChange.id ?
            {
              ...o,
              status: pendingStatusChange.newStatus
            } :
            o
        )
      );
      showToast(
        `Order status updated to ${pendingStatusChange.newStatus.replace('_', ' ')}`,
        'success'
      );
      setDialogOpen(false);
      setPendingStatusChange(null);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading text-zm-stoneBrown">Orders</h1>
          <p className="text-zm-greyOlive text-sm">
            Manage and track all bakery orders
          </p>
        </div>
        <Button onClick={() => onNavigate('new-order')}>
          <Plus size={18} className="mr-2" /> New Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-zm-greyOlive/10 shadow-sm">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zm-greyOlive"
              size={18} />

            <input
              type="text"
              placeholder="Search by name or order #..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zm-greyOlive/20 focus:outline-none focus:border-zm-deepTeal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />

          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Calendar size={18} />
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter size={18} />
            </Button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {statusFilters.map((filter) =>
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${filterStatus === filter.value ? 'bg-zm-deepTeal text-white shadow-md' : 'bg-white text-zm-greyOlive border border-zm-greyOlive/20 hover:bg-zm-mintCream'}
              `}>

              {filter.label}
            </button>
          )}
        </div>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order) =>
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => onNavigate('order-detail', order.id)}
            onStatusChange={(status) =>
              handleStatusChangeRequest(order.id, status)
            } />

        )}
        {filteredOrders.length === 0 &&
          <div className="text-center py-10 text-zm-greyOlive">
            No orders found matching your search.
          </div>
        }
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <OrderTable
          orders={filteredOrders}
          onView={(id) => onNavigate('order-detail', id)}
          onEdit={(id) => onNavigate('edit-order', id)}
          onStatusChange={handleStatusChangeRequest} />

        {filteredOrders.length === 0 &&
          <div className="text-center py-16 text-zm-greyOlive bg-white rounded-b-xl border-x border-b border-zm-greyOlive/10">
            No orders found matching your search.
          </div>
        }
      </div>

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Update Order Status"
        message={`Are you sure you want to change the status to ${pendingStatusChange?.newStatus.replace('_', ' ')}?`}
        onConfirm={confirmStatusChange}
        onCancel={() => setDialogOpen(false)} />

    </div>);

}