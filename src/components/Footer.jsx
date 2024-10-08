import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full text-center py-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 md:flex md:justify-center">
        <span>📈 Stock Widget by Jonathan</span>
        <span className="hidden md:inline mx-2">|</span>
        <br />
        <span>Powered by RapidAPI - Real-Time Finance Data</span>
      </p>
    </footer>
  );
};

export default Footer;
