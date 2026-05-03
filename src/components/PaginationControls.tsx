import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type PaginationControlsProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const buildPages = (page: number, pageCount: number) => {
  const pages: Array<number | 'ellipsis'> = [];
  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i += 1) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (page > 3) pages.push('ellipsis');

  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  for (let i = start; i <= end; i += 1) pages.push(i);

  if (page < pageCount - 2) pages.push('ellipsis');
  pages.push(pageCount);
  return pages;
};

const buildMobilePages = (page: number, pageCount: number) => {
  const pages: Array<number | 'ellipsis'> = [];

  if (pageCount <= 4) {
    for (let i = 1; i <= pageCount; i += 1) pages.push(i);
    return pages;
  }

  if (page <= 2) return [1, 2, 'ellipsis', pageCount];
  if (page >= pageCount - 1) return [1, 'ellipsis', pageCount - 1, pageCount];

  return [1, page, 'ellipsis', pageCount];
};

const PaginationControls = ({ page, pageCount, onPageChange, className }: PaginationControlsProps) => {
  if (pageCount <= 1) return null;
  const isMobile = useIsMobile();
  const pages = isMobile ? buildMobilePages(page, pageCount) : buildPages(page, pageCount);

  return (
    <Pagination className={cn('mt-6', className)}>
      <PaginationContent className="flex-nowrap">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            className={page === 1 ? 'pointer-events-none opacity-50' : ''}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : 0}
          />
        </PaginationItem>
        {pages.map((item, idx) => (
          <PaginationItem key={`${item}-${idx}`}>
            {item === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={item === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < pageCount) onPageChange(page + 1);
            }}
            className={page === pageCount ? 'pointer-events-none opacity-50' : ''}
            aria-disabled={page === pageCount}
            tabIndex={page === pageCount ? -1 : 0}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
