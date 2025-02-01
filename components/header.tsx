"use client";

import { useState } from "react";

export default function Header() {
  const [date, setDate] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <header className="h-16 bg-gray-100 flex flex-row justify-between items-center px-6">
      <input
        name="date"
        value={date}
        onChange={handleChange}
        type="date"
        className="border border-gray-400 shadow-sm rounded-md p-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center">
        <div className="flex flex-col justify-center items-end">
          <span className="text-gray-600 font-medium">Gustavo Silva Nusch</span>
          <span className="text-gray-400 text-sm">nuschh05@gmail.com</span>
        </div>

        <div className="bg-gray-700 shadow-sm rounded-full w-14 h-14 ml-3 border-blue-800 border-2" />

        <div className="ml-4 text-gray-600 font-semibold">N/L</div>
      </div>
    </header>
  );
}
