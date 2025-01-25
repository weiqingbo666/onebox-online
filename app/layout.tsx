import type { Metadata } from "next";

import "./globals.css";
import AppContextProvider from "@/components/AppContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL('https://one-box.top'),
  title: {
    default: "一个盒子Onebox - 专业包装盒设计定制平台",
    template: "%s | 一个盒子Onebox - 包装设计专家"
  },
  description: "一个盒子Onebox是领先的包装盒设计定制平台，专注于为品牌提供创新的包装解决方案。我们深知每个品牌都有独特的故事，通过AI智能设计，将品牌理念完美融入包装设计中。让您的产品包装更具吸引力，提升品牌价值。",
  keywords: [
    "一个盒子",
    "OneBox",
    "包装盒设计",
    "包装设计",
    "产品包装",
    "礼品盒设计",
    "定制包装",
    "智能包装设计",
    "品牌包装",
    "创意包装",
    "包装方案",
    "AI设计",
    "包装定制",
    "高端包装",
    "环保包装"
  ],
  authors: [{ name: "OneBox Team", url: "https://one-box.top" }],
  creator: "OneBox Team",
  publisher: "OneBox",
  category: "包装设计",
  openGraph: {
    title: "一个盒子Onebox - 专业包装盒设计定制平台",
    description: "一个盒子Onebox是领先的包装盒设计定制平台，专注于为品牌提供创新的包装解决方案。通过AI智能设计，将品牌理念完美融入包装设计中。",
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    siteName: "一个盒子Onebox",
    images: [
      {
        url: "favicon.ico",
        width: 1200,
        height: 630,
        alt: "一个盒子Onebox - 专业包装盒设计平台",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "一个盒子Onebox - 专业包装盒设计定制平台",
    description: "专注于为品牌提供创新的包装解决方案，通过AI智能设计提供完美的包装体验",
    images: ["favicon.ico"],
    site: "@onebox",
    creator: "@onebox"
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://one-box.top",
    languages: {
      'zh-CN': 'https://one-box.top',
      'en-US': 'https://one-box.top/en'
    }
  },
  other: {
    'baidu-site-verification': 'your-baidu-verification-code',
    'google-site-verification': 'your-google-verification-code',
    'msvalidate.01': 'your-bing-verification-code',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="favicon.ico" />
        <GoogleAnalytics />
      </head>
      <body className="dark">
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
