import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://purushotamjeswani.in';
export const metadata = {
  metadataBase: new URL(baseUrl),
  keywords: ['Purushotam', 'Jeswani', 'Purushotam jeswani portfolio', 'Purushotam jeswani', 'portfolio', 'website developer near me', 'web developer', 'Full-stack web developer', 'React developer portfolio', 'Next.js expert India USA', 'Node.js full-stack development', 'Full-stack developer for hire India', 'Full-stack developer for hire India', 'Docker and AWS web development', 'Prisma and MongoDB projects', 'PostgreSQL database expert', 'Cloudflare R2 integration', 'Full-stack development problem solver', 'Full-stack job-ready', 'Hiring React and Next.js developers', 'Skilled full-stack engineer portfolio',],
  title: {
    default: "Purushotam Jeswani Portfolio",
    template: `%s | Purushotam Jeswani`
  },
  description: "Explore the professional portfolio of Purushotam Jeswani, a full-stack developer specializing in React, Next.js, Node.js, Docker, AWS, Prisma, MongoDB, and PostgreSQL. Discover innovative projects and skills tailored for tech roles in India and the USA.",
  openGraph: {
    title: "Purushotam Jeswani Portfolio",
    description: "Explore the professional portfolio of Purushotam Jeswani, a full-stack developer specializing in React, Next.js, Node.js, Docker, AWS, Prisma, MongoDB, and PostgreSQL. Discover innovative projects and skills tailored for tech roles in India and the USA.",
    type: "website",
    url: baseUrl,
    images: [`/favicon-96x96.png`]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
        <meta property="og:image:alt" content="Professional portfolio of Purushotam Jeswani showcasing full-stack development expertise" />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        {metadata.openGraph?.images?.map((image, index) => (
          <meta key={index} property="og:image" content={image} />
        ))}
        <link rel="canonical" href={baseUrl} />

        <meta name="google-site-verification" content="Hyq7_rXCrzF3ib_AhDf781L1pYQmFT7oZilFhKZVWCY" />

        <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Markazi+Text:wght@400..700&family=Passero+One&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"></link>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
