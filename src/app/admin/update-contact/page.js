"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    hours: [],
    address: "",
    email: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    twitter: "",
  });

  const [newHour, setNewHour] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error
  const [loadingData, setLoadingData] = useState(true);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      alert("يجب تسجيل الدخول أولاً");
      setLoadingData(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://clean-up-production.up.railway.app/api/contact",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data.data;
        setFormData({
          hours: data.hours || [],
          address: data.address || "",
          email: data.email || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
        });
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("خطأ في جلب البيانات:", err);
          alert("فشل تحميل بيانات التواصل");
        }
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddHour = () => {
    if (!newHour.trim()) return;
    setFormData((prev) => ({
      ...prev,
      hours: [...prev.hours, newHour.trim()],
    }));
    setNewHour("");
  };

  const removeHour = (index) => {
    setFormData((prev) => ({
      ...prev,
      hours: prev.hours.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");

    if (!token) {
      alert("يجب تسجيل الدخول أولاً");
      setSubmitStatus("idle");
      return;
    }

    try {
      await axios.patch(
        "https://clean-up-production.up.railway.app/api/contact",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSubmitStatus("success");
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          await axios.post(
            "https://clean-up-production.up.railway.app/api/contact",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          setSubmitStatus("success");
        } catch (postErr) {
          console.error("فشل الإنشاء:", postErr);
          setSubmitStatus("error");
        }
      } else {
        console.error("فشل التحديث:", err);
        setSubmitStatus("error");
      }
    } finally {
      setTimeout(
        () => setSubmitStatus("idle"),
        submitStatus === "success" ? 3000 : 5000
      );
    }
  };

  const fieldLabels = {
    address: "العنوان",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    whatsapp: "واتساب",
    facebook: "فيسبوك",
    instagram: "إنستغرام",
    twitter: "تويتر (X)",
  };

  const fieldIcons = {
    address: <MapPin className="w-6 h-6 text-cyan-400" />,
    email: <Mail className="w-6 h-6 text-cyan-400" />,
    phone: <Phone className="w-6 h-6 text-cyan-400" />,
    whatsapp: <MessageCircle className="w-6 h-6 text-cyan-400" />,
    facebook: <Facebook className="w-6 h-6 text-cyan-400" />,
    instagram: <Instagram className="w-6 h-6 text-cyan-400" />,
    twitter: <Twitter className="w-6 h-6 text-cyan-400" />,
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-14 min-w-96 text-center">
            <Loader2 className="w-20 h-20 animate-spin text-cyan-400 mx-auto mb-6" />
            <p className="text-2xl font-bold text-white tracking-wider">
              جاري تحميل البيانات...
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-white/5 backdrop-blur-3xl rounded-3xl scale-110"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 text-white min-h-screen">
      <h1 className="text-4xl text-center font-bold mb-10 bg-gradient-to-l from-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
        إعدادات التواصل والمواعيد
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 shadow-2xl space-y-10"
      >
        {/* مواعيد العمل */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-cyan-400" />
            <h2 className="text-2xl font-bold">مواعيد العمل</h2>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={newHour}
              onChange={(e) => setNewHour(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddHour())
              }
              placeholder="مثال: السبت - الخميس: ٩ص - ٦م"
              className="flex-1 p-5 rounded-xl bg-white/10 border border-white/20 focus:border-cyan-400 outline-none transition text-lg placeholder-white/50"
            />
            <button
              type="button"
              onClick={handleAddHour}
              className="px-8 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-bold flex items-center gap-3 transition shadow-lg"
            >
              <Plus className="w-5 h-5" /> إضافة
            </button>
          </div>

          {formData.hours.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.hours.map((hour, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/10 border border-white/20 rounded-xl p-5 hover:bg-white/15 transition group"
                >
                  <span className="text-lg font-medium">{hour}</span>
                  <button
                    type="button"
                    onClick={() => removeHour(i)}
                    className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/50 py-10 text-lg">
              لم تتم إضافة مواعيد عمل بعد
            </p>
          )}
        </div>

        {/* الحقول الأخرى */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.keys(fieldLabels).map((field) => (
            <div key={field} className="space-y-3">
              <div className="flex items-center gap-3">
                {fieldIcons[field]}
                <label className="text-xl font-semibold">
                  {fieldLabels[field]}
                </label>
              </div>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field === "address"
                    ? "القاهرة - مدينة نصر - شارع..."
                    : "أدخل الرابط أو الرقم"
                }
                className="w-full p-5 rounded-xl bg-white/10 border border-white/20 focus:border-cyan-400 outline-none transition text-lg placeholder-white/50"
              />
            </div>
          ))}
        </div>

        {/* زر الحفظ */}
        <button
          type="submit"
          disabled={submitStatus === "loading" || submitStatus === "success"}
          className={`w-full py-6 text-xl font-bold rounded-xl flex items-center justify-center gap-4 transition-all duration-500 shadow-xl ${
            submitStatus === "loading"
              ? "bg-blue-600"
              : submitStatus === "success"
              ? "bg-green-600 shadow-green-500/50"
              : submitStatus === "error"
              ? "bg-red-600 shadow-red-500/50"
              : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          }`}
        >
          {submitStatus === "loading" && (
            <>
              جاري الحفظ... <Loader2 className="animate-spin w-7 h-7" />
            </>
          )}
          {submitStatus === "success" && (
            <>
              تم الحفظ بنجاح <CheckCircle className="w-7 h-7" />
            </>
          )}
          {submitStatus === "error" && (
            <>
              فشل الحفظ <XCircle className="w-7 h-7" />
            </>
          )}
          {submitStatus === "idle" && "حفظ جميع التغييرات"}
        </button>

        {/* رسائل النتيجة */}
        {submitStatus === "success" && (
          <div className="mt-6 p-6 bg-green-600/20 border border-green-500/50 rounded-2xl text-center text-green-300 font-bold text-xl flex items-center justify-center gap-4">
            <CheckCircle className="w-10 h-10" />
            تم حفظ بيانات التواصل بنجاح!
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mt-6 p-6 bg-red-600/20 border border-red-500/50 rounded-2xl text-center text-red-300 font-bold text-xl flex items-center justify-center gap-4">
            <XCircle className="w-10 h-10" />
            حدث خطأ أثناء الحفظ، حاول مرة أخرى
          </div>
        )}
      </form>
    </div>
  );
}
