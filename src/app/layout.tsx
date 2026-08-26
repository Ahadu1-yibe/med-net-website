import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.site.shortName} — ${settings.site.tagline}`,
      template: `%s · ${settings.site.name}`,
    },
    description: settings.site.description,
    keywords: [
      "digital health",
      "Ethiopia",
      "health technology",
      "health informatics",
      "medical research",
      "healthcare innovation",
      "Med-Net",
    ],
    openGraph: {
      type: "website",
      siteName: settings.site.name,
      title: `${settings.site.shortName} — ${settings.site.tagline}`,
      description: settings.site.description,
      images: [{ url: "/brand/mednet-logo-light.jpeg", width: 1152, height: 924 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.site.shortName} — ${settings.site.tagline}`,
      description: settings.site.description,
    },
    icons: { icon: "/icon.svg" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const themeConfig = JSON.stringify({
    defaultMode: settings.appearance.defaultMode,
    defaultAccent: settings.appearance.accent,
  });

  const themeScript = `(function(){try{var c=${themeConfig};var t=localStorage.getItem('mednet-theme');var a=localStorage.getItem('mednet-accent');var m=t||c.defaultMode;if(m==='system'){m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(m==='dark'){document.documentElement.classList.add('dark');}if(a){document.documentElement.setAttribute('data-accent',a);}else if(c.defaultAccent){document.documentElement.setAttribute('data-accent',c.defaultAccent);}}catch(e){}})();`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
