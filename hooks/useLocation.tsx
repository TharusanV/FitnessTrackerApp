import { useEffect, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";



export const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [isBackgroundTracking, setIsBackgroundTracking] = useState<boolean>(false);


  const requestPermissions = async () => {
    // Request foreground location permission first
    let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== "granted") {
      setErrorMsg("Foreground location permission not granted");
      return false;
    }

    // Request background location permission
    let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      setErrorMsg("Background location permission not granted");
      return false;
    }

    return true;
  };


  const startForegroundLocationTracking = async () => {
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High, 
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update when user moves 10 meters
      },
      (location) => {
        setCurrentLatitude(location.coords.latitude);
        setCurrentLongitude(location.coords.longitude);

        Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      }
    );
  };



  const startBackgroundLocationTracking = async () => {
    try {
      // Start background location updates
      await Location.startLocationUpdatesAsync("background-location-task", {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, 
        distanceInterval: 10,
        showsBackgroundLocationIndicator: true, // Shows indicator when in background
        foregroundService: {
          notificationTitle: "Location Tracking",
          notificationBody: "Your location is being tracked in the background.",
        },
      });

      setIsBackgroundTracking(true);
      //console.log("Background location updates started");
    } catch (error) {
      setErrorMsg("Error starting background location updates");
      console.error(error);
    }
  };

  useEffect(() => {
    const initialiseLocationTracking = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      startForegroundLocationTracking();

      startBackgroundLocationTracking();
    };

    initialiseLocationTracking();
  }, []);

  return { currentLatitude, currentLongitude, errorMsg, isBackgroundTracking };
};
