// lib/notifications.ts

export type NotificationType = "order" | "payment" | "system" | "delivery";

export interface Notification {
  id: number;
  message: string;
  timestamp: string; // ISO string from backend
  type: NotificationType;
  read: boolean;
}

// --- Sample notifications for local testing ---
export const sampleNotifications: Notification[] = [
  {
    id: 1,
    message: "Order #1234 marked as Ready",
    timestamp: new Date().toISOString(),
    type: "order",
    read: false,
  },
  {
    id: 2,
    message: "Payment received for Order #1220",
    timestamp: new Date().toISOString(),
    type: "payment",
    read: true,
  },
  {
    id: 3,
    message: "System maintenance scheduled tonight",
    timestamp: new Date().toISOString(),
    type: "system",
    read: false,
  },
  {
    id: 4,
    message: "Order #1225 out for delivery",
    timestamp: new Date().toISOString(),
    type: "delivery",
    read: false,
  },
];

// --- Backend API helpers ---
export async function fetchNotifications(): Promise<Notification[]> {
  try {
    const res = await fetch("/api/admin/notifications"); // adjust endpoint
    if (!res.ok) throw new Error("Failed to fetch notifications");
    const data = await res.json();
    return data as Notification[];
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    await fetch("/api/admin/notifications/mark-all-read", {
      method: "POST",
    });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
  }
}
