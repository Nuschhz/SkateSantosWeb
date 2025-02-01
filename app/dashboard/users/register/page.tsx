"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';  // Importação correta para o App Router
import { registerUser } from "@/src/lib/users";
import { RegisterUserData } from "@/src/types";

export default function DashboardRegisterPage() {
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
  const router = useRouter();  // Correto para navegação no App Router

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await registerUser(formData);
      console.log("Usuário registrado com sucesso!");

      router.push("/dashboard");  // Redirecionamento após registro bem-sucedido
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao registrar usuário.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-w-full min-h-full">
      <main className="flex flex-col">
        <h1 className="text-xl text-blue-600 font-medium">Adicionar Usuário</h1>
        <p className="my-2 text-sm text-gray-600">
          Preencha o formulário para adicionar um novo usuário ao banco de dados.
        </p>

        <form onSubmit={handleRegister} className="bg-white shadow-md p-6 flex flex-row">
          <div className="w-64 h-64 bg-gray-700 rounded-full mr-6" />

          <div className="flex flex-col gap-2">
            {/* Nome e Email */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <span>Nome de Usuário</span>
                <input
                  name="name"
                  placeholder="Digite seu nome"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  required
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span>Endereço de e-mail</span>
                <input
                  name="email"
                  placeholder="Digite seu e-mail"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Senha e Confirmação */}
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2">
                <span>Senha</span>
                <input
                  name="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  required
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span>Confirme sua senha</span>
                <input
                  name="confirmPassword"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  required
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* CPF e Aniversário */}
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2">
                <span>CPF</span>
                <input
                  name="cpf"
                  placeholder="Digite seu CPF"
                  value={formData.cpf}
                  onChange={handleChange}
                  type="text"
                  required
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <span>Aniversário</span>
                <input
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  type="date"
                  required
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="flex flex-col gap-2">
              <span>Número de celular</span>
              <input
                name="phoneNumber"
                placeholder="Digite seu telefone"
                value={formData.phoneNumber}
                onChange={handleChange}
                type="tel"
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botão de Cadastro */}
            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              Cadastrar
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </div>
  );
}