import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center items-center">
      {currentPage > 1 && (
        <button
          className="flex justify-center items-center text-center font-black text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 text-2xl w-10 h-10"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
      )}

      {totalPages > 1 && <span className="w-10 h-10 flex justify-center items-center text-2xl font-black">{currentPage}</span>}
      
      {currentPage < totalPages && (
        <button
          className="flex justify-center items-center text-center font-black text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 text-2xl w-10 h-10"
          onClick={() => onPageChange(currentPage + 1)}
        >
          &gt;
        </button>
      )}
    </div>
  )
}
