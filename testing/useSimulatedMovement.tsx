import { useRef, useState } from "react";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const useSimulatedMovement = (currentLocation: LocationCoords | null, setLocation: (value: LocationCoords) => void, setRouteCoordinates: (value: (prev: LocationCoords[]) => LocationCoords[]) => void) => {
  const counterRef = useRef(0);
  const [isRunning, setIsRunning] = useState(false);
  let intervalId: NodeJS.Timeout | null = null;

  const startSimulation = () => {
    if (!currentLocation || intervalId) return; 

    setIsRunning(true);
    intervalId = setInterval(() => {
      const baseLatitude = currentLocation.latitude;
      const baseLongitude = currentLocation.longitude;

      // Simulate movement pattern (small variations)
      const newLatitude = baseLatitude + counterRef.current * 0.1;
      const newLongitude = baseLongitude + counterRef.current * 0.1;

      const newLocation = { latitude: newLatitude, longitude: newLongitude };

      setLocation(newLocation); 
      setRouteCoordinates((prev) => [...prev, newLocation]); 

      counterRef.current += 1;
    }, 2000);
  };

  const stopSimulation = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      setIsRunning(false);
    }
  };

  return { startSimulation, stopSimulation, isRunning };
};

export default useSimulatedMovement;
