import { TopPage } from '@/components/pages/top';
import { defaultMetadata } from '@/config/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = defaultMetadata;

export default function Top() {
  return <TopPage />;
}
