// import React, { createContext, useContext, useState } from 'react';

// // Create context
// export const AppContext = createContext({
//   channel: null,
//   setChannel: (channel) => {},
//   thread: null,
//   setThread: (thread) => {},
// });

// // Provider
// export const AppProvider = ({ children }: { children: React.ReactNode }) => {
//   const [channel, setChannel] = useState(null);
//   const [thread, setThread] = useState(null);

//   return (
//     <AppContext.Provider value={{ channel, setChannel, thread, setThread }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// // Custom hook
// export const useAppContext = () => useContext(AppContext);

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Channel } from 'stream-chat';

type AppContextType = {
  channel: Channel | null;
  setChannel: React.Dispatch<React.SetStateAction<Channel | null>>;
  thread: any | null;
  setThread: React.Dispatch<React.SetStateAction<any | null>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [thread, setThread] = useState<any | null>(null);

  return (
    <AppContext.Provider value={{ channel, setChannel, thread, setThread }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
};
