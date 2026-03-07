import { Metadata } from 'next';

import { TopPage } from '@/components/pages/top';
import { defaultMetadata } from '@/config/metadata';

export const metadata: Metadata = defaultMetadata;

export default function Top() {
  return <TopPage />;
}
