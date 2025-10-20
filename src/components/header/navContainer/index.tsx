"use client"
import { useState } from "react";
import Link from "next/link";
import { FaSignInAlt, FaSignOutAlt, FaUserCircle, FaClipboardList } from "react-icons/fa";

export default function NavContainer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-10 h-10 flex flex-col justify-center items-center group outline-0 relative z-50 lg:hidden"
        aria-label="Toggle menu"
      >
        <div className="relative w-8 h-8">
          {/* Barra 1 */}
          <span
            className={`block absolute h-1 w-8 bg-amber-900 rounded transition-all duration-300 ease-in-out
              ${menuOpen
                ? 'top-4 rotate-45'
                : 'top-2 rotate-0'
              }`}
          />
          {/* Barra 2 */}
          <span
            className={`block absolute h-1 w-8 bg-amber-900 rounded transition-all duration-300 ease-in-out
              ${menuOpen
                ? 'top-4 opacity-0 scale-x-0'
                : 'top-4 opacity-100 scale-x-100'
              }`}
          />
          {/* Barra 3 */}
          <span
            className={`block absolute h-1 w-8 bg-amber-900 rounded transition-all duration-300 ease-in-out
              ${menuOpen
                ? 'top-4 -rotate-45'
                : 'top-6 rotate-0'
              }`}
          />
        </div>
      </button>
      <nav
        className={`
          absolute z-40 transition-all duration-300 w-[100%] text-lg bg-neutral-300 text-red-900 p-5 pt-9 top-[-200px] left-0 shadow-md
          lg:relative lg:top-[unset] lg:bg-transparent lg:p-0 lg:pt-0 lg:shadow-none
          ${menuOpen && 'top-[85px]'}
          `
          }
        >
        <ul
          className="
          flex flex-col space-y-3
          lg:flex-row lg:gap-11 lg:space-y-0.5 lg:justify-end "
          >
          {loggedIn ? (
            
            <>
              <li>
                <Link
                  href="/perfil"
                  className="
                    flex font-bold py-2 text-center items-center justify-center gap-2
                    lg:py-0 lg:transition-all lg:duration-300 lg:hover:text-neutral-900
                  ">
                  <FaUserCircle />
                  Minhas Informações
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="
                    flex font-bold py-2 text-center items-center justify-center gap-2
                    lg:py-0 lg:transition-all lg:duration-300 lg:hover:text-neutral-900
                  ">
                  <FaClipboardList />
                  Meus Pedidos
                </Link>
              </li>
              <li>
                <Link
                  href="/logout"
                  className="
                    flex font-bold py-2 text-center items-center justify-center gap-2
                    lg:py-0 lg:transition-all lg:duration-300 lg:hover:text-neutral-900
                  ">
                  <FaSignOutAlt />
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                onClick={() => setMenuOpen(!menuOpen)}
                className="
                  flex font-bold py-2 text-center items-center justify-center gap-2
                  lg:py-0 lg:transition-all lg:duration-300 lg:hover:text-neutral-900
                ">
                <FaSignInAlt />
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  )
}