import React, {useRef, useState, useEffect,} from 'react';
import { useRouter } from 'expo-router';
import useForegroundTracking from '../../hooks/useForegroundTracking'
import useBackgroundTracking from '../../hooks/useBackgroundTracking'

import * as Location from "expo-location";
import MapView, { UrlTile, PROVIDER_DEFAULT, Polyline, PROVIDER_GOOGLE, Marker} from "react-native-maps";
import { View, TouchableOpacity, StyleSheet, Text, AppState, AppStateStatus, } from "react-native";

import useSimulatedMovement from "../../testing/useSimulatedMovement";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const record: React.FC  = () => {
  const router = useRouter();

  const [appState, setAppState] = useState(AppState.currentState); // Manage app state changes

  const [currentLocation, setLocation] = useState<LocationCoords | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LocationCoords[]>([]);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  const { startSimulation, stopSimulation, isRunning } = useSimulatedMovement(currentLocation,setLocation,setRouteCoordinates);

  useEffect(() => {
    const getInitialLocation = async () => {
      const { coords } = await Location.getCurrentPositionAsync({});
      const initialCoords = { latitude: coords.latitude, longitude: coords.longitude };

      setLocation(initialCoords);
      setIsLocationLoaded(true); 
    };

    getInitialLocation();
  }, []);

  useEffect(() => {
    if (isLocationLoaded) {
      startSimulation();
    }
  }, [isLocationLoaded]);
                        
  const { startForegroundTracking} = useForegroundTracking(setLocation);
  const { startBackgroundTracking} = useBackgroundTracking(setLocation);

  /*
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log(`App state changed to: ${nextAppState}`);
      
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);


  useEffect(() => {
    if (appState === "active") {startForegroundTracking(); } 
    else {startBackgroundTracking();}
  }, [appState]);
  */





  return (
    <View style={{ flex: 1 }}>

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/')}><Text  style={styles.textContainer}>Close</Text></TouchableOpacity>
        <View>
          <Text style={styles.textContainer}>Ride</Text>
        </View>
        <View><Text style={styles.textContainer}>Set</Text></View>
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
        >
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor="blue"
            />
          )}
        </MapView>
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