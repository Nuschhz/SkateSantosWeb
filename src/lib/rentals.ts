import api from "@/src/services/api";

export async function fetchRentals() {
  try {
    const response = await api.get("/rentals");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar aluguéis:", error);
    throw error;
  }
}
