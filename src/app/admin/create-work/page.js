"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

export default function CreateWorkPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [dragActive, setDragActive] = useState(false);

  // حماية الصفحة: لو مفيش توكن ارجع لصفحة تسجيل الدخول
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/auth");
    }
  }, [router]);

  // رفع الصور من الإنبوت أو السحب
  const handleImageChange = (files) => {
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    const imagesWithPreview = validImages.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages((prev) => [...prev, ...imagesWithPreview]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview); // تحرير الذاكرة
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // رفع العمل
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category.trim() || images.length === 0) {
      alert("من فضلك املأ جميع الحقول وارفع صورة واحدة على الأقل");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category.trim());
    images.forEach((img) => formData.append("images", img));

    setSubmitStatus("loading");

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "https://clean-up-production.up.railway.app/api/admin/previous-work",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmitStatus("success");
      setTimeout(() => router.push("/admin"), 2500);
    } catch (err) {
      console.error("Upload failed:", err);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 text-white">
      <h1 className="text-4xl text-center font-bold mb-10 bg-linear-to-l from-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
        إنشاء عمل سابق جديد
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8"
      >
        {/* العنوان */}
        <div>
          <label className="block mb-2 text-lg font-semibold">العنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 transition"
            placeholder="مثال: تجديد مطبخ كامل بطراز مودرن"
            required
          />
        </div>

        {/* الوصف */}
        <div>
          <label className="block mb-2 text-lg font-semibold">الوصف</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 transition resize-none"
            placeholder="وصف مفصل للعمل..."
            required
          />
        </div>

        {/* الفئة */}
        <div>
          <label className="block mb-2 text-lg font-semibold">الفئة</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400 transition"
            placeholder="مثال: Cleaning أو Residential أو Commercial"
            required
          />
        </div>

        {/* رفع الصور */}
        <div>
          <label className="block mb-3 text-lg font-semibold">رفع الصور</label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
              dragActive
                ? "border-blue-400 bg-blue-500/10"
                : "border-white/30 hover:border-blue-400"
            }`}
          >
            <Upload className="mx-auto mb-4 w-16 h-16 text-white/70" />
            <p className="text-xl font-medium">اسحب الصور هنا أو اضغط للرفع</p>
            <p className="text-sm text-white/60 mt-2">يمكنك رفع أكثر من صورة</p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageChange(Array.from(e.target.files))
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>

          {/* معاينة الصور */}
          {images.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={img.preview}
                    alt={`preview-${index}`}
                    width={300}
                    height={300}
                    className="rounded-xl object-cover border-2 border-white/20 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* زر الرفع */}
        <button
          type="submit"
          disabled={submitStatus === "loading" || submitStatus === "success"}
          className={`w-full py-6 mt-10 cursor-pointer text-white font-bold text-xl rounded-xl transition-all duration-500 flex items-center justify-center gap-4 shadow-xl disabled:cursor-not-allowed ${
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
            <>
              <Loader2 className="animate-spin w-7 h-7" />
              جاري الرفع...
            </>
          )}
          {submitStatus === "success" && (
            <>
              <CheckCircle className="w-8 h-8" />
              تم الرفع بنجاح
            </>
          )}
          {submitStatus === "error" && (
            <>
              <XCircle className="w-8 h-8" />
              فشل الرفع، حاول تاني
            </>
          )}
          {submitStatus === "idle" && "إنشاء العمل الآن"}
        </button>
      </form>
    </div>
  );
}
