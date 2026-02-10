import { useState, useEffect } from "react";
import { Plus, Search, Filter, Calendar, ShoppingBag, DollarSign, Users, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/Button";
import { OrdersStats } from "../components/orders/OrderStats";
import { OrderCard } from "../components/orders/OrderCard";
import { OrderTable } from "../components/orders/OrderTable";
import { TableSkeleton } from "../components/orders/TableSkeleton";
import { CardSkeleton } from "../components/orders/CardSkeleton";
import { Order, calculateOrderStats } from "../lib/data";
import { OrderStatus } from "../components/ui/StatusBadge";
import { useToast } from "../components/ui/Toast";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { getAdminOrders, updateOrderStatus } from "../api/endpoints";
import { useNavigate } from "react-router-dom";



export function OrdersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const stats = calculateOrderStats(orders);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    id: string;
    newStatus: OrderStatus;
  } | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAdminOrders();
        setOrders(data);
      } catch {
        showToast("Failed to load orders", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customer_name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (order.order_number?.toLowerCase() ?? "").includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const statusFilters: { label: string; value: OrderStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Preparing", value: "preparing" },
    { label: "Ready", value: "ready" },
    { label: "Delivered", value: "delivered" },
    { label: "Confirmed", value: "customer_confirmed" },
  ];

  const handleStatusChangeRequest = (id: string, newStatus: OrderStatus) => {
    setPendingStatusChange({ id, newStatus });
    setDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (pendingStatusChange) {
      try {
        const updated = await updateOrderStatus(
          parseInt(pendingStatusChange.id, 10),
          pendingStatusChange.newStatus
        );
        setOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? updated : o))
        );
        showToast(
          `Order status updated to ${pendingStatusChange.newStatus.replace("_", " ")}`,
          "success"
        );
      } catch {
        showToast("Failed to update order status", "error");
      } finally {
        setDialogOpen(false);
        setPendingStatusChange(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading text-zm-stoneBrown">Orders</h1>
          <p className="text-zm-greyOlive text-sm">Manage and track all bakery orders</p>
        </div>
        <Button onClick={() => navigate("/orders/new")}>
          <Plus size={18} className="mr-2" /> New Order
        </Button>
      </div>

      <OrdersStats
  stats={[
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
    },
    {
      label: "Revenue",
      value: stats.totalRevenue,
      icon: DollarSign,
    },
    {
      label: "Customers",
      value: stats.customers,
      icon: Users,
    },
    {
      label: "Growth",
      value: stats.growth,
      icon: TrendingUp,
    },
  ]}
/>


      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-zm-greyOlive/10 shadow-sm">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zm-greyOlive"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or order #..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zm-greyOlive/20 focus:outline-none focus:border-zm-deepTeal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${filterStatus === filter.value
                  ? "bg-zm-deepTeal text-white shadow-md"
                  : "bg-white text-zm-greyOlive border border-zm-greyOlive/20 hover:bg-zm-mintCream"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <CardSkeleton />
        ) : (
          <>
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => navigate(`/orders/${order.id}`)}
                onStatusChange={(id, status) => handleStatusChangeRequest(id, status)}
              />
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-10 text-zm-greyOlive">
                No orders found matching your search.
              </div>
            )}
          </>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <OrderTable
              orders={filteredOrders}
              onView={(id) => navigate(`/orders/${id}`)}
              onEdit={(id) => navigate(`/orders/${id}/edit`)}
              onStatusChange={handleStatusChangeRequest}
            />
            {filteredOrders.length === 0 && (
              <div className="text-center py-16 text-zm-greyOlive bg-white rounded-b-xl border-x border-b border-zm-greyOlive/10">
                No orders found matching your search.
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={dialogOpen}
        title="Update Order Status"
        message={`Are you sure you want to change the status to ${pendingStatusChange?.newStatus.replace("_", " ")}?`}
        onConfirm={confirmStatusChange}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}
