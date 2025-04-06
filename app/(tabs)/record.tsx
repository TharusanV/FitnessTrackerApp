import React, {useRef, useState, useEffect,} from 'react';
import { useRouter } from 'expo-router';
import MapView, { UrlTile, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT, Marker } from "react-native-maps";

import useForegroundTracking from '../../hooks/useForegroundTracking'
import useBackgroundTracking from '../../hooks/useBackgroundTracking'

import * as Location from "expo-location";

import { View, TouchableOpacity, StyleSheet, Text, AppState, AppStateStatus, Image,  } from "react-native";

const routeIcon = require("../../assets/icons/route.png");
const cycleIcon = require("../../assets/icons/bicycle.png");
const healthIcon = require("../../assets/icons/health.png");
const beaconIcon = require("../../assets/icons/beacon.png");
const musicIcon = require("../../assets/icons/music.png");
const settingsIcon = require("../../assets/icons/settings.png");

interface LocationCoords {
  latitude: number;
  longitude: number;
}



const record: React.FC  = () => {
  const router = useRouter();

  const [appState, setAppState] = useState(AppState.currentState); 
  
  const [currentLocation, setLocation] = useState<LocationCoords | null>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [isJourneyFinished, setJourneyFinished] = useState(false);

  const [journeyTimeElapsed, setTimeElapsed] = useState<number>(0);
  const [journeyAverageSpeed, setAverageSpeed] = useState<number>(0);
  const [journeyDistance, setDistance] = useState<number>(0);
  
  const [routeCoordinates, setRouteCoordinates] = useState<LocationCoords[]>([]);

  const addToDistance = (newDistance: number) => {
    setDistance((prevDistance) => prevDistance + newDistance);
  };

  const resetJourneyData = () => {
    setIsTracking(false);
    setTimeElapsed(0);
    setAverageSpeed(0);
    setDistance(0);
    setRouteCoordinates([]);
  };

  const cancelJourney = () =>{
    resetJourneyData();
    router.push('/');
  }

  const startJourney = () => {
    setIsTracking(true);
  }

  const pauseJourney = () => {
    setIsTracking(!isTracking)
  }

  const finishJourney = () => {
    setIsTracking(false)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTracking) {
      timer = setInterval(() => {
        setTimeElapsed((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } 

    return () => clearInterval(timer);
  }, [isTracking]);


  useEffect(() => {
    if (journeyTimeElapsed > 0) {
      const newAvgSpeed = journeyDistance / (journeyTimeElapsed / 3600);
      setAverageSpeed(newAvgSpeed);
    } 
    else {
      setAverageSpeed(0);
    }
  }, [journeyDistance]); 
  

  const formatTime = (time: number): string => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const haversineDistance = (previousCoords: LocationCoords, currentCoords: LocationCoords) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters

    const dLat = toRad(currentCoords.latitude - previousCoords.latitude);
    const dLon = toRad(currentCoords.longitude - previousCoords.longitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(previousCoords.latitude)) * Math.cos(toRad(currentCoords.latitude)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c) / 1000; 
  };


  //Hooks
  const { startForegroundTracking} = useForegroundTracking(isTracking, haversineDistance, setLocation, addToDistance, setRouteCoordinates,);
  const { startBackgroundTracking} = useBackgroundTracking(isTracking, haversineDistance, setLocation, addToDistance, setRouteCoordinates,);

  
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
    } 
    else {
      startBackgroundTracking();
    }
  }, [appState, isTracking]);



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => { cancelJourney(); }}>
          <Text  style={styles.textContainer}>Close</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.textContainer}>Ride</Text>
        </View>

        <TouchableOpacity>
          <Image source={settingsIcon} style={{tintColor: "white", width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
      </View>

      {/* MapView */}
      <MapView
        provider={PROVIDER_GOOGLE ?? PROVIDER_DEFAULT}
        style={styles.map}
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

      <View style={styles.activityInfoContainer}>
        {/* Full-width section */}
        <View style={styles.activityInfoContainer_div1}>
          <Text style={styles.activityInfoText}>TIME</Text>
          <Text style={styles.activityValue}>{formatTime(journeyTimeElapsed)}</Text>
        </View>

        {/* Two equal-width columns */}
        <View style={styles.rowContainer}>
          <View style={styles.activityInfoContainer_div2}>
            <Text style={styles.activityInfoText}>AVG SPEED (KM/H)</Text>
            <Text style={styles.activityValue}>{journeyAverageSpeed.toFixed(2)}</Text>
          </View>
          
          <View style={styles.activityInfoContainer_div3}>
            <Text style={styles.activityInfoText}>DISTANCE (KM)</Text>
            <Text style={styles.activityValue}>{journeyDistance.toFixed(2)}</Text>
          </View>
        </View>
      </View>


      {/* Row of Buttons - Evenly Spaced */}
      <View style={styles.buttonRowContainer}>
        <TouchableOpacity>
          <Image source={routeIcon} style={{tintColor: "white", width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={cycleIcon} style={{tintColor: "white", width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={healthIcon} style={{tintColor: "white", width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={beaconIcon} style={{tintColor: "white", width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={musicIcon} style={{tintColor: "white", width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
      </View>

      {/* Start Button */}
      <View style={styles.stateButtonContainer}>
        {(isTracking || journeyTimeElapsed > 0) ? 
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 15 }}>
            <TouchableOpacity style={styles.circleWhite} onPress={() => pauseJourney()}>
              <Text style={{ color: "black", fontWeight: "bold" }}>Pause</Text>
            </TouchableOpacity>
          
            <TouchableOpacity style={styles.circleOrange} onPress={() => finishJourney()}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Finish</Text>
            </TouchableOpacity>
          </View>
        :
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 15 }}>
            <TouchableOpacity style={styles.circleOrange} onPress={() => startJourney()}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Start</Text>
            </TouchableOpacity>          
          </View>
        }
        
      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },

  headerContainer: {
    backgroundColor: '#00a6ef',
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
    color: "white",
  },
  
  map: {
    width: "100%",
    height: "75%",
  },

  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#00a6ef',
    height: "5%",

  },

  stateButtonContainer: {
    backgroundColor: '#00a6ef',
    height: "15%",
  },

    circleOrange: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "orange",
      justifyContent: "center",
      alignItems: "center",
    },

    circleWhite: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      
    },




    activityInfoContainer: {
      position: "absolute",
      width: "100%",
      bottom: "20%",
      backgroundColor: "#00a6ef",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 15,
    },
  
    activityInfoContainer_div1: {
      width: "100%",
      alignItems: "center",
      marginBottom: 10, // Adds spacing between div1 and div2/3
    },
  
    rowContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
    },
  
    activityInfoContainer_div2: {
      width: "50%",
      alignItems: "center",
    },
  
    activityInfoContainer_div3: {
      width: "50%",
      alignItems: "center",
    },
  
    activityInfoText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "white",
    },
  
    activityValue: {
      fontSize: 18,
      color: "black",
    },
});


export default record