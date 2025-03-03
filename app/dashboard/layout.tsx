"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import React from "react";
import { DashboardDateProvider } from "@/src/context/DashboardDateContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <DashboardDateProvider>
      <div className="flex">
        <Sidebar
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
        />
        <div
          className={`flex flex-1 flex-col h-screen transition-all duration-300 ${
            isSidebarExpanded ? "ml-64" : "ml-20"
          }`}
        >
          <Header user={user} />
          <main className="flex-1 overflow-hidden pt-16 p-6 bg-neutral-50">
            {children}
          </main>
        </div>
      </div>
    </DashboardDateProvider>
  );
}
