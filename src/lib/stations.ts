  import api from "@/src/services/api";
import { RegisterStationData } from "@/src/types";

export async function registerStation(stationData: RegisterStationData) {
  try {
    const response = await api.post("/stations", stationData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar estação:", error);
    throw error;
  }
}

export async function getStations() {
  try {
    const response = await api.get("/stations");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estações:", error);
    throw error;
  }
}

export const deleteStation = async (stationId: string) => {
  try {
    await api.delete(`/stations/${stationId}`);
  } catch (error) {
    console.error("Erro ao deletar estação:", error);
    throw error;
  }
};