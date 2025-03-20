import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { DebouncedInput } from "./DebouncedInput";
import PokemonCard from "./PokemonCard";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 20;

export default function PokemonList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [filterType, setFilterType] = useState("");
  const { isDarkMode } = useTheme();

  const {
    data: pokemonList,
    isLoading,
    error,
  } = useQuery(
    ["pokemon-list", page],
    async () => {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`,
      );
      const data = await response.json();

      const detailedData = await Promise.all(
        data.results.map(async (pokemon) => {
          const detailResponse = await fetch(pokemon.url);
          return detailResponse.json();
        }),
      );

      return {
        count: data.count,
        results: detailedData,
      };
    },
    {
      keepPreviousData: true,
    },
  );

  const filteredPokemon =
    pokemonList?.results.filter((pokemon) => {
      const matchesSearch =
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(searchTerm);
      const matchesType =
        !filterType ||
        pokemon.types.some((type) => type.type.name === filterType);
      return matchesSearch && matchesType;
    }) ?? [];

  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "experience":
        return b.base_experience - a.base_experience;
      default:
        return a.id - b.id;
    }
  });

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen"
      >
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
      </motion.div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-red-500 text-center text-2xl mt-10"
      >
        Error: {error.message}
      </motion.div>
    );
  
  const listClasses = `space-y-8 p-2 max-w-7xl mx-auto ${isDarkMode? "text-white bg-gray-900":"bg-neutral-100"}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={listClasses}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-xl"
      >
        <div className="w-full sm:w-auto flex-1">
          <DebouncedInput
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
            placeholder="Search by name or ID..."
          />
        </div>
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
            <option value="experience">Sort by Experience</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
          >
            <option value="">All Types</option>
            <option value="normal">Normal</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
          </select>
        </div>
      </motion.div>

      <AnimatePresence>
        <motion.div
          key={sortBy + filterType + searchTerm}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {sortedPokemon.map((pokemon, index) => (
            <motion.div
              key={pokemon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/pokemon/${pokemon.id}`}>
                <PokemonCard pokemon={pokemon} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg bg-yellow-500 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-md hover:bg-yellow-600 transition-all duration-300"
        >
          Previous
        </motion.button>
        <span className="px-2 py-2 rounded-lg shadow-inner">
          Page {page} of {Math.ceil(pokemonList.count / ITEMS_PER_PAGE)}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= Math.ceil(pokemonList.count / ITEMS_PER_PAGE)}
          className="px-6 py-3 rounded-lg bg-yellow-500 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-md hover:bg-yellow-600 transition-all duration-300"
        >
          Next
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
