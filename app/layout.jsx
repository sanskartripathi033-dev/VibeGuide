import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata = {
  title: 'ATLAS',
  description: "Step into a world where ancient stone whispers tales of royalty. Curate your sovereign journey through the Pink City.",
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
