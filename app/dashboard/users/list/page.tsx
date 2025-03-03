"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { User } from "@/src/types/index";
import { useRouter } from "next/navigation";
import { fetchUsers, addUserCredits, removeUser } from "@/src/lib/serverActions";

export default function DashboardListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const handleAddCredits = async (id: string) => {
    try {
      await addUserCredits(id, 5);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Erro ao adicionar créditos.", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        await removeUser(userId);
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center min-w-screen h-screen p-4">
      <main className="flex flex-col w-full max-w-5xl">
        <div>
          <p className="text-lg font-bold mb-4">Pesquise por um usuário</p>
          <input
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Insira Nome ou ID"
          />
        </div>
        <div className="mt-4 overflow-y-auto pb-4" style={{ height: "60vh" }}>
          {loading ? (
            <p>Carregando usuários...</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white flex flex-row items-center gap-4 py-4 px-6 rounded-lg shadow-md mt-4 w-full"
              >
                <div className="flex flex-col w-[20%]">
                  <p className="text-sm text-gray-400">Nome de usuário</p>
                  <p className="font-medium truncate">{user.name}</p>
                </div>
                <div className="flex flex-col w-[20%]">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-gray-600 truncate">{user.email}</p>
                </div>
                <div className="flex flex-col w-[15%]">
                  <p className="text-sm text-gray-400">Telefone</p>
                  <p className="text-gray-600 truncate">{user.phoneNumber}</p>
                </div>
                <div className="flex flex-col w-[15%]">
                  <p className="text-sm text-gray-400">CPF</p>
                  <p className="text-gray-600 truncate">{user.cpf}</p>
                </div>
                <div className="flex flex-col w-[10%]">
                  <p className="text-sm text-gray-400">Créditos</p>
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-lg font-bold">{user.credits}</span>
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="cursor-pointer text-gray-500"
                      onClick={() => handleAddCredits(user.id)}
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-evenly items-center w-[10%]">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-blue-700 cursor-pointer text-lg"
                    onClick={() => router.push(`/dashboard/users/list/edit/${user.id}`)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-rose-600 cursor-pointer text-lg"
                    onClick={() => handleDeleteUser(user.id)}
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
