import RecordBeforeTrackingUI from '@/UI/recordBeforeTrackingUI';
import RecordCurrentTrackingUI from '@/UI/recordCurrentTrackingUI';

import React, {useRef, useState, useEffect,} from 'react';
import { useRouter } from 'expo-router';


import useForegroundTracking from '../../hooks/useForegroundTracking'
import useBackgroundTracking from '../../hooks/useBackgroundTracking'

import * as Location from "expo-location";

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

  const [isTracking, setIsTracking] = useState(false);
  const [journeyTimeElapsed, setTimeElapsed] = useState(0);
  const [journeySpeed, setSpeed] = useState(0);
  const [journeyDistance, setDistance] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<LocationCoords[]>([]);
  
  

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
    return R * c; // Distance in meters
  };


  //Hooks
  const { startForegroundTracking} = useForegroundTracking(isTracking, haversineDistance, setLocation, setSpeed, setRouteCoordinates);
  const { startBackgroundTracking} = useBackgroundTracking(isTracking, haversineDistance , setLocation, setSpeed, setRouteCoordinates);
  
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
      {isTracking ? 
        <RecordCurrentTrackingUI /> 
      : 
        <RecordBeforeTrackingUI 
          router={router} 
          currentLocation={currentLocation} 
          routeCoordinates={routeCoordinates} 
          setIsTracking={setIsTracking} 
        />
    
      }
    </View>
  )
}



export default record