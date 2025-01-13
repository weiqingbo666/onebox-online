import type { Metadata } from "next";

import "./globals.css";
import AppContextProvider from "@/components/AppContext";

export const metadata: Metadata = {
  title: "Onebox",
  description: "wecome to onebox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="dark"
      >
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
