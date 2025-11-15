"use client";
import React, { useState ,useEffect } from "react";
import {
  Users,
  Briefcase,
  Home,
  LogOut,
  Settings,
  Bell,
  ChevronLeft,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";
import Hamburger from "hamburger-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("cleaners");
  const [isDesktop, setIsDesktop] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // NEW

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard, href: "/admin" },
    { id: "cleaners", label: "إدارة المنظفين", icon: Users, href: "/admin/cleaners" },
    { id: "portfolio", label: "إدارة سابقة الأعمال", icon: Briefcase, href: "/admin/portfolio" },
    { id: "home", label: "العودة للموقع", icon: Home, href: "/" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-gray-900 via-blue-900 to-gray-900 border-b border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="bg-linaer-to-br from-blue-500 to-cyan-500 p-2 rounded-xl shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">لوحة التحكم</h1>
            </div>
          </div>

          <div className="z-50">
            <Hamburger
              toggled={isSidebarOpen}
              toggle={setIsSidebarOpen}
              color="#ffffff"
              size={24}
              rounded
              duration={0.4}
            />
          </div>
        </div>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || isDesktop) && (
          <motion.aside
            initial={{ x: isDesktop ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.4 }}
            className={`fixed top-0 left-0 h-full bg-linear-to-b from-gray-900 via-blue-900 to-gray-900 border-l border-white/10 shadow-2xl z-50 transition-all duration-300 ${
              isCollapsed ? "w-20" : "w-72 sm:w-80"
            }`}
          >
            {/* Collapse Button For Desktop */}
            {isDesktop && (
              <div className="absolute top-4 left-4 z-50">
                <Hamburger
                  toggled={!isCollapsed}
                  toggle={() => setIsCollapsed(!isCollapsed)}
                  color="#ffffff"
                  size={20}
                />
              </div>
            )}

            {/* Header */}
            {!isCollapsed && (
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-linear-to-br from-blue-500 to-cyan-500 p-3 rounded-2xl shadow-lg">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">نظفلي</h1>
                      <p className="text-xs text-blue-300">لوحة التحكم</p>
                    </div>
                  </motion.div>
                </div>

                {/* Admin Profile Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <UserCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-base">أحمد محمد</p>
                      <p className="text-blue-300 text-xs">مدير النظام</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs">
                    <Bell className="w-3 h-3" />
                    <span>5 إشعارات جديدة</span>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Navigation */}
            <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    onClick={() => setActiveItem(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105"
                        : "text-white/70 hover:text-white hover:bg-white/10 hover:scale-105"
                    }`}
                  >
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    {!isCollapsed && <span className="text-base">{item.label}</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            {!isCollapsed && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gray-900/50">
                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500/20 text-red-300 rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all">
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
                </button>
                <p className="text-white/40 text-xs text-center mt-3">نظفلي © 2024</p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Content Spacer */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? "w-20" : "w-72 sm:w-80"}`} />
    </>
  );
}
