import { useState } from "react";

export default function MovesList({ moves }) {
  const [page, setPage] = useState(1);
  const movesPerPage = 10;

  const sortedMoves = [...moves].sort((a, b) =>
    a.move.name.localeCompare(b.move.name),
  );

  const paginatedMoves = sortedMoves.slice(
    (page - 1) * movesPerPage,
    page * movesPerPage,
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedMoves.map(({ move }) => (
          <div
            key={move.name}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <span className="capitalize">{move.name.replace("-", " ")}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg bg-yellow-500 text-white disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {Math.ceil(moves.length / movesPerPage)}
        </span>
        <button
          onClick={() =>
            setPage((p) =>
              Math.min(Math.ceil(moves.length / movesPerPage), p + 1),
            )
          }
          disabled={page >= Math.ceil(moves.length / movesPerPage)}
          className="px-4 py-2 rounded-lg bg-yellow-500 text-white disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
