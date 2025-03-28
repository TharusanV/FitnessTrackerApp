import { View, TouchableOpacity, StyleSheet, Text, AppState, AppStateStatus, Image,  } from "react-native";
import React from 'react'
import MapView, { UrlTile, PROVIDER_DEFAULT, Polyline, PROVIDER_GOOGLE, Marker} from "react-native-maps";
import { Router } from 'expo-router';

const routeIcon = require('../../assets/icons/route.png');
const cycleIcon = require('../../assets/icons/bicycle.png');
const healthIcon = require('../../assets/icons/health.png');
const beaconIcon = require('../../assets/icons/beacon.png');
const musicIcon = require('../../assets/icons/music.png');

const settingsIcon = require('../../assets/icons/settings.png');

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface RecordProps {
  router: Router;
  currentLocation: LocationCoords | null;
  routeCoordinates: LocationCoords[];
  setIsTracking: (value: boolean) => void;
}

const RecordBeforeTrackingUI: React.FC<RecordProps> = ({ 
  router, 
  currentLocation, 
  routeCoordinates, 
  setIsTracking 
}) => {

  return (
    <View>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text  style={styles.textContainer}>Close</Text>
        </TouchableOpacity>
        
        <View>
          <Text style={styles.textContainer}>Ride</Text>
        </View>
    
        <TouchableOpacity>
          <Image source={settingsIcon} style={{width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
      </View>

      {/* MapView - Takes Remaining Space */}
      <MapView
        provider={PROVIDER_GOOGLE ?? PROVIDER_DEFAULT}
        style={{ flex: 1, width: "100%", height: "75%" }}
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
      <View style={styles.stateButtonContainer}>
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
    height: "10%",
  },

  stateButtonContainer: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: "#fff",
    height: "10%",
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

export default RecordBeforeTrackingUI