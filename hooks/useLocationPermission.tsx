import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useFindLocationPermission = () => {
  const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);

  const checkPermissionFunction = async () => {
    const { status: foregroundAccessStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundAccessStatus !== "granted") {
      console.warn("Foreground location permission denied");
      return;
    }

    const { status: backgroundAccessStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundAccessStatus !== "granted") {
      console.warn("Background location permission denied");
      return;
    }

    setPermissionsGranted(true);
  };

  useEffect(() => {
    checkPermissionFunction();
  }, []);

  return { permissionsGranted, checkPermissionFunction };
};

export default useFindLocationPermission;