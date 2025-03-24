import React, {useRef, useState, useEffect} from 'react';
import { useRouter } from 'expo-router';
import useForegroundTracking from '../../hooks/useForegroundTracking'
import useBackgroundTracking from '../../hooks/useBackgroundTracking'

import MapView, { UrlTile, PROVIDER_DEFAULT, Polyline, PROVIDER_GOOGLE, Marker} from "react-native-maps";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const record: React.FC  = () => {
  const router = useRouter();

  const [currentLocation, setLocation] = useState<LocationCoords | null>(null);
                        
  const { startForegroundTracking} = useForegroundTracking(setLocation);
  const { startBackgroundTracking} = useBackgroundTracking(setLocation);

  useEffect(() => {
    startForegroundTracking()
  }, []);

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