"use client";

import { fetchTickets, fetchUsers } from "@/src/lib/serverActions";
import { updateTicketStatus } from "@/src/lib/tickets";
import { TicketData, User } from "@/src/types";
import { useEffect, useState } from "react";

interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface FirebaseWebTimestamp {
  seconds: number;
  nanoseconds: number;
}

export default function DashboardTicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      setLoading(true);
      try {
        const data: TicketData[] = await fetchTickets();
        const usersData: User[] = await fetchUsers();

        console.log(
          "Tipos de data recebidos:",
          data.map((t: TicketData) => ({
            id: t.id,
            tipo: typeof t.createdAt,
            valor: t.createdAt,
          }))
        );
        const sortedData = [...data].sort((a: TicketData, b: TicketData) => {
          const getMillis = (date: unknown): number => {
            if (!date) return 0;

            if (typeof date === "number") return date;

            if (typeof date === "string") {
              const ms = Date.parse(date);
              return isNaN(ms) ? 0 : ms;
            }

            if (typeof date === "object") {
              if (date instanceof Date) return date.getTime();

              if ("_seconds" in date) {
                const ts = date as FirebaseTimestamp;
                return ts._seconds * 1000 + (ts._nanoseconds || 0) / 1_000_000;
              }

              if ("seconds" in date) {
                const ts = date as FirebaseWebTimestamp;
                return ts.seconds * 1000 + (ts.nanoseconds || 0) / 1_000_000;
              }
            }

            return 0;
          };

          const timeA = getMillis(a.createdAt);
          const timeB = getMillis(b.createdAt);

          return timeB - timeA;
        });

        setUsers(usersData);
        setTickets(sortedData);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const getUserNameById = (userId: string) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Usuário desconhecido";
  };

  const capitalize = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatFirebaseTimestamp = (timestamp: unknown) => {
    if (!timestamp) return "Data inválida";

    let date: Date | null = null;

    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else if (typeof timestamp === "object") {
      if ("_seconds" in timestamp) {
        date = new Date((timestamp as FirebaseTimestamp)._seconds * 1000);
      } else if ("seconds" in timestamp) {
        date = new Date((timestamp as FirebaseWebTimestamp).seconds * 1000);
      }
    }

    if (!date || isNaN(date.getTime())) return "Data inválida";

    return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
      await updateTicketStatus(ticketId, newStatus);
    } catch (error) {
      console.error("Falha ao atualizar status", error);
      alert("Erro ao atualizar status.");
    }
  };

  const StatusDropdown = ({ ticket }: { ticket: TicketData }) => {
    const isDone = ticket.status === "done" || ticket.status === "closed";

    const baseClasses =
      "appearance-none cursor-pointer px-2 py-1 rounded-xl border text-sm font-medium focus:outline-none pr-6";

    const colorClasses = isDone
      ? "bg-green-50 text-green-500 border-green-500"
      : "bg-yellow-50 text-yellow-500 border-yellow-500";

    return (
      <div className="relative inline-block">
        <select
          value={ticket.status}
          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
          className={`${baseClasses} ${colorClasses}`}
        >
          <option value="open">Open</option>
          <option value="done">Done</option>
        </select>

        <div
          className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 ${
            isDone ? "text-green-500" : "text-yellow-500"
          }`}
        >
          <svg
            className="fill-current h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden items-center">
      <main className="flex flex-col w-full max-w-5xl h-full">
        <div className="flex-none mb-4">
          <p className="text-xl text-blue-600 font-medium">Tickets Recebidos</p>
          <div className="flex flex-row">
            <p className="my-2 text-sm text-gray-600">
              Lista com todos os tickets enviados pelos usuários do&nbsp;
            </p>
            <p className="my-2 text-sm text-blue-600 font-semibold">
              Santos Skate
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2 pb-20 scrollbar-thin scrollbar-thumb-gray-300">
          {loading ? (
            <p className="text-gray-500 mt-4 text-center">
              Carregando Mensagens...
            </p>
          ) : (
            tickets.map((ticket) => {
              return (
                <div
                  key={ticket.id}
                  className="flex flex-col py-4 px-6 rounded-lg shadow-md bg-gray-50 flex-shrink-0"
                >
                  <div className="flex flex-row justify-between items-center">
                    <p className="font-semibold text-gray-800">
                      Enviado por: {getUserNameById(ticket.userId)}
                    </p>
                    <span className="text-sm text-gray-600">
                      Assunto: {capitalize(ticket.type)}
                    </span>
                  </div>

                  <p className="my-2 px-4 text-gray-700">{ticket.message}</p>

                  <div className="flex flex-row justify-between items-center mt-2">
                    <p className="text-xs text-gray-600">
                      {formatFirebaseTimestamp(ticket.createdAt)}
                    </p>
                    <StatusDropdown ticket={ticket} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
