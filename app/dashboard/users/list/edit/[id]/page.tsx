"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserById, updateUser } from "@/src/lib/users";
import { RegisterUserData } from "@/src/types";

interface DashboardEditPageProps {
  params: Promise<{ id: string }>;
}

export default function DashboardEditPage({ params }: DashboardEditPageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const router = useRouter();
  const [formData, setFormData] = useState<RegisterUserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    cpf: "",
    birthday: "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserById(id);
        const birthday = data.birthday?._seconds
          ? new Date(data.birthday._seconds * 1000).toISOString().split("T")[0]
          : "";

        setFormData({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          cpf: data.cpf,
          birthday,
          password: "",
          confirmPassword: "",
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido ao buscar usuário.");
        }
      }
    }
    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setError("As senhas não coincidem.");
        return;
      }
    }

    try {
      await updateUser(id, formData);
      console.log("Usuário atualizado com sucesso!");
      router.push("/dashboard/users/list");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao atualizar usuário.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="flex flex-col max-w-lg w-full">
        <h1 className="text-xl text-blue-600 font-medium">Editar Usuário</h1>
        <p className="my-2 text-sm text-gray-600">
          Altere os dados do usuário abaixo.
        </p>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4 bg-white shadow-md p-6 rounded-lg">
          <div className="flex flex-col gap-2">
            <label>Nome de Usuário</label>
            <input
              name="name"
              value={formData.name}
              readOnly
              type="text"
              className="border border-gray-300 rounded-md p-2 bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Endereço de e-mail</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2 w-1/2">
              <label>CPF</label>
              <input
                name="cpf"
                value={formData.cpf}
                readOnly
                type="text"
                className="border border-gray-300 rounded-md p-2 bg-gray-100"
              />
            </div>

            <div className="flex flex-col gap-2 w-1/2">
              <label>Aniversário</label>
              <input
                name="birthday"
                value={formData.birthday}
                readOnly
                type="date"
                className="border border-gray-300 rounded-md p-2 bg-gray-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label>Número de celular</label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              type="tel"
              required
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Atualizar
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </div>
  );
}
