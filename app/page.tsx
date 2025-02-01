"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function DashboardPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const inputClassName =
    "rounded-3xl border-gray-400 text-gray-400 border py-2 px-4 pr-10 outline-2 outline-gray-300 w-full";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      console.error(err);
    }
  };

  return (
    <div className="items-center justify-items-center min-h-screen flex flex-row">
      <aside className="w-2/3 bg-gray-900 min-h-screen flex justify-center items-center">
        <Image
          src="/white_santos.svg"
          alt="Logo Skate Santos"
          width={100}
          height={100}
          className="w-1/3"
        />
      </aside>
      <main className="w-1/3 flex flex-col justify-center items-center min-h-screen">
        <form onSubmit={handleLogin} className="flex flex-col gap-6 min-w-28 w-1/3">
          <Image src="/logo.svg" alt="Logo Skate Santos" width={100} height={100} className="w-full" />
          
          <input
            placeholder="E-mail/Telefone"
            value={email}
            className={inputClassName}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          
          <div className="relative w-full">
            <input
              placeholder="Senha"
              value={password}
              className={inputClassName}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>
          
          <button
            type="submit"
            className="rounded-3xl bg-blue-700 text-white p-2 hover:bg-blue-600"
          >
            Acessar
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </div>
  );
}
