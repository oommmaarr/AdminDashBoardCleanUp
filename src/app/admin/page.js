"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
export default function AdminDashboard() {
  const [previousWorks, setPreviousWorks] = useState([]);

  useEffect(() => {
    const fetchPreviousWorks = async () => {
      try {
        const res = await axios.get("https://clean-up-production.up.railway.app/api/previous-work");
        setPreviousWorks(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreviousWorks();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا العمل؟")) return;
    try {
      await api.delete(`/admin/previous-work/${id}`);
      setPreviousWorks(previousWorks.filter((work) => work.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 text-white">
      {/* عنوان الصفحة */}
      <h1 className="text-4xl text-center sm:text-5xl  md:text-2xl lg:text-2xl xl:text-[40px] tracking-wide sm:tracking-wider md:tracking-widest p-3 font-bold bg-gradient-to-l from-blue-500 to-white bg-clip-text text-transparent drop-shadow-lg">
مرحبا بك في لوحة تحكم الادمن      </h1>
      <div className="w-24 h-1 mt-1 bg-linear-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>

      {/* زر إنشاء عمل جديد */}
      <div className="flex justify-start mt-8">
        <Link href="/admin/create-work">
          <button className="px-6 py-3 cursor-pointer  bg-blue-500/20 hover:bg-blue-500/30 text-white font-bold rounded-xl border border-blue-500/20 transition-all">
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
            {/* الصورة */}
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
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* محتوى الكارد */}
            <div className="p-6 text-right space-y-3">
              <span className="inline-block text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full font-medium">
                {work.category}
              </span>
              <h2 className="text-xl font-bold text-white">{work.title}</h2>
              <p className="text-white/60 text-sm leading-relaxed line-clamp-2">{work.description}</p>

              {/* أزرار التعديل والحذف */}
              <div className="flex justify-cente items-end gap-2 mt-3">
                <Link href={`/admin/edit-work/${work.id}`}>
                  <button className="px-22 py-2 bg-blue-500 cursor-pointer hover:bg-blue-700 text-white rounded-xl transition-all border border-yellow-500/20">
                    تعديل
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(work.id)}
                  className="py-2 px-22 bg-red-600 cursor-pointer  hover:bg-red-700 text-white rounded-xl transition-all border border-red-500/20"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
