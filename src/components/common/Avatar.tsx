import {FC} from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
  img?: string;
};

const Avatar: FC<Props> = ({img}) => {
  const src = 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp';
  return (
    <div>
      <Image height={100} width={100} loader={() => src} src={src} className="rounded-full w-32" />
    </div>
  );
};
export default Avatar;
