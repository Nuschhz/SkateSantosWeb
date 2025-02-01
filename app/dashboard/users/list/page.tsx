"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { getUsers, deleteUser } from "@/src/lib/users"; // Agora usa Axios!
import { User } from "@/src/types/index";
import { useRouter } from "next/navigation";

export default function DashboardListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Função para deletar o usuário com Axios
  const handleDelete = async (userID: string) => {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await deleteUser(userID); // Chamada com Axios
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userID));
        console.log("Usuário deletado com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center min-w-screen min-h-screen p-4">
      <main className="flex flex-col w-full max-w-5xl">
        <p className="text-lg font-bold mb-4">Pesquise por um usuário</p>
        <input className="border p-2 rounded w-full  focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Insira Nome ou ID" />

        {loading ? (
          <p>Carregando usuários...</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white flex flex-row items-start gap-4 py-4 px-6 rounded-lg shadow-md mt-4 w-full"
            >
              {/* Nome do Usuário */}
              <div className="flex flex-col w-[20%] justify-between">
                <p className="text-sm text-gray-400">Nome de usuário</p>
                <p className="font-medium truncate">{user.name}</p>
              </div>

              {/* Email */}
              <div className="flex flex-col w-[20%] justify-between">
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-gray-600 truncate">{user.email}</p>
              </div>

              {/* Telefone */}
              <div className="flex flex-col w-[15%] justify-between">
                <p className="text-sm text-gray-400">Telefone</p>
                <p className="text-gray-600 truncate">{user.phoneNumber}</p>
              </div>

              {/* CPF */}
              <div className="flex flex-col w-[15%] justify-between">
                <p className="text-sm text-gray-400">CPF</p>
                <p className="text-gray-600 truncate">{user.cpf}</p>
              </div>

              {/* Créditos */}
              <div className="flex flex-col w-[10%] justify-between">
                <p className="text-sm text-gray-400">Créditos</p>
                <div className="flex flex-row items-center gap-2">
                  <span className="text-lg font-bold">{user.credits}</span>
                  <FontAwesomeIcon icon={faPlus} className="cursor-pointer text-gray-500" />
                </div>
              </div>

              {/* Ícone de Remover */}
              <FontAwesomeIcon
                icon={faTrash}
                className="text-rose-600 cursor-pointer text-lg self-center"
                onClick={() => handleDelete(user.id)}
              />

              <FontAwesomeIcon
                icon={faEdit}
                className="text-blue-700 cursor-pointer text-lg self-center"
                onClick={()=>router.push("/dashboard/users/list/edit")}
              />
            </div>
          ))
        )}
      </main>
    </div>
  );
}
