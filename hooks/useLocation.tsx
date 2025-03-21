import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestBackgroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Location permission not granted");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        setCurrentLatitude(coords.latitude);
        setCurrentLongitude(coords.longitude);
        //console.log("lat and long:", coords.latitude, coords.longitude);

        let response = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        //console.log("User Location:", response);
      }
    } catch (error) {
      setErrorMsg("Error fetching location");
      //console.error(error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return { currentLatitude, currentLongitude, errorMsg, getUserLocation };
};


