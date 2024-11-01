import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

type PaginationProps = {
  totalItems: number;
  itemsPerPage?: number; // optional with a default value
};

export default function PaginationComponent({
  totalItems,
  itemsPerPage = 10, // default value is 10
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const params = useSearchParams();
  const currentPage = parseInt(params.get("page") || "1");

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const createPageLink = (page: number) => {
    const searchParams = new URLSearchParams(params.toString());
    if (page === 1) {
      searchParams.delete("page");
    } else {
      searchParams.set("page", page.toString());
    }
    return `?${searchParams.toString()}`;
  };

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="flex flex-col justify-between lg:items-end items-center w-full mt-8">
      <div className="gap-6 flex flex-col ">
        <p className="flex justify-center items-center">
          Showing {startItem}-{endItem} of {totalItems}
        </p>
        <div className="flex justify-end">
          <Pagination>
            <PaginationContent className="flex gap-3">
              <PaginationItem>
                <PaginationLink
                  href={createPageLink(1)}
                  isActive={currentPage === 1}
                  className={`${
                    isPreviousDisabled
                      ? "pointer-events-none cursor-not-allowed bg-gray-100 text-gray-400"
                      : "hover:bg-gray-200"
                  } transition-colors duration-200 ease-in-out`}
                >
                  <ChevronsLeft />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  className={`${
                    isPreviousDisabled
                      ? "pointer-events-none cursor-not-allowed bg-gray-100 text-gray-400"
                      : "hover:bg-gray-200"
                  } transition-colors duration-200 ease-in-out`}
                  href={createPageLink(currentPage - 1)}
                  aria-disabled={isPreviousDisabled}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  href={createPageLink(currentPage)}
                  isActive={true}
                  className="text-white transition-colors duration-200 ease-in-out"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  className={`${
                    isNextDisabled
                      ? "pointer-events-none cursor-not-allowed bg-gray-100 text-gray-400"
                      : "hover:bg-gray-200"
                  } transition-colors duration-200 ease-in-out`}
                  href={createPageLink(currentPage + 1)}
                  aria-disabled={isNextDisabled}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  aria-disabled={currentPage === totalPages}
                  href={createPageLink(totalPages)}
                  isActive={currentPage === totalPages}
                  className={`${
                    isNextDisabled
                      ? "pointer-events-none cursor-not-allowed bg-gray-100 text-gray-400"
                      : "hover:bg-gray-200"
                  } transition-colors duration-200 ease-in-out`}
                >
                  <ChevronsRight />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
