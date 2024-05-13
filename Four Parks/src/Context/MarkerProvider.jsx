import { createContext, useContext, useState } from 'react';

const MarkerContext = createContext();

/* eslint-disable react/prop-types */
export const MarkerProvider = ({ children }) => {
  const [selectedMarkerPosition, setSelectedMarkerPosition] = useState(null);

  return (
    <MarkerContext.Provider value={{ selectedMarkerPosition, setSelectedMarkerPosition }}>
      {children}
    </MarkerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMarkerContext = () => useContext(MarkerContext);
