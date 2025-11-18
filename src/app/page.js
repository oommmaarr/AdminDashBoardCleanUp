import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth"); // أو /signIn حسب اسم فولدر ال auth عندك
}
