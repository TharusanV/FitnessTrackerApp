import React, {useRef, useState, useEffect} from 'react';
import MapView, { UrlTile, PROVIDER_DEFAULT, Polyline, PROVIDER_GOOGLE, Marker} from "react-native-maps";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const record: React.FC  = () => {
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

  return (
    <View style={{ flex: 1 }}>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.textContainer}></Text>
        </View>
        <View>
          <Text style={styles.textContainer}>Ride</Text>
        </View>
        <View>
          <Text style={styles.textContainer}></Text>
        </View>
      </View>

      {/* MapView - Takes Remaining Space */}
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE ?? PROVIDER_DEFAULT}
          style={{ flex: 1, width: "100%" }}
          mapType="standard"
          region={{
            latitude: currentLocation?.latitude || 0,
            longitude: currentLocation?.longitude || 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
        />
      </View>

      {/* Row of Buttons - Evenly Spaced */}
      <View style={styles.buttonRow}>
        <TouchableOpacity><Text>Route</Text></TouchableOpacity>
        <TouchableOpacity><Text>Activity</Text></TouchableOpacity>
        <TouchableOpacity><Text>Devices</Text></TouchableOpacity>
        <TouchableOpacity><Text>Beacon</Text></TouchableOpacity>
        <TouchableOpacity><Text>Music</Text></TouchableOpacity>
      </View>

      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.circle}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Start</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
    height: "5%",
  },

  textContainer: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  startButtonContainer: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: "#fff",
  },

  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default record