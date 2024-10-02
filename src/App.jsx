// App.jsx
import React from "react";
import './App.css';
import { Nav } from './components/ui/Nav';
import StockWidgetCard from './components/StockWidgetCard';  // Adjust path as needed
import { useTheme } from './hooks/useTheme';  // Use custom hook for theme

function App() {
  const { theme, toggleTheme } = useTheme();  // Manage theme with custom hook

  return (
    <div className="App">
      <Nav handleThemeSwitch={toggleTheme} theme={theme} />
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] px-4">
        <StockWidgetCard />
      </div>
    </div>
  );
}

export default App;
