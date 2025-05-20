import logo from '@/../public/logo-dao-brussels-blue-original.svg';
import Image from 'next/image';

export const Logo = () => (
  <div className="logo">
    <Image src={logo} alt="DAO Brussels" width={250} height={250} />
  </div>
);
