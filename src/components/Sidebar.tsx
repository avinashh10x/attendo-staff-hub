
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Calendar, 
  Home, 
  DollarSign, 
  BarChart2, 
  Settings, 
  Menu, 
  X
} from "lucide-react";

interface SidebarLink {
  icon: React.ElementType;
  label: string;
  href: string;
}

const links: SidebarLink[] = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Users,
    label: "Staff",
    href: "/staff",
  },
  {
    icon: Calendar,
    label: "Attendance",
    href: "/attendance",
  },
  {
    icon: DollarSign,
    label: "Salary",
    href: "/salary",
  },
  {
    icon: BarChart2,
    label: "Reports",
    href: "/reports",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setCollapsed(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-white md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-900 border-r shadow-sm transition-all duration-300",
          collapsed ? "w-16 sm:-translate-x-full md:translate-x-0" : "w-64",
          isMobile && !collapsed ? "w-64 translate-x-0" : "",
          isMobile && collapsed ? "-translate-x-full" : "",
          className
        )}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {!collapsed && (
            <h1 className="text-xl font-bold text-primary">Attendo Staff</h1>
          )}
          {!isMobile && (
            <button
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <Menu size={20} />
              ) : (
                <X size={20} />
              )}
            </button>
          )}
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "flex items-center gap-x-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300",
                    "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                    location.pathname === link.href && "bg-primary/10 text-primary font-medium",
                    collapsed && "justify-center"
                  )}
                >
                  <link.icon size={20} />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              A
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@attendo.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
