import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export default function EvolutionChain({ chain }) {
  const extractPokemonId = (url) => {
    const matches = url.match(/\/(\d+)\//);
    return matches?.[1];
  };

  const { data: pokemon } = useQuery(
    ["pokemon", chain.species.url],
    async () => {
      const id = extractPokemonId(chain.species.url);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      return response.json();
    },
  );

  return (
    <div className="flex flex-col items-center">
      {pokemon && (
        <Link to={`/pokemon/${pokemon.id}`} className="text-center">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-32 h-32 object-contain"
          />
          <span className="capitalize">{pokemon.name}</span>
        </Link>
      )}

      {chain.evolves_to.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-8">
          {chain.evolves_to.map((evolution) => (
            <div key={evolution.species.name}>
              <div className="text-center mb-2">↓</div>
              <EvolutionChain chain={evolution} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
