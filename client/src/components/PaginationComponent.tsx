import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { getPagination } from "@/utils/getPagination";
import { useSearchParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  className?: string;
};

const limits = [4, 8, 12, 16, 20, 24, 36, 48, 60, 72, 84, 100];

export default function PaginationComponent({
  currentPage,
  totalPages,
  className = "",
}: PaginationProps) {
  //

  const pages = getPagination(currentPage, totalPages);

  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (value: number | undefined) => {
    if (value) {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(value));
      setSearchParams(params);
    }
  };

  const handleLimitChange = (value: string) => {
    if (value) {
      const params = new URLSearchParams(searchParams);
      params.set("limit", String(value));
      params.set("page", "1");
      setSearchParams(params);
    }
  };

  return (
    <Pagination className={cn("w-auto", className)}>
      <PaginationContent>
        {totalPages && totalPages > 1 && (
          <>
            {/* Previous page button */}
            <PaginationItem>
              <button
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                aria-label="Go to previous page"
                aria-disabled={currentPage === 1 ? true : undefined}
                role={currentPage === 1 ? "button" : undefined}
                onClick={() =>
                  handlePageChange(currentPage === 1 ? undefined : currentPage - 1)
                }
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </button>
            </PaginationItem>

            {/* Page number links */}
            {pages.map((page, i) =>
              page === "..." ? (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(Number(page))}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            {/* Next page button */}
            <PaginationItem>
              <button
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                aria-label="Go to next page"
                aria-disabled={currentPage === totalPages ? true : undefined}
                role={currentPage === totalPages ? "button" : undefined}
                onClick={() =>
                  handlePageChange(
                    currentPage === totalPages ? undefined : currentPage + 1
                  )
                }
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </button>
            </PaginationItem>
          </>
        )}

        {/* Page limit */}
        <div>
          <Select
            onValueChange={handleLimitChange}
            value={searchParams.get("limit") || "12"}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Limits</SelectLabel>
                {limits.map((limit, i) => (
                  <SelectItem value={String(limit)} key={i}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </PaginationContent>
    </Pagination>
  );
}
