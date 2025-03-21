import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);

  const getUserLocation = async () => {
    try {
      // Request foreground permission first
      let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        setErrorMsg("Foreground location permission not granted");
        return;
      }

      // Request background permission after foreground permission is granted
      let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        setErrorMsg("Background location permission not granted");
        return;
      }

      // Fetch current location
      let { coords } = await Location.getCurrentPositionAsync({});
      if (coords) {
        setCurrentLatitude(coords.latitude);
        setCurrentLongitude(coords.longitude);

        let response = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        console.log("User Location:", response);
      }
    } catch (error) {
      setErrorMsg("Error fetching location");
      console.error(error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return { currentLatitude, currentLongitude, errorMsg, getUserLocation };
};
