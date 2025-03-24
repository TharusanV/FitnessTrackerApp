import React, {useRef, useState, useEffect} from 'react';
import * as Location from "expo-location";
import useLocationPermission from "../hooks/findLocationPermission"
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
    console.log("Background location update:", locations[0].coords);
  }
});

const useBackgroundTracking = (setLocation: (value: LocationCoords) => void) => {

  const { permissionsGranted, checkPermissionFunction } = useLocationPermission();

  const startBackgroundTracking = async (): Promise<void> => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    if (!isRegistered) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        deferredUpdatesInterval: 60000, // Every 1 min
        distanceInterval: 10, 
        showsBackgroundLocationIndicator: true, // iOS only
      });
    }
  };

  useEffect(() => {
    checkPermissionFunction();
  
    if(permissionsGranted){
      startBackgroundTracking();
    }
  
  }, []);

  return {startBackgroundTracking}

}

export default useBackgroundTracking