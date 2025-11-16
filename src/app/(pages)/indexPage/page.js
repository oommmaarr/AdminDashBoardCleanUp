// app/indexPage/page.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Briefcase,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Settings,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      label: "إجمالي الموظفين",
      value: "48",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      change: "+5 هذا الأسبوع",
    },
    {
      label: "مساعدو المدير",
      value: "6",
      icon: UserCheck,
      color: "from-purple-500 to-indigo-500",
      change: "+1 جديد",
    },
    {
      label: "المقالات المنشورة",
      value: "24",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
      change: "3 قيد المراجعة",
    },
    {
      label: "معدل التقييم العام",
      value: "4.8",
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      change: "+0.2 هذا الشهر",
    },
  ];

  const recentActivity = [
    { id: 1, user: "فاطمة أحمد", action: "أكملت تنظيف شقة", time: "منذ 10 دقائق", status: "success" },
    { id: 2, user: "محمد علي", action: "بدأ مهمة جديدة", time: "منذ 25 دقيقة", status: "pending" },
    { id: 3, user: "سارة حسن", action: "تم تقييمها 5 نجوم", time: "منذ ساعة", status: "success" },
    { id: 4, user: "خالد إبراهيم", action: "طلب إجازة", time: "منذ ساعتين", status: "warning" },
  ];

  const upcomingTasks = [
    { id: 1, client: "أحمد السيد", address: "المعادي، القاهرة", time: "10:00 ص", cleaner: "منى صلاح" },
    { id: 2, client: "ليلى محمود", address: "مدينة نصر", time: "02:30 م", cleaner: "ريم عبد الرحمن" },
    { id: 3, client: "عمر خالد", address: "المهندسين", time: "05:00 م", cleaner: "فاطمة أحمد" },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Mobile Header */}

      {/* Main Content */}
      <div className="p-4 lg:p-8 space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl mt-15 md:mt-0 lg:text-4xl font-bold text-white mb-2">
            مرحباً، أحمد!
          </h1>
          <p className="text-gray-300 text-lg">
            إليك نظرة عامة على أداء <span className="text-cyan-400 font-medium">نظفلي</span> اليوم
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-300 bg-white/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <p className="text-sm text-gray-300 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Activity + Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              النشاط الأخير
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {activity.status === "success" && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {activity.status === "pending" && <Clock className="w-5 h-5 text-yellow-400" />}
                    {activity.status === "warning" && <AlertCircle className="w-5 h-5 text-orange-400" />}
                    <div>
                      <p className="font-medium text-white">{activity.user}</p>
                      <p className="text-sm text-gray-300">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              المهام القادمة
            </h2>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                >
                  <p className="font-medium text-white">{task.client}</p>
                  <p className="text-sm text-gray-300">{task.address}</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-purple-300 font-medium">{task.time}</span>
                    <span className="text-gray-400">{task.cleaner}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
              عرض جميع المهام
            </button>
          </motion.div>
        </div>


      </div>
    </div>
  );
}