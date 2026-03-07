import type { Metadata } from 'next';

import { GoogleAnalytics } from '@next/third-parties/google';
import { ReactNode } from 'react';
import '@/styles/globals.css';
import { validateEnv } from '@/config/env';
import { defaultMetadata } from '@/config/metadata';

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
