import { Inter } from "next/font/google";
import "./globals.css";
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://purushotamjeswani.in';
export const metadata = {
  metadataBase: new URL(baseUrl),
  keywords: ['Purushotam', 'Jeswani', 'jeswani', 'purushotam', 'purushottam', 'purshotam', 'Purushotam jeswani portfolio', 'Purushottam jeswani portfolio', 'portfolio', 'fullstack developer portfolio', 'web developer'],
  title: "WebDeveloperPurushotam",
  description: "Purushotam Jeswani Portfolio",
  titleTemplate: `%s | WebDeveloperPurushotam`,
  openGraph: {
    title: "Purushotam Jeswani Portfolio",
    description: "Purushotam Jeswani Portfolio",
    images: [`${baseUrl}/favicon-96x96.png`, `${baseUrl}/web-app-manifest-192x192.png`, `${baseUrl}/web-app-manifest-512x512.png`]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="PJ Portolio" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        {metadata.openGraph.images.map((image, index) => (
          <meta key={index} property="og:image" content={image} />
        ))}

        <meta name="google-site-verification" content="CFdHcwU1z903MfQxQDJ1jl-556aI5SGsaMpa_8RUbKs" />

        <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400..700&family=Passero+One&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"></link>
      </head>
      <body className={inter.className}>
        <Appbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
