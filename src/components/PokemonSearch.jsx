import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const PokemonSearch = () => {
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error } = useQuery(
    ["pokemon", searchTerm],
    async () => {
      if (!searchTerm) return null;
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`,
      );
      return data;
    },
    { enabled: !!searchTerm },
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(search);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 p-6 bg-gradient-to-br from-yellow-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-2xl"
    >
      <motion.form
        onSubmit={handleSearch}
        className="mb-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      >
        <motion.input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Pokémon by name or ID"
          className="w-full p-3 border-2 border-yellow-300 dark:border-yellow-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          type="submit"
          className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg font-semibold shadow-md transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>
      </motion.form>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="mt-2 text-yellow-600 dark:text-yellow-400">Loading...</p>
          </motion.div>
        )}
        {isError && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-red-500 text-center"
          >
            Error: {error.message}
          </motion.p>
        )}
        {data && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-4 text-center text-yellow-600 dark:text-yellow-400 capitalize"
            >
              {data.name}
            </motion.h2>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative w-48 h-48 mx-auto mb-4"
            >
              <img
                src={data.sprites.front_default}
                alt={data.name}
                className="w-full h-full object-contain"
              />
              <motion.div
                className="absolute inset-0 bg-yellow-200 dark:bg-yellow-700 rounded-full -z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1.1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              ></motion.div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Types:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {data.types.map((type, index) => (
                  <motion.span
                    key={type.type.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="px-3 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium"
                  >
                    {type.type.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PokemonSearch;
