import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useTeam } from "../context/TeamContext";
import { useAuth } from "../context/AuthContext";
import StatsChart from "./StatsChart";
import EvolutionChain from "./EvolutionChain";
import MovesList from "./MovesList";

export default function PokemonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { teams, addPokemonToTeam } = useTeam();

  const { data: pokemon, isLoading } = useQuery(["pokemon", id], async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.json();
  });

  const { data: species } = useQuery(
    ["pokemon-species", id],
    async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`,
      );
      return response.json();
    },
    { enabled: !!pokemon },
  );

  const { data: evolutionChain } = useQuery(
    ["evolution-chain", species?.evolution_chain?.url],
    async () => {
      const response = await fetch(species.evolution_chain.url);
      return response.json();
    },
    { enabled: !!species?.evolution_chain?.url },
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
            />
            <h1 className="text-3xl font-bold capitalize mt-4">
              {pokemon.name}
            </h1>
            <div className="flex gap-2 mt-2">
              {pokemon.types.map(({ type }) => (
                <span
                  key={type.name}
                  className={`px-3 py-1 rounded-full text-white bg-${type.name}`}
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Base Stats</h2>
              <StatsChart stats={pokemon.stats} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Abilities</h2>
              <ul className="list-disc list-inside">
                {pokemon.abilities.map(({ ability, ishidden }) => (
                  <li key={ability.name} className="capitalize">
                    {ability.name} {ishidden && "(Hidden)"}
                  </li>
                ))}
              </ul>
            </div>

            {user && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Add to Team</h2>
                <select
                  onChange={(e) =>
                    addPokemonToTeam(Number(e.target.value), pokemon)
                  }
                  className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option
                      key={team.id}
                      value={team.id}
                      disabled={team.pokemon.length >= 6}
                    >
                      {team.name} ({team.pokemon.length}/6)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {evolutionChain && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Evolution Chain</h2>
          <EvolutionChain chain={evolutionChain.chain} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Moves</h2>
        <MovesList moves={pokemon.moves} />
      </div>
    </div>
  );
}
