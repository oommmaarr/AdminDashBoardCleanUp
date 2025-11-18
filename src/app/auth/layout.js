// app/auth/layout.js
import "../globals.css";

export const metadata = {
  title: "تسجيل الدخول | Clean Up",
  description: "تسجيل الدخول للوحة التحكم",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex items-center justify-center min-h-screen bg-linear-to-br from-black via-[#003983] to-black bg-fixed">
        {children}
      </body>
    </html>
  );
}
