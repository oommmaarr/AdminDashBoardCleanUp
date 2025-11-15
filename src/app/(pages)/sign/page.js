"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (activeTab === "signup") {
      if (!formData.firstName.trim()) newErrors.firstName = "الاسم الأول مطلوب";
      if (!formData.lastName.trim()) newErrors.lastName = "اسم العائلة مطلوب";

      // ✅ هنا التعديل الوحيد (Regex لكل الدول العربية)
      if (!formData.phone.trim()) {
        newErrors.phone = "رقم الهاتف مطلوب";
      } else if (!/^(\+?\d{7,15})$/.test(formData.phone)) {
        newErrors.phone = "رقم الهاتف غير صالح";
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
      }
    }

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
  }, [formData, activeTab]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("تم إرسال البيانات", formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      console.error("فشل الإرسال:", error);
      setErrors({ form: "حدث خطأ أثناء الإرسال" });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  return (
    <div className="flex items-center justify-center p-6 relative overflow-hidden ">
      <div className="absolute inset-0  opacity-90" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md bg-gray-900 bg-opacity-85 backdrop-blur-2xl rounded-3xl shadow-xl p-10 border border-gray-800"
      >
        <div className="flex gap-6 mb-10">
          {["signup", "signin"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer flex-1 py-3 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab === "signup" ? "إنشاء حساب" : "تسجيل الدخول"}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* SignUp Page */}

          {activeTab === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">
                إنشاء حساب
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "firstName", placeholder: "الاسم الأول" },
                    { name: "lastName", placeholder: "اسم العائلة" },
                  ].map(({ name, placeholder }) => (
                    <div key={name}>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="text"
                        name={name}
                        placeholder={placeholder}
                        value={formData[name]}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 bg-opacity-70 text-white px-4 py-3 rounded-lg border-b-2 border-gray-600 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500"
                      />
                      {errors[name] && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors[name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {[
                  {
                    name: "email",
                    type: "email",
                    placeholder: "البريد الإلكتروني",
                    icon: Mail,
                  },
                  {
                    name: "phone",
                    type: "tel",
                    placeholder: "رقم الهاتف",
                    icon: Phone,
                  },
                ].map(({ name, type, placeholder, icon: Icon }) => (
                  <div key={name} className="relative">
                    <Icon
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 bg-opacity-70 text-white pl-12 pr-4 py-3 rounded-lg border-b-2 border-gray-600 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500"
                    />
                    {errors[name] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors[name]}
                      </p>
                    )}
                  </div>
                ))}

                {[
                  {
                    name: "password",
                    show: showPassword,
                    setShow: setShowPassword,
                  },
                  {
                    name: "confirmPassword",
                    show: showConfirmPassword,
                    setShow: setShowConfirmPassword,
                  },
                ].map(({ name, show, setShow }) => (
                  <div key={name} className="relative">
                    <input
                      type={show ? "text" : "password"}
                      name={name}
                      placeholder={
                        name === "password"
                          ? "كلمة المرور"
                          : "تأكيد كلمة المرور"
                      }
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 bg-opacity-70 text-white pl-4 pr-12 py-3 rounded-lg border-b-2 border-gray-600 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {show ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {errors[name] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors[name]}
                      </p>
                    )}
                  </div>
                ))}

                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="cursor-pointer w-full bg-linear-to-r from-blue-600 to-blue-800 text-white py-3.5 rounded-lg font-semibold shadow-lg hover:bg-cyan-700 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الإرسال..." : "إنشاء الحساب"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Login Page */}
          {activeTab === "signin" && (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">
                مرحبًا بعودتك
              </h2>

              <div className="space-y-5">
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 bg-opacity-70 text-white pl-12 pr-4 py-3 rounded-lg border-b-2 border-gray-600 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500"
                  />
                </div>

                <div className="relative">
                  <input
                    type={loginShowPassword ? "text" : "password"}
                    name="password"
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 bg-opacity-70 text-white pl-4 pr-12 py-3 rounded-lg border-b-2 border-gray-600 focus:border-cyan-500 focus:outline-none transition-all placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setLoginShowPassword(!loginShowPassword)}
                    className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {loginShowPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="cursor-pointer w-full bg-linear-to-r from-blue-600 to-blue-800 text-white py-3.5 rounded-lg font-semibold shadow-lg hover:bg-cyan-700 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الإرسال..." : "تسجيل الدخول"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
