"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { User } from "firebase/auth";

interface HeaderProps {
  user?: User | null;
}

export default function Header({ user }: HeaderProps) {
  const [date, setDate] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleBack = () => {
    router.back();
  };

  const showBackButton = pathname.startsWith("/dashboard/users/list/");

  return (
    <header className="h-16 bg-gray-100 flex flex-row justify-between items-center px-6">
      <div className="flex items-center">
        {showBackButton && (
          <button onClick={handleBack} className="mr-3 text-gray-700">
            <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
          </button>
        )}
        <input
          name="date"
          value={date}
          onChange={handleChange}
          type="date"
          className="border border-gray-400 shadow-sm rounded-md p-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center">
        <div className="flex flex-col justify-center items-end">
          <span className="text-gray-600 font-medium">
            {user?.displayName || "Usuário"}
          </span>
          <span className="text-gray-400 text-sm">
            {user?.email || "email@exemplo.com"}
          </span>
        </div>
        <div className="bg-gray-700 shadow-sm rounded-full w-14 h-14 ml-3 border-blue-800 border-2" />
        <div className="ml-4 text-gray-600 font-semibold">N/L</div>
      </div>
    </header>
  );
}
