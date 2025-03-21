import React from 'react';
import { StyleSheet, View , Text, Button } from 'react-native';

import MapView, { UrlTile, PROVIDER_DEFAULT, Polyline, } from "react-native-maps";
import { useLocation } from '@/hooks/useLocation';

export default function App() {
  const { currentLatitude, currentLongitude, errorMsg, getUserLocation } = useLocation();

  const coordinatesHistory = [
    { latitude: 37.4221, longitude: -122.0841 }, 
    { latitude: 37.4235, longitude: -122.0865 },
    { latitude: 37.4250, longitude: -122.0830 }, 
    { latitude: 37.4240, longitude: -122.0810 }, 
    { latitude: 37.4221, longitude: -122.0841 }, 
];


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MapView
        provider={PROVIDER_DEFAULT} 
        style={styles.map}
        region={{
          latitude: currentLatitude ?? 0, 
          longitude: currentLongitude ?? 0,
          //Zoom values below - Lower values = More zoomed in (closer view).
          latitudeDelta: 0.03, 
          longitudeDelta: 0.03,
        }}
      >
        <Polyline
          coordinates={coordinatesHistory}
          strokeColor="red" 
          strokeWidth={4} 
        />
      </MapView>

      {/*<Button title="Refresh Location" onPress={getUserLocation} />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
