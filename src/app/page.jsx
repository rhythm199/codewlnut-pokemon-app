"use client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { TeamProvider } from "../context/TeamContext";
import PrivateRoute from "../components/PrivateRoute";
import Navbar from "../components/Navbar";
import PokemonList from "../components/PokemonList";
import PokemonDetail from "../components/PokemonDetail";
import Teams from "../components/Teams";
import Login from "../components/Login";
import Register from "../components/Register";
import PokemonSearch from "@/components/PokemonSearch";
import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
      cacheTime: 3600000,
      refetchOnWindowFocus: false,
    },
  },
});

const pageVariants = {
  initial: { opacity: 0, x: "-100%" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "100%" },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const RoutesWithAnimation = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route
            path="/teams"
            element={
              <PrivateRoute>
                <Teams />
              </PrivateRoute>
            }
          />
          <Route path="/search" element={<PokemonSearch />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const BackgroundAnimation = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900"
      animate={{
        background: [
          "linear-gradient(to bottom right, #E6F3FF, #F3E6FF)",
          "linear-gradient(to bottom right, #FFE6F3, #E6FFF3)",
          "linear-gradient(to bottom right, #F3FFE6, #FFE6E6)",
        ],
      }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
    />
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.circle
        cx="10%"
        cy="10%"
        r="5"
        fill="#4F46E5"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.circle
        cx="90%"
        cy="90%"
        r="7"
        fill="#10B981"
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.circle
        cx="50%"
        cy="50%"
        r="10"
        fill="#F59E0B"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </svg>
  </div>
);

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TeamProvider>
            <Router>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 relative overflow-hidden"
              >
                <BackgroundAnimation />
                <Navbar />
                <motion.main
                  className="container mx-auto px-4 py-8 relative z-10"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <RoutesWithAnimation />
                </motion.main>
              </motion.div>
              <footer className="absolute bottom-0 left-0 w-full text-yellow-400 text-center p-4 flex items-center justify-center gap-2">
                  <img
                    src="https://www.pngkey.com/png/full/144-1446994_pokeball-clipart-transparent-background-pokeball-png.png"
                    alt="Pokeball"
                    width={50}
                    height={50}
                    className="pokeball"
                  />
                  <span>All rights reserved. Rhythm Shukla</span>
                </footer>
            </Router>
          </TeamProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
