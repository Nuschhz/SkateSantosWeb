import api from "@/src/services/api";

export async function getTickets() {
  try {
    const response = await api.get("/tickets");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar aluguéis:", error);
    throw error;
  }
}

export async function updateTicketStatus(ticketId: string, newStatusString: string) {
  const statusNumber = newStatusString === 'done' ? 1 : 0;

  try {
    const response = await api.patch(`/tickets/${ticketId}`, {
      status: statusNumber, 
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar ticket ${ticketId}:`, error);
    throw error;
  }
}