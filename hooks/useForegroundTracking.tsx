import React, {useRef, useState, useEffect} from 'react';
import * as Location from "expo-location";
import useLocationPermission from "./useLocationPermission"

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const useForegroundTracking = (
  isTracking: boolean,
  haversineDistance: (value: LocationCoords, value2: LocationCoords) => number, 
  setLocation: (value: LocationCoords) => void,
  setSpeed: (value: number) => void,
  setRouteCoordinates: (value: (prev: LocationCoords[]) => LocationCoords[]) => void,
) => {



  const { permissionsGranted, checkPermissionFunction } = useLocationPermission();

  const prevLocation = useRef<Location.LocationObject | null>(null);
  let subscription: Location.LocationSubscription | null = null;

  const startForegroundTracking = async (): Promise<void> => {
    subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 1000, 
        distanceInterval: 5, 
      },
      (location) => {
        setLocation({latitude: location.coords.latitude, longitude: location.coords.longitude,});
        
        if (prevLocation.current && isTracking) {
          setRouteCoordinates((prev) => [...prev, {latitude: location.coords.latitude, longitude: location.coords.longitude} ]); 

          const distance = haversineDistance(prevLocation.current.coords, location.coords);
          const timeDiff = (location.timestamp - prevLocation.current.timestamp) / 1000; // Convert ms to seconds
          const speedCalc = timeDiff > 0 ? distance / timeDiff : 0; // Speed in m/s
          setSpeed(speedCalc);
        }

        prevLocation.current = location;
      }
    );
  };

  useEffect(() => {
    checkPermissionFunction();
  }, []); // Runs on mount
  
  useEffect(() => {
    if (permissionsGranted) {
      startForegroundTracking();
    }
    
    return () => {
      if (subscription) {
        subscription.remove(); // Cleanup on unmount
      }
    };
  }, [permissionsGranted]);

  return {startForegroundTracking}

}

export default useForegroundTracking