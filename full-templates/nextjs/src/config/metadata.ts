import type { Metadata } from 'next';

import { publicConfig } from '@/config/env';

const SITE_CONFIG = {
  description:
    'Next.js 15 App Routerを使用したSSR構成のWebアプリケーションテンプレート',
  name: 'Next.js Starter Template',
  ogImage: {
    height: 630,
    url: `${publicConfig.APP_URL}/images/ogp.png`,
    width: 1200,
  },
  url: publicConfig.APP_URL,
};

export const defaultMetadata: Metadata = {
  description: SITE_CONFIG.description,
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    description: SITE_CONFIG.description,
    images: [
      {
        alt: SITE_CONFIG.name,
        height: SITE_CONFIG.ogImage.height,
        url: SITE_CONFIG.ogImage.url,
        width: SITE_CONFIG.ogImage.width,
      },
    ],
    locale: 'ja_JP',
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    type: 'website',
    url: SITE_CONFIG.url,
  },
  robots: {
    follow: true,
    index: true,
  },
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  twitter: {
    card: 'summary_large_image',
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage.url],
    title: SITE_CONFIG.name,
  },
};
