"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthPage = () => {
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const router = useRouter();

  // إعادة التوجيه لو فيه توكن موجود
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) router.replace("/admin");
  }, [router]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "البريد الإلكتروني غير صالح";

    if (!formData.password.trim()) newErrors.password = "كلمة المرور مطلوبة";
    else if (formData.password.length < 8) newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setLoginSuccess(false);
    setLoginFailed(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setLoginSuccess(false);
    setLoginFailed(false);

    try {
      const res = await axios.post(
        "https://clean-up-production.up.railway.app/api/admin/login",
        { email: formData.email, password: formData.password }
      );

      // حفظ البيانات في localStorage
      localStorage.setItem("adminEmail", res.data.admin.email);
      localStorage.setItem("adminName", res.data.admin.name);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      setLoginSuccess(true);
      setLoginFailed(false);

      // إعادة التوجيه للوحة التحكم
      router.replace("/admin");
    } catch (error) {
      setLoginSuccess(false);
      setLoginFailed(true);
      const message = error.response?.data?.error || error.message || "حدث خطأ";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-lg bg-gray-900 bg-opacity-90 backdrop-blur-3xl rounded-3xl shadow-2xl p-12 border border-gray-800"
      >
        <h2 className="text-4xl font-bold text-white mb-12 text-center tracking-tight">
          مرحبًا بعودتك
        </h2>

        <div className="space-y-8">
          {loginSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-5 py-4 rounded-2xl flex items-center gap-3"
            >
              <CheckCircle size={28} />
              <span className="font-semibold text-white text-lg">تم تسجيل الدخول بنجاح!</span>
            </motion.div>
          )}

          {loginFailed && errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-5 py-4 rounded-2xl flex items-center gap-3"
            >
              <XCircle size={28} />
              <span className="font-semibold text-white text-lg">{errors.form}</span>
            </motion.div>
          )}

          {/* البريد الإلكتروني */}
          <div className="relative w-full">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-gray-800 bg-opacity-70 text-white pl-16 pr-6 py-4 rounded-2xl border-2 border-gray-700 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500 text-lg"
            />
            {errors.email && <p className="text-red-400 text-sm mt-2 text-right">{errors.email}</p>}
          </div>

          {/* كلمة المرور */}
          <div className="relative w-full">
            <input
              type={loginShowPassword ? "text" : "password"}
              name="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-gray-800 bg-opacity-70 text-white pl-6 pr-16 py-4 rounded-2xl border-2 border-gray-700 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500 text-lg"
            />
            <button
              type="button"
              onClick={() => setLoginShowPassword(!loginShowPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {loginShowPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
            {errors.password && <p className="text-red-400 text-sm mt-2 text-right">{errors.password}</p>}
          </div>

          {/* زر تسجيل الدخول */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: loginSuccess
                ? "0 0 30px rgba(34, 197, 94, 0.6)"
                : loginFailed
                ? "0 0 30px rgba(239, 68, 68, 0.6)"
                : "0 0 30px rgba(34, 211, 238, 0.6)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-5 rounded-2xl font-bold text-xl shadow-xl transition-all duration-500 text-white
              ${
                loginSuccess
                  ? "bg-linear-to-r from-green-500 to-green-700"
                  : loginFailed
                  ? "bg-linear-to-r from-red-500 to-red-700"
                  : "bg-linear-to-r from-cyan-500 to-blue-600"
              }
              ${isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
                />
                جاري تسجيل الدخول...
              </span>
            ) : loginSuccess ? (
              <span className="flex items-center justify-center gap-3">
                <CheckCircle size={26} />
                تم بنجاح
              </span>
            ) : loginFailed ? (
              <span className="flex items-center justify-center gap-3">
                <XCircle size={26} />
                حاول مرة أخرى
              </span>
            ) : (
              "تسجيل الدخول"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
