import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1 p-1 font-bold">
      {currentPage > 1 && (
        <button
          className="flex justify-center items-center text-center text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 text-xl w-8 h-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
      )}

      {totalPages > 1 && Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          className={`${currentPage === i + 1 ? 'text-black bg-yellow-500' : 'text-yellow-500 bg-black'} flex justify-center items-center text-center hover:text-black uppercase hover:bg-yellow-500 text-xl w-8 h-8`}
          onClick={() => onPageChange(i + 1)}
          disabled={currentPage === i + 1}
        >
          {i + 1}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          className="flex justify-center items-center text-center text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 text-xl w-8 h-8"
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </button>
      )}
    </div>
  )
}
