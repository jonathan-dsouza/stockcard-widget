import React from "react";
import './App.css';
import { Nav } from './components/Nav';
import Footer from './components/Footer';
import StockWidgetCard from './components/StockWidgetCard';
import { useTheme } from './hooks/useTheme';
import { Toaster } from "./components/ui/sonner";  // Import Sonner's Toaster component

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="App">
      <Nav handleThemeSwitch={toggleTheme} theme={theme} />
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] px-4">
        <StockWidgetCard />
      </div>
      <Toaster /> 
      <Footer />
    </div>
  );
}

export default App;
