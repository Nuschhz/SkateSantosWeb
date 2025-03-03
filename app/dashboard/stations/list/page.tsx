"use client";

import { useEffect, useState } from "react";
import { fetchStations, removeStation } from "@/src/lib/serverActions";
import { Station } from "@/src/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function StationsListPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStations() {
      setLoading(true);
      const data = await fetchStations();
      setStations(data);
      setLoading(false);
    }
    loadStations();
  }, []);

  const handleDeleteStation = async (stationId: string) => {
    if (confirm("Tem certeza que deseja deletar esta estação?")) {
      try {
        await removeStation(stationId);
        const updatedStations = await fetchStations();
        setStations(updatedStations);
      } catch (error) {
        console.error("Erro ao deletar estação:", error);
      }
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center min-w-screen min-h-screen p-4">
      <main className="flex flex-col w-full max-w-5xl">
        <p className="text-lg font-bold mb-4">Lista de Estações</p>
        <div className="mt-4 overflow-y-auto pb-4" style={{ height: "60vh" }}>
          {loading ? (
            <p>Carregando estações...</p>
          ) : (
            stations.map((station) => (
              <div
                key={station.id}
                className="bg-white grid grid-cols-5 gap-4 py-4 px-6 rounded-lg shadow-md mt-4 w-full items-center"
              >
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400">Nome da estação</p>
                  <p className="font-medium truncate">{station.name}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400">Células</p>
                  <p className="text-gray-600">{station.cells.length}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400">Latitude</p>
                  <p className="text-gray-600">{station.latitude}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400">Longitude</p>
                  <p className="text-gray-600">{station.longitude}</p>
                </div>
                <div className="flex flex-col items-end">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-rose-600 cursor-pointer text-lg"
                    onClick={() => handleDeleteStation(station.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
