import { logo } from '@/assets';
import { Image } from '@/components/common/Image';

export const Top = () => {
  return (
    <div>
      <h1>Top</h1>
      <p>This is the top page.</p>
      <Image isEager alt="" height={100} src={logo} width={100} />
    </div>
  );
};
