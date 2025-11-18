// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Clean Up | خدمات التنظيف المتكاملة",
  description: "موقع يقدم خدمات تنظيف احترافية للمنازل",
};

export default function RootLayout({ children }) {
  return <>{children}</>; // لا html/body هنا
}
