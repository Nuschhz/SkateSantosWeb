"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { SubMenuProps } from "@/src/types";

export default function SubMenu({ title, icon, items, isExpanded }: SubMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
      >
        <div className={`flex items-center justify-center w-12 ${isExpanded ? "mr-3" : ""}`}>
          <FontAwesomeIcon icon={icon} className="text-lg" />
        </div>
        <span className={`transition-opacity duration-1000 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}>
          {title}
        </span>
        {isExpanded && (
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            className="text-sm ml-auto transition-transform duration-300"
          />
        )}
      </button>

      {/* Submenu */}
      {isOpen && (
        <ul className="mt-2 space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-all ${
                  isExpanded ? "pl-6" : ""
                }`}
              >
                <div className="flex items-center justify-center w-12">
                  <FontAwesomeIcon icon={item.icon} className="text-lg" />
                </div>
                <span className={`${isExpanded ? "opacity-100" : "opacity-0 hidden"} transition-opacity duration-300`}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
