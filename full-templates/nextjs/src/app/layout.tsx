import type { Metadata } from 'next';

import { validateEnv } from '@/config/env';
import { defaultMetadata } from '@/config/metadata';
import '@/styles/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ReactNode } from 'react';

const GA_ID = '';

export const metadata: Metadata = defaultMetadata;

validateEnv();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <GoogleAnalytics gaId={GA_ID} />
        {children}
      </body>
    </html>
  );
}
