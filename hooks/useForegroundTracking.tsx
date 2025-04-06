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
  
  addToDistance: (value: number) => void,

  setRouteCoordinates: (value: (prev: LocationCoords[]) => LocationCoords[]) => void,
) => {

  const { permissionsGranted, checkPermissionFunction } = useLocationPermission();

  const prevLocation = useRef<Location.LocationObject | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);


  const startForegroundTracking = async (): Promise<void> => {
    subscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1, 
      },
      (location) => {
        setLocation({latitude: location.coords.latitude, longitude: location.coords.longitude,});
        
        if (prevLocation.current && isTracking && prevLocation.current !== location) {
          setRouteCoordinates((prev) => [...prev, {latitude: location.coords.latitude, longitude: location.coords.longitude} ]); 

          const distanceTravelledKM = haversineDistance(prevLocation.current.coords, location.coords);
          addToDistance(distanceTravelledKM);
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
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, [permissionsGranted]);

  return {startForegroundTracking}

}

export default useForegroundTracking