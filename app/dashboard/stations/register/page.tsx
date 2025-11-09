"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerStation, getStations } from "@/src/lib/stations";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="w-[800px] h-[450px] bg-gray-100 rounded-md flex items-center justify-center">
      Carregando mapa...
    </div>
  ),
});

export default function DashboardRegisterPage() {
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    cells: 1,
    latitude: 0,
    longitude: 0,
  });

  const [stations, setStations] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);
  const [error, setError] = useState("");
  const router = useRouter();

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
      setError(
        "Erro ao cadastrar estação. Verifique os campos e preencha novamente."
      );
      console.error(err);
    }
  };
  return (
    <div className="flex items-center justify-center min-w-full min-h-full">
      <main className="flex flex-col">
        <h1 className="text-xl text-blue-600 font-medium">Adicionar Estação</h1>
        <p className="my-2 text-sm text-gray-600">
          Preencha o formulário para adicionar uma nova estação ao banco de
          dados.
        </p>

        <form
          onSubmit={handleRegister}
          className="bg-white shadow-md p-6 flex flex-row"
        >
          <div className="w-[800px] h-[450px]">
            <MapWithNoSSR
              latitude={formData.latitude}
              longitude={formData.longitude}
              setLatitude={(latitude) =>
                setFormData((prev) => ({ ...prev, latitude }))
              }
              setLongitude={(longitude) =>
                setFormData((prev) => ({ ...prev, longitude }))
              }
              stations={stations}
            />
          </div>

          <div className="flex flex-col gap-2 ml-4 justify-between w-64">
            {" "}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Nome da estação
                </label>
                <input
                  name="name"
                  placeholder="Nome"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${removeArrow}`}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Células
                </label>
                <input
                  name="cells"
                  value={formData.cells}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude || ""}
                  onChange={handleChange}
                  type="number"
                  step="any"
                  className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${removeArrow}`}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude || ""}
                  onChange={handleChange}
                  type="number"
                  step="any"
                  className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${removeArrow}`}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Cadastrar Estação
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </div>
  );
}
