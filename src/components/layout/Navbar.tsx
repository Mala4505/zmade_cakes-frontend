// import { useState } from 'react';
// import { Menu, X, LogOut, Cake } from 'lucide-react';
// import { Button } from '../ui/Button';
// import { useNavigate, useLocation } from 'react-router-dom';

// export function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navItems = [
//     { id: '/orders', label: 'Orders' },
//     { id: '/orders/new', label: 'New Order' },
//     { id: '/reports', label: 'Reports' }
//   ];

//   const handleNav = (path: string) => {
//     navigate(path);
//     setIsMenuOpen(false);
//   };

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b border-zm-greyOlive/10 bg-white/80 backdrop-blur-md">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <div
//             className="flex items-center gap-2 cursor-pointer"
//             onClick={() => handleNav('/orders')}
//           >
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zm-deepTeal text-white">
//               <Cake size={18} />
//             </div>
//             <span className="font-heading text-2xl text-zm-stoneBrown pt-1">
//               ZMade Cakes
//             </span>
//           </div>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => handleNav(item.id)}
//                 className={`text-sm font-medium transition-colors hover:text-zm-deepTeal ${
//                   location.pathname === item.id
//                     ? 'text-zm-deepTeal font-semibold'
//                     : 'text-zm-greyOlive'
//                 }`}
//               >
//                 {item.label}
//               </button>
//             ))}
//             <div className="h-4 w-px bg-zm-greyOlive/20" />
//             <Button
//               variant="ghost"
//               size="sm"
//               className="text-zm-greyOlive hover:text-red-500"
//               onClick={() => {
//                 localStorage.removeItem('authToken');
//                 handleNav('/login');
//               }}
//             >
//               <LogOut size={16} className="mr-2" />
//               Logout
//             </Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2 text-zm-stoneBrown"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden border-t border-zm-greyOlive/10 bg-white p-4 shadow-lg animate-accordion-down">
//           <div className="flex flex-col space-y-4">
//             {navItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => handleNav(item.id)}
//                 className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium ${
//                   location.pathname === item.id
//                     ? 'bg-zm-mintCream text-zm-deepTeal'
//                     : 'text-zm-stoneBrown hover:bg-gray-50'
//                 }`}
//               >
//                 {item.label}
//               </button>
//             ))}
//             <div className="h-px bg-zm-greyOlive/10 my-2" />
//             <button
//               className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
//               onClick={() => {
//                 localStorage.removeItem('authToken');
//                 handleNav('/login');
//               }}
//             >
//               <LogOut size={16} className="mr-3" />
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

import { useState } from 'react';
import { Menu, X, LogOut, Cake, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationSidebar from './NotificationSidebar';
import { sampleNotifications, Notification } from '../../lib/notifications';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: '/orders', label: 'Orders' },
    { id: '/orders/new', label: 'New Order' },
    { id: '/reports', label: 'Reports' }
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-zm-greyOlive/10 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNav('/orders')}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zm-deepTeal text-white">
                <Cake size={18} />
              </div>
              <span className="font-heading text-2xl text-zm-stoneBrown pt-1">
                ZMade Cakes
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-zm-deepTeal ${
                    location.pathname === item.id
                      ? 'text-zm-deepTeal font-semibold'
                      : 'text-zm-greyOlive'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="h-4 w-px bg-zm-greyOlive/20" />

              {/* Bell Icon */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="relative rounded-lg p-2 text-zm-greyOlive transition-colors hover:bg-zm-mintCream hover:text-zm-deepTeal"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  </span>
                )}
              </button>

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                className="text-zm-greyOlive hover:text-red-500"
                onClick={() => {
                  localStorage.removeItem('authToken');
                  handleNav('/login');
                }}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button + Bell */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="relative rounded-lg p-2 text-zm-stoneBrown"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  </span>
                )}
              </button>

              <button
                className="p-2 text-zm-stoneBrown"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zm-greyOlive/10 bg-white p-4 shadow-lg animate-accordion-down">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium ${
                    location.pathname === item.id
                      ? 'bg-zm-mintCream text-zm-deepTeal'
                      : 'text-zm-stoneBrown hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-zm-greyOlive/10 my-2" />
              <button
                className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
                onClick={() => {
                  localStorage.removeItem('authToken');
                  handleNav('/login');
                }}
              >
                <LogOut size={16} className="mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Notification Sidebar */}
      <NotificationSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  );
}
