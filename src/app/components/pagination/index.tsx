import React, { ReactNode } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface PageStepButtonProps {
  page: number;
  testId: string;
  onPageChange: (page: number) => void;
  children: ReactNode;
}

// Previous / next arrows. The target page is never the current one, so the
// button is always enabled (the previous arrow only renders past page 1).
function PageStepButton({ page, testId, onPageChange, children }: PageStepButtonProps) {
  return (
    <button
      className="flex justify-center items-center text-center text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 text-xl w-8 h-8"
      onClick={() => onPageChange(page)}
      data-testid={testId}
    >
      {children}
    </button>
  );
}

interface PageNumberButtonProps {
  page: number;
  isCurrent: boolean;
  onPageChange: (page: number) => void;
}

function PageNumberButton({ page, isCurrent, onPageChange }: PageNumberButtonProps) {
  return (
    <button
      className={`${
        isCurrent ? "text-black bg-yellow-500" : "text-yellow-500 bg-black"
      } flex justify-center items-center text-center hover:text-black uppercase hover:bg-yellow-500 text-xl w-8 h-8`}
      onClick={() => onPageChange(page)}
      disabled={isCurrent}
    >
      {page}
    </button>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-1 p-1 font-bold"
      data-testid="pagination"
    >
      {currentPage > 1 && (
        <PageStepButton page={currentPage - 1} testId="previous-page" onPageChange={onPageChange}>
          &lt;
        </PageStepButton>
      )}

      {totalPages > 1 &&
        Array.from({ length: totalPages }).map((_, i) => (
          <PageNumberButton
            key={i}
            page={i + 1}
            isCurrent={currentPage === i + 1}
            onPageChange={onPageChange}
          />
        ))}

      {currentPage < totalPages && (
        <PageStepButton page={currentPage + 1} testId="next-page" onPageChange={onPageChange}>
          &gt;
        </PageStepButton>
      )}
    </div>
  );
}
