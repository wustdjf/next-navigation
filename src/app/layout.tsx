import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "导航站",
  description: "快捷网址导航站",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
