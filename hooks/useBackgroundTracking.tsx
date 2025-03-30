import React, {useRef, useState, useEffect} from 'react';
import * as Location from "expo-location";
import useLocationPermission from "./useLocationPermission"
import * as TaskManager from "expo-task-manager";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const LOCATION_TASK_NAME = "background-location-task";

const useBackgroundTracking = (
  isTracking: boolean,
  haversineDistance: (value: LocationCoords, value2: LocationCoords) => number, 
  setLocation: (value: LocationCoords) => void,
  
  setDistance: (value: number) => void,
  journeyDistance: number,

  setRouteCoordinates: (value: (prev: LocationCoords[]) => LocationCoords[]) => void,

  setAverageSpeed: (value: number) => void,

  journeyTimeElapsed: number,
) => {

  const { permissionsGranted, checkPermissionFunction } = useLocationPermission();

  const prevLocationRef = useRef<Location.LocationObject | null>(null);

  const startBackgroundTracking = async (): Promise<void> => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (!isRegistered) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        deferredUpdatesInterval: 1000,
        distanceInterval: 5, 
        pausesUpdatesAutomatically: true,
        foregroundService: {
          notificationTitle: "Tracking your location",
          notificationBody: "App is tracking your location in the background.",
        },
      });
    }
  };


  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error("Background location error:", error);
      return;
    }
    if (data) {
      const { locations } = data as { locations: Location.LocationObject[] };

      if (locations.length > 0) {
        const latestLocation = locations[0].coords;
        setLocation(latestLocation);
      
        if (prevLocationRef.current && isTracking) {
          setRouteCoordinates((prev) => [...prev, latestLocation ]); 

          const distanceKM = haversineDistance(prevLocationRef.current.coords, latestLocation) + journeyDistance;
          setDistance(distanceKM);

          setAverageSpeed(distanceKM / journeyTimeElapsed);
        }

        prevLocationRef.current = locations[0];
      }
    }
  });
  


  useEffect(() => {
    checkPermissionFunction();
  }, []);
  
  useEffect(() => {
    if (permissionsGranted) {
      startBackgroundTracking();
    }
  }, [permissionsGranted]); 

  return {startBackgroundTracking}

}



export default useBackgroundTracking