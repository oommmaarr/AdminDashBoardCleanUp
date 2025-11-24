"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  Home,
  LogOut,
  Settings,
  LayoutDashboard,
  UserCircle,
  X,
  User2Icon,
} from "lucide-react";
import Hamburger from "hamburger-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function AdminSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const router = useRouter();
  const pathname = usePathname(); // لتحديد الصفحة الحالية بدقة

  // تحديد إذا كان الجهاز Desktop
  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // القوائم
  const menuItems = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      id: "create",
      label: "إضافة عمل جديد",
      icon: Briefcase,
      href: "/admin/create-work",
    },
    {
      id: "update",
      label: "تعديل بيانات المستخدم",
      icon: User2Icon,
      href: "/admin/update-contact",
    },
    {
      id: "home",
      label: "العودة للموقع",
      icon: Home,
      href: "https://clean-up-kappa.vercel.app/",
    },
  ];

  const isActive = (href) => {
    const normalizedCurrent = pathname.replace(/\/$/, "") || "/";
    const normalizedHref = href.replace(/\/$/, "") || "/";
    return normalizedCurrent === normalizedHref;
  };

  // التنقل مع إغلاق السايدبار على الموبايل
  const handleNavigation = (href) => {
    if (!isDesktop) setIsSidebarOpen(false);
    router.push(href);
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(
        "https://clean-up-production.up.railway.app/api/admin/logout",
        {}, // body فارغ
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Logout successful");
    } catch (err) {
      console.log("Logout API failed, clearing token manually...");
    } finally {
      // تنظيف localStorage وإعادة التوجيه للصفحة
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("adminName");
      localStorage.removeItem("adminEmail");
      router.push("/auth"); // أو /login حسب مسارك
    }
  };

  // جلب بيانات الأدمن من localStorage
  useEffect(() => {
    setAdminName(localStorage.getItem("adminName") || "");
    setAdminEmail(localStorage.getItem("adminEmail") || "");
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-white/10 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
          isSidebarOpen ? "translate-y-[-100%]" : "translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 bg-gray-900/80">
          <h1 className="text-lg font-bold text-white">لوحة تحكم الادمن</h1>
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 right-0 h-full  border-l border-white/10 shadow-2xl z-50 transition-all duration-300 backdrop-blur-2xl ${
              isDesktop ? (isCollapsed ? "w-20" : "w-72 lg:w-80") : "w-full"
            }`}
          >
            {/* Close Button (Mobile) */}
            {!isDesktop && (
              <div className="absolute top-4 left-4 z-10">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            )}

            {/* Collapse Button (Desktop) */}
            {isDesktop && (
              <div className="flex items-center justify-center p-4 border-b border-white/10">
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
              <div className="p-6 pt-6 border-b border-white/10">
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

                {/* Profile */}
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
                    <div className="flex flex-col space-y-1">
                      {adminName ? (
                        <>
                          <p className="text-white font-bold text-sm">
                            {adminName}
                          </p>
                          <p className="text-white text-xs">{adminEmail}</p>
                        </>
                      ) : (
                        <>
                          <div className="h-4 bg-white/20 rounded animate-pulse w-32"></div>
                          <div className="h-3 bg-white/10 rounded animate-pulse w-40"></div>
                        </>
                      )}
                      <p className="text-blue-300 text-xs font-bold">
                        مدير النظام
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Navigation */}
            <div
              className={`p-4 space-y-3 overflow-y-auto ${
                !isCollapsed ? "h-[calc(100vh-280px)]" : "h-[calc(100vh-120px)]"
              }`}
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center ${
                      isCollapsed ? "justify-center" : "gap-3"
                    } px-4 py-4 rounded-xl transition-all duration-300 cursor-pointer group
                      ${
                        active
                          ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105"
                          : "text-white/70 hover:text-white hover:bg-white/10 hover:scale-105"
                      }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isCollapsed ? "mx-auto" : ""
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          active ? "text-white" : "group-hover:text-white"
                        }`}
                      />
                    </div>
                    {!isCollapsed && (
                      <span
                        className={`text-base ${active ? "font-bold" : ""}`}
                      >
                        {item.label}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer - Expanded */}
            {!isCollapsed && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gray-900/50 backdrop-blur-sm">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-xl border border-red-500/30 hover:bg-red-700 transition-all shadow-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
                </button>
                <p className="text-white/40 text-xs text-center mt-3">
                  نظفلي © 2026
                </p>
              </div>
            )}

            {/* Footer - Collapsed */}
            {isCollapsed && isDesktop && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  onClick={handleLogout}
                  className="p-3 bg-red-500/20 text-red-300 cursor-pointer rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Spacer for Desktop */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72 lg:w-80"
        }`}
      />
    </>
  );
}
