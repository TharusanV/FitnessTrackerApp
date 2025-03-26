import React, {useRef, useState, useEffect,} from 'react';
import { useRouter } from 'expo-router';

const routeIcon = require('../../assets/icons/route.png');
const cycleIcon = require('../../assets/icons/bicycle.png');
const healthIcon = require('../../assets/icons/health.png');
const beaconIcon = require('../../assets/icons/beacon.png');
const musicIcon = require('../../assets/icons/music.png');

import useForegroundTracking from '../../hooks/useForegroundTracking'
import useBackgroundTracking from '../../hooks/useBackgroundTracking'

import * as Location from "expo-location";
import MapView, { UrlTile, PROVIDER_DEFAULT, Polyline, PROVIDER_GOOGLE, Marker} from "react-native-maps";
import { View, TouchableOpacity, StyleSheet, Text, AppState, AppStateStatus, Image,  } from "react-native";

import useSimulatedMovement from "../../testing/useSimulatedMovement";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const record: React.FC  = () => {
  const router = useRouter();

  const [appState, setAppState] = useState(AppState.currentState); 
  
  const [currentLocation, setLocation] = useState<LocationCoords | null>(null);
  const [speed, setSpeed] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<LocationCoords[]>([]);
  
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  //Hooks
  const { startForegroundTracking} = useForegroundTracking(setLocation, setSpeed, setRouteCoordinates);
  const { startBackgroundTracking} = useBackgroundTracking(setLocation, setSpeed, setRouteCoordinates);
  //const { startSimulation, stopSimulation, isRunning } = useSimulatedMovement(currentLocation,setLocation,setRouteCoordinates);

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
    if (appState === "active"){
      startForegroundTracking(); 
      //startSimulation();
    } 
    else {
      startBackgroundTracking();
    }
  }, [appState]);


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
        <TouchableOpacity>
          <Image source={routeIcon} style={{width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={cycleIcon} style={{width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={healthIcon} style={{width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={beaconIcon} style={{width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={musicIcon} style={{width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
      </View>

      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.circle} onPress={() => setIsTracking(true)}>
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