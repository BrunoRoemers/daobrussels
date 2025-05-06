import { getCachedGlobal } from '@/utilities/getGlobals';
import Link from 'next/link';

import type { Footer } from '@/payload-types';

import { CMSLink } from '@/components/Link';

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer')();

  const navItems = footer?.navItems || [];

  return (
    <footer>
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          DAO Brussels
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />;
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}
