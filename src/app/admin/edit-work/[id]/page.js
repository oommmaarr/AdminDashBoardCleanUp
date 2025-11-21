"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export default function EditWorkPage() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [dragActive, setDragActive] = useState(false);

  // 🔥 NEW — مودال الحذف
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    imageUrl: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const res = await axios.get(
          `https://clean-up-production.up.railway.app/api/previous-work/${id}`
        );
        const data = res.data.data;

        setTitle(data.title || "");
        setDescription(data.description || "");
        setCategory(data.category || "");
        setExistingImages(data.images || []);
      } catch (err) {
        console.error(err);
        alert("فشل تحميل بيانات العمل");
        router.push("/admin");
      }
    };

    if (id) fetchWork();
  }, [id, router]);

  const handleNewImages = (files) => {
    const valid = files.filter((f) => f.type.startsWith("image/"));
    setNewImages((prev) => [...prev, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      handleNewImages(Array.from(e.dataTransfer.files));
    }
  };

  // ❌ unused old remove → تم تبديله بحذف من السيرفر
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔥 NEW — دالة حذف صورة من السيرفر فعلاً
  const deleteExistingImageFromServer = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Token غير موجود");
      return;
    }

    setDeleteModal((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await axios.delete(
        `https://clean-up-production.up.railway.app/api/admin/previous-work/${id}/image`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { imageUrl: deleteModal.imageUrl }, // IMPORTANT
        }
      );

      // إزالة الصورة من UI
      setExistingImages((prev) =>
        prev.filter((img) => img !== deleteModal.imageUrl)
      );

      setDeleteModal({ open: false, imageUrl: null, loading: false });
    } catch (err) {
      setDeleteModal((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.error || "فشل الحذف",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Token غير موجود – قم بتسجيل الدخول");
      setSubmitStatus("idle");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category.trim());

    existingImages.forEach((img) => formData.append("images", img));
    newImages.forEach((img) => formData.append("images", img));

    try {
      await axios.put(
        `https://clean-up-production.up.railway.app/api/admin/previous-work/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmitStatus("success");
      setTimeout(() => router.push("/admin"), 2000);
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 text-white">
      <h1 className="text-4xl text-center font-bold mb-10 bg-linear-to-l from-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
        تعديل العمل السابق
      </h1>

      {/* 🔥 NEW — Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-black w-96">
            <h2 className="text-xl font-bold mb-4">حذف الصورة</h2>
            <p className="mb-4">هل أنت متأكد أنك تريد حذف هذه الصورة؟</p>

            {deleteModal.error && (
              <p className="text-red-600 text-sm mb-2">{deleteModal.error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, imageUrl: null })}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                إلغاء
              </button>

              <button
                onClick={deleteExistingImageFromServer}
                disabled={deleteModal.loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {deleteModal.loading ? "جارٍ الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:border-blue-400 outline-none transition text-lg"
          placeholder="العنوان"
          required
        />

        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:border-blue-400 outline-none transition resize-none"
          placeholder="الوصف"
          required
        />

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:border-blue-400 outline-none transition"
          placeholder="الفئة"
          required
        />

        {existingImages.length > 0 && (
          <div>
            <p className="text-lg font-semibold mb-4">
              الصور الحالية (اضغط × لحذف)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {existingImages.map((url, i) => (
                <div key={i} className="relative group">
                  <Image
                    src={url}
                    width={300}
                    height={300}
                    alt="old"
                    className="rounded-xl object-cover border-2 border-white/20"
                  />

                  {/* 🔥 NEW — زر يفتح المودال */}
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteModal({ open: true, imageUrl: url })
                    }
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-8 h-8 flex-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-lg font-semibold mb-4">إضافة صور جديدة</p>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? "border-blue-400 bg-blue-500/10"
                : "border-white/30 hover:border-blue-400"
            }`}
          >
            <Upload className="mx-auto mb-4 w-16 h-16 text-white/70" />
            <p className="text-xl">اسحب الصور هنا أو اضغط للرفع</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleNewImages(Array.from(e.target.files))
              }
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {newImages.length > 0 && (
            <div className="mt-6 grid grid grid-cols-3 md:grid-cols-5 gap-4">
              {newImages.map((file, i) => (
                <div key={i} className="relative group">
                  <Image
                    src={URL.createObjectURL(file)}
                    width={200}
                    height={200}
                    alt="new"
                    className="rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-8 h-8 flex-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitStatus === "loading" || submitStatus === "success"}
          className={`w-full py-6 text-xl font-bold rounded-xl flex-center gap-4 transition-all duration-500 ${
            submitStatus === "loading"
              ? "bg-blue-600"
              : submitStatus === "success"
              ? "bg-green-600 shadow-green-500/50"
              : submitStatus === "error"
              ? "bg-red-600 shadow-red-500/50"
              : "bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          }`}
        >
          {submitStatus === "loading" && (
            <div className="flex justify-center items-center space-x-2">
              جاري الحفظ... <Loader2 className="animate-spin w-5 h-5" />
            </div>
          )}
          {submitStatus === "success" && (
            <div className="flex justify-center items-center space-x-2">
              تم التعديل بنجاح <CheckCircle className="w-5 h-5" />
            </div>
          )}
          {submitStatus === "error" && (
            <div className="flex justify-center items-center space-x-2">
              فشل الحفظ <XCircle className="w-5 h-5" />
            </div>
          )}
          {submitStatus === "idle" && "حفظ التعديلات"}
        </button>
      </form>
    </div>
  );
}
