import type { Metadata } from "next";

import "./globals.css";
import AppContextProvider from "@/components/AppContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL('https://one-box.top'),
  title: {
    default: "一个盒子Onebox - 触动心灵的包装盒设计",
    template: "%s | 一个盒子Onebox"
  },
  description: "一个盒子Onebox - 触动心灵的包装盒设计，专注于将每个商家的独特故事和品牌形象转化为精美的包装解决方案。让您的产品在市场中脱颖而出，感动每一位顾客的心灵。",
  keywords: ["一个盒子", "OneBox", "包装盒设计", "品牌形象", "精美包装", "定制包装盒", "创意设计", "产品包装", "市场营销", "包装设计", "礼品盒设计", "包装方案"],
  authors: [{ name: "OneBox Team" }],
  creator: "OneBox Team",
  publisher: "OneBox",
  openGraph: {
    title: "一个盒子Onebox - 触动心灵的包装盒设计",
    description: "一个盒子Onebox - 触动心灵的包装盒设计，专注于将每个商家的独特故事和品牌形象转化为精美的包装解决方案。让您的产品在市场中脱颖而出，感动每一位顾客的心灵。",
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    siteName: "一个盒子Onebox",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "一个盒子Onebox - 包装盒设计",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "一个盒子Onebox - 触动心灵的包装盒设计",
    description: "专注于将每个商家的独特故事和品牌形象转化为精美的包装解决方案",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://one-box.top",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <GoogleAnalytics />
      </head>
      <body className="dark">
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
