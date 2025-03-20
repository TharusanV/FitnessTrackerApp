import { useEffect, useState } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permission not granted");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        console.log("lat and long:", coords.latitude, coords.longitude);

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

  return { latitude, longitude, errorMsg, getUserLocation };
};


