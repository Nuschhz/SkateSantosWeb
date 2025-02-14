"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJsApiLoader } from "@react-google-maps/api";
import { registerStation, getStations } from "@/src/lib/stations";
import MapComponent from "@/components/map";

export default function DashboardRegisterPage() {
  const [formData, setFormData] = useState({
    address: "",
    cells: 1,
    latitude: 0,
    longitude: 0,
  });

  const [stations, setStations] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_GOOGLE_MAPS ?? "",
    libraries: ["places"],
  });

  useEffect(() => {
    async function fetchStations() {
      try {
        const data = await getStations();
        setStations(data);
      } catch (err) {
        console.error("Erro ao buscar estações:", err);
      }
    }
    fetchStations();
  }, []);

  const removeArrow =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cells" || name === "latitude" || name === "longitude"
          ? name === "cells"
            ? Math.max(1, parseFloat(value) || 1)
            : parseFloat(value)
          : value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      console.log(formData);
      await registerStation(formData);
      router.push("/dashboard");
    } catch (err) {
      setError("Erro ao cadastrar estação. Verifique os campos e preencha novamente.");
      console.error(err);
    }
  };

  if (!isLoaded) {
    return <div>Carregando mapa...</div>;
  }

  return (
    <div className="flex items-center justify-center min-w-full min-h-full">
      <main className="flex flex-col">
        <h1 className="text-xl text-blue-600 font-medium">Adicionar Estação</h1>
        <p className="my-2 text-sm text-gray-600">
          Preencha o formulário para adicionar uma nova estação ao banco de dados.
        </p>

        <form onSubmit={handleRegister} className="bg-white shadow-md p-6 flex flex-row">
          {/* Componente do mapa */}
          <MapComponent
            isLoaded={isLoaded}
            latitude={formData.latitude}
            longitude={formData.longitude}
            setLatitude={(latitude) => setFormData((prev) => ({ ...prev, latitude }))}
            setLongitude={(longitude) => setFormData((prev) => ({ ...prev, longitude }))}
            stations={stations}
          />

          <div className="flex flex-col gap-2 ml-4 justify-between">
            <div className="flex flex-col gap-2">
              {/* Campo de Células */}
              <div className="flex flex-row gap-2 items-center justify-between">
                <label>Células</label>
                <input
                  name="cells"
                  value={formData.cells}
                  onChange={handleChange}
                  type="number"
                  min="1" // Garante que o usuário não possa inserir valores menores que 1
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                />
              </div>

              {/* Campo de Latitude */}
              <div className="flex flex-col gap-2">
                <label>Latitude</label>
                <input
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  type="number"
                  className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${removeArrow}`}
                />
              </div>

              {/* Campo de Longitude */}
              <div className="flex flex-col gap-2">
                <label>Longitude</label>
                <input
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  type="number"
                  className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${removeArrow}`}
                />
              </div>
            </div>

            {/* Botão para cadastrar a estação */}
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Cadastrar Estação
            </button>
          </div>
        </form>

        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  );
}
