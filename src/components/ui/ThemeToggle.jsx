import { useEffect } from "react";

// Function to play sound when theme is toggled
function playSound(audioBuffer, audioContext) {
  if (audioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  }
}

export const ThemeToggle = ({ handleThemeSwitch, theme }) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let audioBuffer = null;

  // Load sound when component mounts
  useEffect(() => {
    async function loadClickSound() {
      const response = await fetch('/assets/sounds/RadioButton.mp3');
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    }

    loadClickSound();
  }, []);

  return (
    <button
      id="theme-toggle"
      className="theme-toggle mr-1"
      type="button"
      title="Toggle dark mode"
      aria-label="Toggle dark mode"
      aria-pressed={theme === 'dark'}
      onClick={() => {
        handleThemeSwitch();
        playSound(audioBuffer, audioContext); // Play sound when theme is toggled
      }}
    >
    </button>
  );
};
