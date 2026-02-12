// import { useEffect, useCallback, useState } from "react";
// import { getNotifications, markAllNotificationsRead } from "../../api/endpoints"; 
// import {
//   ShoppingBag,
//   CreditCard,
//   AlertTriangle,
//   Truck,
//   X,
//   CheckCheck,
// } from "lucide-react";

// function formatTimestamp(iso: string): string {
//   const date = new Date(iso);
//   const now = new Date();
//   const diffMs = now.getTime() - date.getTime();
//   const diffMins = Math.floor(diffMs / 60000);
//   const diffHours = Math.floor(diffMins / 60);
//   const diffDays = Math.floor(diffHours / 24);

//   if (diffMins < 1) return "Just now";
//   if (diffMins < 60) return `${diffMins}m ago`;
//   if (diffHours < 24) return `${diffHours}h ago`;
//   if (diffDays < 7) return `${diffDays}d ago`;
//   return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
// }

// const typeConfig = {
//   status: {
//     icon: ShoppingBag,
//     label: "Order Update",
//     color: "text-zm-deepTeal",
//     bgColor: "bg-zm-deepTeal/10",
//   },
//   payment: {
//     icon: CreditCard,
//     label: "Payment",
//     color: "text-amber-600",
//     bgColor: "bg-amber-50",
//   },
//   edit: {
//     icon: AlertTriangle,
//     label: "System Alert",
//     color: "text-red-500",
//     bgColor: "bg-red-50",
//   },
//   delivery: {
//     icon: Truck,
//     label: "Delivery",
//     color: "text-zm-greyOlive",
//     bgColor: "bg-zm-mintCream",
//   },
// } as const;

// interface NotificationSidebarProps {
//   open: boolean;
//   onClose: () => void;
// }

// export type NotificationType = "status" | "payment" | "edit" | "delivery";

// export interface Notification {
//   id: number;
//   title?: string; // optional if backend sends it
//   message: string;
//   type: NotificationType;
//   is_read: boolean;
//   created_at: string; // ISO string from backend
// }

// export default function NotificationSidebar({ open, onClose }: NotificationSidebarProps) {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   const handleKeyDown = useCallback(
//     (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     },
//     [onClose]
//   );

//   useEffect(() => {
//     if (open) {
//       document.addEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "hidden";
//       getNotifications().then(setNotifications).catch(console.error);
//     }
//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "";
//     };
//   }, [open, handleKeyDown]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       getNotifications().then(setNotifications).catch(console.error);
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const markAllRead = async () => {
//     await markAllNotificationsRead();
//     setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
//   };

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
//           open ? "opacity-100" : "pointer-events-none opacity-0"
//         }`}
//         onClick={onClose}
//         aria-hidden="true"
//       />

//       {/* Sidebar Panel */}
//       <aside
//         role="dialog"
//         aria-label="Notifications"
//         aria-modal="true"
//         className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-zm-white shadow-2xl transition-transform duration-300 ease-in-out ${
//           open ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-zm-greyOlive/10 px-6 py-4">
//           <div className="flex items-center gap-3">
//             <h2 className="font-body text-lg font-semibold text-zm-stoneBrown">
//               Notifications
//             </h2>
//             {unreadCount > 0 && (
//               <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-zm-white">
//                 {unreadCount} new
//               </span>
//             )}
//           </div>
//           <button
//             onClick={onClose}
//             className="rounded-lg p-2 text-zm-greyOlive transition-colors hover:bg-zm-mintCream hover:text-zm-deepTeal"
//             aria-label="Close notifications"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Mark all as read */}
//         {unreadCount > 0 && (
//           <div className="border-b border-zm-greyOlive/10 px-6 py-3">
//             <button
//               onClick={markAllRead}
//               className="flex items-center gap-2 text-sm font-medium text-zm-deepTeal transition-colors hover:text-zm-deepTealHover"
//             >
//               <CheckCheck className="h-4 w-4" />
//               Mark all as read
//             </button>
//           </div>
//         )}

//         {/* Notification List */}
//         <div className="flex-1 overflow-y-auto">
//           {notifications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 text-zm-greyOlive">
//               <ShoppingBag className="mb-3 h-10 w-10 opacity-40" />
//               <p className="font-body text-sm">No notifications yet</p>
//             </div>
//           ) : (
//             <ul className="divide-y divide-zm-greyOlive/10">
//               {notifications.map((notification) => {
//                 const config = typeConfig[notification.type as keyof typeof typeConfig];
//                 const Icon = config.icon;

//                 return (
//                   <li
//                     key={notification.id}
//                     className={`flex gap-4 px-6 py-4 transition-colors ${
//                       notification.is_read ? "bg-zm-white" : "bg-zm-mintCream/50"
//                     }`}
//                   >
//                     <div
//                       className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
//                     >
//                       <Icon className={`h-5 w-5 ${config.color}`} />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <div className="mb-1 flex items-center gap-2">
//                         <span className={`text-xs font-medium ${config.color}`}>
//                           {config.label}
//                         </span>
//                         {!notification.is_read && (
//                           <span className="h-2 w-2 rounded-full bg-red-500" />
//                         )}
//                       </div>
//                       <p
//                         className={`font-body text-sm leading-relaxed ${
//                           notification.is_read
//                             ? "text-zm-greyOlive"
//                             : "font-medium text-zm-stoneBrown"
//                         }`}
//                       >
//                         {notification.message}
//                       </p>
//                       <p className="mt-1 text-xs text-zm-greyOlive/70">
//                         {formatTimestamp(notification.created_at)}
//                       </p>
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

import { useEffect, useCallback, useState } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../api/endpoints";
import { ShoppingBag, CreditCard, AlertTriangle, Truck, X, CheckCheck } from "lucide-react";


function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface NotificationSidebarProps {
  open: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

export type NotificationType = "status" | "payment" | "edit" | "delivery";

export interface Notification {
  id: number;
  title?: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

const typeConfig = {
  status: {
    icon: ShoppingBag,
    label: "Order Update",
    color: "text-zm-deepTeal",
    bgColor: "bg-zm-deepTeal/10",
  },
  payment: {
    icon: CreditCard,
    label: "Payment",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  edit: {
    icon: AlertTriangle,
    label: "System Alert",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  delivery: {
    icon: Truck,
    label: "Delivery",
    color: "text-zm-greyOlive",
    bgColor: "bg-zm-mintCream",
  },
} as const;


export default function NotificationSidebar({ open, onClose, onUnreadChange }: NotificationSidebarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (onUnreadChange) {
      onUnreadChange(unreadCount);
    }
  }, [unreadCount, onUnreadChange]);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      getNotifications().then(setNotifications).catch(console.error);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      getNotifications().then(setNotifications).catch(console.error);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const markSingleRead = async (id: number) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside
        role="dialog"
        aria-label="Notifications"
        aria-modal="true"
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-zm-white shadow-2xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zm-greyOlive/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="font-body text-lg font-semibold text-zm-stoneBrown">Notifications</h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-zm-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zm-greyOlive transition-colors hover:bg-zm-mintCream hover:text-zm-deepTeal"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <div className="border-b border-zm-greyOlive/10 px-6 py-3">
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm font-medium text-zm-deepTeal transition-colors hover:text-zm-deepTealHover"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zm-greyOlive">
              <ShoppingBag className="mb-3 h-10 w-10 opacity-40" />
              <p className="font-body text-sm">No notifications yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-zm-greyOlive/10">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type as keyof typeof typeConfig];
                const Icon = config.icon;

                return (
                  <li
                    key={notification.id}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${notification.is_read ? "bg-zm-white" : "bg-zm-mintCream/50"
                      }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
                    >
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                        {!notification.is_read && (
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                        )}
                      </div>
                      <p
                        className={`font-body text-sm leading-relaxed ${notification.is_read ? "text-zm-greyOlive" : "font-medium text-zm-stoneBrown"
                          }`}
                      >
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-zm-greyOlive/70">
                        {formatTimestamp(notification.created_at)}
                      </p>
                    </div>

                    {/* Action icon on the right */}
                    {!notification.is_read && (
                      <button
                        onClick={() => markSingleRead(notification.id)}
                        className="ml-2 text-zm-deepTeal hover:text-zm-deepTealHover"
                        aria-label="Mark as read"
                      >
                        <CheckCheck className="h-5 w-5" />
                      </button>
                    )}
                  </li>

                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
