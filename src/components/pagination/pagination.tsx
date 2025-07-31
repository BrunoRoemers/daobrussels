import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import type { PaginatedDocs } from 'payload';

interface Props {
  data: Omit<PaginatedDocs, 'docs'>;
  url: (page: number) => string;
}

export const Pagination = ({ data: { prevPage, page, totalPages, nextPage }, url }: Props) => {
  return (
    <div className="flex justify-center gap-3">
      {prevPage && (
        <Link href={url(prevPage)} title="Previous page">
          <ChevronLeftIcon />
        </Link>
      )}
      <div>
        page {page} / {totalPages}
      </div>
      {nextPage && (
        <Link href={url(nextPage)} title="Next page">
          <ChevronRightIcon />
        </Link>
      )}
    </div>
  );
};
