import React from 'react';
import { StyleSheet, View , Text, Button, ScrollView } from 'react-native';

export default function App() {

  return (
    <View style={{ flex: 1}}>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.weeklyContainer}>

        </View>

        <View style={styles.activityContainer}>
          <View style={styles.activityHeaderContainer}>
            <Text>ActivityType : Date : Time : LocationArea</Text>
          </View>

          <Text>MealTime Activity</Text>

          <View style={styles.activityInfoContainer}>
            <View>
              <Text>Distance</Text>
              <Text>11.64 km</Text>
            </View>
            <View>
              <Text>Time</Text>
              <Text>42m 10s</Text>
            </View>
          </View>

          <View style={styles.activityMapContainer}>

          </View>          
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollViewContainer: {

  },

  weeklyContainer: {

  },

  activityContainer: {

  },

  activityHeaderContainer: {

  },

  activityInfoContainer: {

  },

  activityMapContainer: {

  },
});
