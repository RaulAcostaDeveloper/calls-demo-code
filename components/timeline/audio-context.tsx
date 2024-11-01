"use client";

import { createContext, useState, useContext, useCallback } from "react";

type AudioContextType = {
  currentlyPlayingId: string | null;
  play: (id: string) => void;
  pause: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );

  const play = useCallback((id: string) => {
    setCurrentlyPlayingId(id);
  }, []);

  const pause = useCallback(() => {
    setCurrentlyPlayingId(null);
  }, []);

  return (
    <AudioContext.Provider value={{ currentlyPlayingId, play, pause }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
