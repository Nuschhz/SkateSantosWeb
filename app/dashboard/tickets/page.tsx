"use client";

import { fetchTickets, fetchUsers } from "@/src/lib/serverActions";
import { TicketData, User } from "@/src/types";
import { useEffect, useState } from "react";

export default function DashboardTicketsPage() {

  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
      async function loadTickets() {
        setLoading(true);
        const data = await fetchTickets();
        const users = await fetchUsers();
        setUsers(users);
        setTickets(data);
        setLoading(false);
      }
      loadTickets();
    }, []);

    const getUserNameById = (userId: string) => {
      const user = users.find((user) => user.id === userId);
      return user ? user.name : "Usuário desconhecido";
    };

    const capitalize = (text: string) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const buildStatus = (status: string) => {
      const capitalizedStatus = capitalize(status);
        if(status === 'done'){
          return (
          <span className="flex flex-row align-center bg-green-50 text-green-500 px-2 py-1 rounded-xl border-green-500 border text-sm">
             {capitalizedStatus}
          </span>);
        }
        return (
          <span className="flex flex-row align-center bg-yellow-50 text-yellow-500 px-2 py-1 rounded-xl border-yellow-500 border text-sm">
            {capitalizedStatus}
          </span>);
    }

    const formatFirebaseTimestamp = (timestamp: { _seconds: number; _nanoseconds: number }) => {
      if (!timestamp || typeof timestamp._seconds !== "number") return "Data inválida";
      
      const date = new Date(timestamp._seconds * 1000);
      return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    };
    
    

    return (
      <div className="items-center justify-items-center min-h-full ">
        <main className="flex flex-col w-full max-w-5xl">
          
          <div>
            <p className="text-xl text-blue-600 font-medium">Tickets Recebidos</p>
            <div className="flex flex-row">
             <p className="my-2 text-sm text-gray-600">Lista com todos os tickets enviados pelos usuários do&nbsp;</p>
             <p className="my-2 text-sm text-blue-600 font-semibold">Santos Skate</p>
            </div>
          </div>
          <div className="flex flex-col mt-2 gap-2">
            {
            loading ? <p>Carregando Mensagens</p> :
            tickets.map((ticket) => {
              return (
                <div key={ticket.id} className="flex flex-col py-4 px-6 rounded-lg shadow-md bg-gray-50">
                  <div className="flex flex-row justify-between">
                    <p className="font-semibold">Enviado por: {getUserNameById(ticket.userId)}</p>
                    Assunto: {capitalize(ticket.type)}
                  </div>
                  <p className="my-2 px-4">{ticket.message}</p>
                  <div className="flex flex-row justify-between items-center">
                  <p className="my-2 text-xs text-gray-600">{formatFirebaseTimestamp(ticket.createdAt)}</p>
                  <span>{buildStatus(ticket.status)}</span>
                  </div>
                </div>
              );
            })
          }</div>
        </main>
      </div>
    );
  }
    