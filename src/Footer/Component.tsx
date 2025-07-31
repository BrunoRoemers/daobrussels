import { getCachedGlobal } from '@/utilities/getGlobals';
import Link from 'next/link';

import type { Footer } from '@/payload-types';

import { CMSLink } from '@/components/Link';

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer')();

  const navItems = footer?.navItems || [];

  return (
    <footer>
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          DAO Brussels
        </Link>

        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
          <nav className="flex flex-col gap-4 md:flex-row">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />;
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}
