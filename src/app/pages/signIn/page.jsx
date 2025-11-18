"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // هنا ممكن تضيف استدعاء NextAuth أو API للتحقق من الدخول
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("تم تسجيل الدخول:", formData);
    } catch (error) {
      console.error("فشل تسجيل الدخول:", error);
      setErrors({ form: "حدث خطأ أثناء تسجيل الدخول" });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  return (
    <div className="flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-90" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md bg-gray-900 bg-opacity-85 backdrop-blur-2xl rounded-3xl shadow-xl p-10 border border-gray-800"
      >
        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">
          مرحبًا بعودتك
        </h2>

        <div className="space-y-7">
          {/* Email */}
          <div className="relative w-full">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={22}
            />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-800 bg-opacity-70 text-white pl-14 pr-4 py-3 
              rounded-xl border-b-2 border-gray-600 focus:border-cyan-500 
              focus:outline-none transition-all placeholder-gray-500 text-lg"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative w-full">
            <input
              type={loginShowPassword ? "text" : "password"}
              name="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-gray-800 bg-opacity-70 text-white pl-4 pr-14 py-3
              rounded-xl border-b-2 border-gray-600 focus:border-cyan-500 
              focus:outline-none transition-all placeholder-gray-500 text-lg"
            />
            <button
              type="button"
              onClick={() => setLoginShowPassword(!loginShowPassword)}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {loginShowPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(34, 211, 238, 0.55)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-800 
            text-white py-4 rounded-xl font-semibold text-lg shadow-lg 
            hover:opacity-90 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "جاري الإرسال..." : "تسجيل الدخول"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
