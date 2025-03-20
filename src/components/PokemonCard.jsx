import { memo } from "react";
import { useTheme } from "../context/ThemeContext";

const TYPE_COLORS = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

const PokemonCard = memo(({ pokemon }) => {
  const { isDarkMode } = useTheme();

  const cardClasses = `
    relative overflow-hidden
    rounded-lg shadow-lg
    ${isDarkMode ? "bg-gray-800 text-white-500" : "bg-white text-gray-600"}
    transition-transform duration-200 hover:scale-105
  `;

  const getStatValue = (statName) => {
    const stat = pokemon.stats.find((s) => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  };

  return (
    <div className={cardClasses}>
      <div className="p-4">
        <div className="relative aspect-square mb-4">
        <span className="text-sm font-normal">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        <h2 className="text-xl font-bold capitalize mb-2">
          {pokemon.name}
          {pokemon.base_experience && (
            <span className="ml-3 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Base EXP: </span>
              <span className="font-semibold">{pokemon.base_experience}</span>
            </span>
          )}
        </h2>

        <div className="flex flex-wrap gap-2 mb-3">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className="px-4 py-1 rounded-full text-white text-sm"
              style={{ backgroundColor: TYPE_COLORS[type.name] }}
            >
              {type.name}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 text-sm">
          <div>
            <div className="text-gray-600 dark:text-gray-400">HP</div>
            <div className="font-semibold">{getStatValue("hp")}</div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Attack</div>
            <div className="font-semibold">{getStatValue("attack")}</div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Defense</div>
            <div className="font-semibold">{getStatValue("defense")}</div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Speed</div>
            <div className="font-semibold">{getStatValue("speed")}</div>
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{
          background:
            pokemon.types.length > 0
              ? TYPE_COLORS[pokemon.types[0].type.name]
              : "#888888",
        }}
      />
    </div>
  );
});

PokemonCard.displayName = "PokemonCard";

export default PokemonCard;
