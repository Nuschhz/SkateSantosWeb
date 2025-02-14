"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DashboardDateContextProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const DashboardDateContext = createContext<DashboardDateContextProps | undefined>(undefined);

export const DashboardDateProvider = ({ children }: { children: ReactNode }) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  return (
    <DashboardDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DashboardDateContext.Provider>
  );
};

export const useDashboardDate = () => {
  const context = useContext(DashboardDateContext);
  if (!context) {
    throw new Error("useDashboardDate must be used within a DashboardDateProvider");
  }
  return context;
};
