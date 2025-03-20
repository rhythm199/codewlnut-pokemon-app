import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTeam } from "../context/TeamContext";
import PokemonCard from "./PokemonCard";

export default function Teams() {
  const [newTeamName, setNewTeamName] = useState("");
  const { teams, addTeam, reorderTeam, removePokemonFromTeam } = useTeam();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const teamId = Number(result.draggableId.split("-")[0]);

    reorderTeam(teamId, result.source.index, result.destination.index);
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="New team name"
          className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          onClick={() => {
            if (newTeamName.trim()) {
              addTeam(newTeamName);
              setNewTeamName("");
            }
          }}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Add Team
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4">{team.name}</h2>
              <Droppable droppableId={`team-${team.id}`} direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                  >
                    {team.pokemon.map((pokemon, index) => (
                      <Draggable
                        key={`${team.id}-${pokemon.id}`}
                        draggableId={`${team.id}-${pokemon.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="relative">
                              <PokemonCard pokemon={pokemon} />
                              <button
                                onClick={() =>
                                  removePokemonFromTeam(team.id, pokemon.id)
                                }
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {team.pokemon.length < 6 && (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-48 flex items-center justify-center">
                        Add Pokémon ({team.pokemon.length}/6)
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
