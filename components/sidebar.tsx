"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBars,
  faHome,
  faUsers,
  faUserPlus, 
  // faUserEdit, 
  faTable, 
  faFolderPlus, 
  faFolderTree, 
  // faFolderBlank 
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import SubMenu from "./submenu";

export default function Sidebar({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}) {
  return (
    <aside
      className={`bg-gray-900 text-white h-screen transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      } flex flex-col fixed left-0 top-0 z-50 shadow-lg`}
    >
      <nav className="p-4">
        <div className={`flex items-center ${isExpanded ? "justify-between" : "justify-center"} mb-6`}>
          
          {/* Botão de expandir/recolher */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-3 rounded-lg hover:bg-gray-700 transition-colors flex justify-center items-center w-full"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
          
          {/* Logo visível apenas se a sidebar estiver expandida */}
          {isExpanded && (
            <Image
              src="/white_santos.svg"
              alt="Logo Skate Santos em branco"
              width={100}
              height={100}
              className="w-32 transition-opacity duration-500 opacity-100"
            />
          )}
        </div>

        <ul className="space-y-4">

          {/* Item Dashboard */}
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all"
            >
              <div className={`flex items-center justify-center w-12 ${isExpanded ? "mr-3" : ""}`}>
                <FontAwesomeIcon icon={faHome} className="text-lg" />
              </div>
              <span className={`transition-opacity duration-1000 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}>
                Dashboard
              </span>
            </Link>
          </li>

          {/* Menu de Usuários usando o SubMenu */}
          <SubMenu
            title="Usuários"
            icon={faUsers}
            isExpanded={isExpanded}
            items={[
              { label: "Criar Usuário", href: "/dashboard/users/register", icon: faUserPlus },
              // { label: "Atualizar Usuário", href: "/dashboard/users/edit", icon: faUserEdit },
              { label: "Tabela de Usuários", href: "/dashboard/users/list", icon: faTable },
            ]}
          />
           <SubMenu
            title="Estações"
            icon={faFolderTree}
            isExpanded={isExpanded}
            items={[
              { label: "Criar Estação", href: "/dashboard/stations/register", icon: faFolderPlus },
              // { label: "Atualizar Estação", href: "/dashboard/stations/edit", icon: faFolderBlank },
              { label: "Tabela de Estações", href: "/dashboard/stations/list", icon: faTable },
            ]}
          />
        </ul>
      </nav>
    </aside>
  );
}
