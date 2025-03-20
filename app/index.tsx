import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View , Text, Button } from 'react-native';
import { useLocation } from '@/hooks/useLocation';

export default function App() {
  const { latitude, longitude, errorMsg, getUserLocation } = useLocation();


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Location Info</Text>

      {errorMsg ? (
        <Text style={{ color: "red" }}>{errorMsg}</Text>
      ) : (
        <>
          <Text>Latitude: {latitude ?? "Fetching..."}</Text>
          <Text>Longitude: {longitude ?? "Fetching..."}</Text>
        </>
      )}

      <Button title="Refresh Location" onPress={getUserLocation} />
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
