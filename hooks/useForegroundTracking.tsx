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
  currentLocation: LocationCoords | null,
  
  addToDistance: (value: number) => void,
  journeyDistance: number,

  setRouteCoordinates: (value: (prev: LocationCoords[]) => LocationCoords[]) => void,

  setAverageSpeed: (value: number) => void,
  journeyAverageSpeed: number, 

  journeyTimeElapsed: number,
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
        
        if (prevLocation.current && isTracking) {
          setRouteCoordinates((prev) => [...prev, {latitude: location.coords.latitude, longitude: location.coords.longitude} ]); 

          const distanceTravelledKM = haversineDistance(prevLocation.current.coords, location.coords);
          addToDistance(distanceTravelledKM);

          const newAvgSpeed = journeyTimeElapsed > 0 ? journeyDistance / (journeyTimeElapsed / 3600000) : journeyAverageSpeed;
          setAverageSpeed(newAvgSpeed);
      
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