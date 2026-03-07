import { ReactNode } from 'react';

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
