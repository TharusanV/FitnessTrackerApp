import { StyleSheet, View , Text, Button, AppState, AppStateStatus } from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import MapView, { UrlTile, PROVIDER_DEFAULT, Polyline, PROVIDER_GOOGLE, Marker} from "react-native-maps";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

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


const maps: React.FC = () => {
  const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
  const [currentLocation, setLocation] = useState<LocationCoords | null>(null);

  /*                            REQUEST PERMISSION FOR LOCATION                          */
  useEffect(() => {
    const requestPermissions = async () => {
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

    requestPermissions();
    startForegroundTracking();

  }, []);


  const startForegroundTracking = async (): Promise<void> => {
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      (location) => {
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        //console.log("Foreground location update:", location.coords);
      }
    );
  };

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
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MapView
        provider={PROVIDER_GOOGLE ?? PROVIDER_DEFAULT} 
        style={styles.map}
        mapType="standard"
        region={{
          latitude: currentLocation?.latitude || 0,
          longitude: currentLocation?.longitude || 0,
          //Zoom values below - Lower values = More zoomed in (closer view).
          latitudeDelta: 0.01, 
          longitudeDelta: 0.01,
        }}

        showsUserLocation
      >

      </MapView>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});


export default maps