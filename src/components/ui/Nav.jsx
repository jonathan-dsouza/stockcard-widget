import React from "react";
import '../../styles/toggle-theme.css';
import { ThemeToggle } from "./ThemeToggle";

export const Nav = ({ handleThemeSwitch, theme }) => {
  const handleReload = (event) => {
    event.preventDefault();
    window.location.reload();
  };

  return (
    <header>
      <nav className="bg-white shadow-lg px-4 py-5 lg:px-6 dark:bg-[#080808] fixed top-0 left-0 w-full z-50"> {/* Fixed position and z-index */}
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="#" className="flex items-center" onClick={handleReload}>
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              📈 Stock Widget
            </span>
          </a>
          {/* Theme toggle button */}
          <ThemeToggle handleThemeSwitch={handleThemeSwitch} theme={theme} />
        </div>
      </nav>
    </header>
  );
};
