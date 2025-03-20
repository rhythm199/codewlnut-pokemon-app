import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem(`teams_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`teams_${user.id}`, JSON.stringify(teams));
    }
  }, [teams, user]);

  const addTeam = (teamName) => {
    setTeams([...teams, { id: Date.now(), name: teamName, pokemon: [] }]);
  };

  const addPokemonToTeam = (teamId, pokemon) => {
    setTeams(
      teams.map((team) => {
        if (team.id === teamId && team.pokemon.length < 6) {
          return { ...team, pokemon: [...team.pokemon, pokemon] };
        }
        return team;
      }),
    );
  };

  const removePokemonFromTeam = (teamId, pokemonId) => {
    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            pokemon: team.pokemon.filter((p) => p.id !== pokemonId),
          };
        }
        return team;
      }),
    );
  };

  const reorderTeam = (teamId, startIndex, endIndex) => {
    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          const newPokemon = Array.from(team.pokemon);
          const [removed] = newPokemon.splice(startIndex, 1);
          newPokemon.splice(endIndex, 0, removed);
          return { ...team, pokemon: newPokemon };
        }
        return team;
      }),
    );
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        addTeam,
        addPokemonToTeam,
        removePokemonFromTeam,
        reorderTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => useContext(TeamContext);
