import type { Metadata } from "next";

import "./globals.css";
import AppContextProvider from "@/components/AppContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className="dark"
      >
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
