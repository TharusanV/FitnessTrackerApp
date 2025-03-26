import React, {useRef, useState, useEffect} from 'react';
import * as Location from "expo-location";
import useLocationPermission from "./useLocationPermission"
import * as TaskManager from "expo-task-manager";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background location error:", error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const latestLocation = locations[0].coords;
    setLocation:(latestLocation);
    
  }
});

const useBackgroundTracking = (setLocation: (value: LocationCoords) => void) => {

  const { permissionsGranted, checkPermissionFunction } = useLocationPermission();

  const startBackgroundTracking = async (): Promise<void> => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (!isRegistered) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        deferredUpdatesInterval: 1000,
        distanceInterval: 10, 
        showsBackgroundLocationIndicator: true, // iOS only
      });
    }
  };



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