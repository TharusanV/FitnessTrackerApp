import React, {useRef, useState, useEffect} from 'react';
import * as Location from "expo-location";
import useLocationPermission from "./useLocationPermission"

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const useForegroundTracking = (
  setLocation: (value: LocationCoords) => void,
  setSpeed: (value: number) => void,
  setRouteCoordinates: (value: (prev: LocationCoords[]) => LocationCoords[]) => void,
) => {

  const { permissionsGranted, checkPermissionFunction } = useLocationPermission();
  const prevLocation = useRef<Location.LocationObject | null>(null);
  let subscription: Location.LocationSubscription | null = null;

  const haversineDistance = (previousCoords: LocationCoords, currentCoords: LocationCoords) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters

    const dLat = toRad(currentCoords.latitude - previousCoords.latitude);
    const dLon = toRad(currentCoords.longitude - previousCoords.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(previousCoords.latitude)) *
        Math.cos(toRad(currentCoords.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const startForegroundTracking = async (): Promise<void> => {
    subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 1000, 
        distanceInterval: 5, 
      },
      (location) => {
        setLocation({latitude: location.coords.latitude, longitude: location.coords.longitude,});
        setRouteCoordinates((prev) => [...prev, {latitude: location.coords.latitude, longitude: location.coords.longitude} ]); 

        if (prevLocation.current) {
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