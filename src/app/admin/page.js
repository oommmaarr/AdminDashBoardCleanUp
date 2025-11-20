"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [previousWorks, setPreviousWorks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [modalState, setModalState] = useState("confirm"); // confirm | loading | success

  // حماية الصفحة
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  // جلب الأعمال السابقة
  useEffect(() => {
    const fetchPreviousWorks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "https://clean-up-production.up.railway.app/api/previous-work",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPreviousWorks(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreviousWorks();
  }, []);

  // فتح المودال
  const openDeleteModal = (id) => {
    setDeletingId(id);
    setModalState("confirm");
    setIsModalOpen(true);
  };

  // حذف العمل
  const handleDelete = async () => {
    if (!deletingId) return;

    setModalState("loading");

    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `https://clean-up-production.up.railway.app/api/admin/previous-work/${deletingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // نجاح الحذف
      setPreviousWorks(previousWorks.filter((work) => work.id !== deletingId));
      setModalState("success");

      // إغلاق تلقائي بعد 1.8 ثانية
      setTimeout(() => {
        setIsModalOpen(false);
        setDeletingId(null);
      }, 1800);
    } catch (error) {
      console.error("فشل الحذف:", error);
      setModalState("confirm"); // ارجع للتأكيد إذا فشل
      alert("حدث خطأ أثناء الحذف، حاول مرة أخرى");
    }
  };

  return (
    <>
      <div className="container mx-auto py-12 px-4 text-white">
        {/* عنوان الصفحة */}
        <h1 className="text-4xl text-center sm:text-5xl md:text-2xl lg:text-2xl xl:text-[40px] tracking-wide sm:tracking-wider md:tracking-widest p-3 font-bold bg-gradient-to-l from-blue-500 to-white bg-clip-text text-transparent drop-shadow-lg">
          مرحبا بك في لوحة تحكم الادمن
        </h1>
        <div className="w-24 h-1 mt-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>

        {/* زر إنشاء عمل جديد */}
        <div className="flex justify-start mt-8">
          <Link href="/admin/create-work">
            <button className="px-6 py-3 cursor-pointer bg-blue-500/20 hover:bg-blue-500/30 text-white font-bold rounded-xl border border-blue-500/20 transition-all">
              إنشاء عمل جديد
            </button>
          </Link>
        </div>

        {/* كاردات الأعمال السابقة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {previousWorks.map((work) => (
            <div
              key={work.id}
              className="group bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 border border-white/10"
            >
              <div className="relative w-full h-64 overflow-hidden">
                {work.images.length > 0 && (
                  <Image
                    src={work.images[0]}
                    alt={work.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6 text-right space-y-3">
                <span className="inline-block text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full font-medium">
                  {work.category}
                </span>
                <h2 className="text-xl font-bold text-white">{work.title}</h2>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                  {work.description}
                </p>

                <div className="flex justify-center items-end gap-2 mt-3">
                  <Link href={`/admin/edit-work/${work.id}`}>
                    <button className="px-6 py-2 bg-blue-500 cursor-pointer hover:bg-blue-700 text-white rounded-xl transition-all border border-yellow-500/20">
                      تعديل
                    </button>
                  </Link>
                  <button
                    onClick={() => openDeleteModal(work.id)}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-xl transition-all border border-red-500/20"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal مع الحالات الثلاث */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 px-4">
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-10 max-w-md w-full">
            {/* شريط علوي ملون حسب الحالة */}
            <div
              className={`absolute top-0 left-0 right-0 h-2 rounded-t-3xl transition-all duration-500 ${
                modalState === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-red-500 to-pink-500"
              }`}
            ></div>

            <div className="text-center space-y-8">
              {/* الأيقونة حسب الحالة */}
              {modalState === "confirm" && (
                <div className="mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-14 h-14 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              )}

              {modalState === "loading" && (
                <div className="mx-auto w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-14 h-14 text-blue-400 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.3"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
              )}

              {modalState === "success" && (
                <div className="mx-auto w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
                  <svg
                    className="w-16 h-16 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* النصوص */}
              {modalState === "confirm" && (
                <>
                  <h3 className="text-2xl font-bold text-white">تأكيد الحذف</h3>
                  <p className="text-white/70 text-lg leading-relaxed">
                    هل أنت متأكد من حذف هذا العمل نهائياً؟
                    <br />
                    <span className="text-red-400 font-bold">
                      لا يمكن التراجع عن هذا الإجراء
                    </span>
                  </p>
                </>
              )}

              {modalState === "loading" && (
                <p className="text-xl font-bold text-blue-300">
                  جاري حذف العمل...
                </p>
              )}

              {modalState === "success" && (
                <p className="text-2xl font-bold text-green-400 animate-pulse">
                  تم الحذف بنجاح!
                </p>
              )}

              {/* الأزرار */}
              {modalState === "confirm" && (
                <div className="flex gap-4 justify-center mt-8">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white cursor-pointer font-bold rounded-xl border border-white/20 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg"
                  >
                    نعم، احذف
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
