import React from 'react';
import { StyleSheet, View , Text, Button, ScrollView, Image, FlatList, } from 'react-native';
const mapExample = require('../../assets/mapExample.png');

interface LocationCoords {
  latitude: number;
  longitude: number;
}


export default function App() {

  return (
    <View style={{ flex: 1}}>
      
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.textContainer}></Text>
        </View>

        <View>
          <Text style={styles.textContainer}>Home</Text>
        </View>

        <View>
          <Text style={styles.textContainer}></Text>
        </View>
      </View>


      <ScrollView style={styles.scrollViewContainer}>

        <View style={styles.weeklyContainer}>
          <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
            <Text style={styles.weeklyContainer_textHeader}>Your Weekly Snapshot</Text>
          </View>

          <View style={styles.activityInfoContainer}>
            <View style={{flexDirection: "column", minWidth: 100}}>
              <Text style={styles.activityInfoText}>Activities</Text>
              <Text style={styles.activityValue}>5</Text>
            </View>

            <View style={{flexDirection: "column", minWidth: 100}}>
              <Text style={styles.activityInfoText}>Time</Text>
              <Text style={styles.activityValue}>3h 42m</Text>
            </View>
            
            <View style={{flexDirection: "column", minWidth: 100}}>
              <Text style={styles.activityInfoText}>Distance</Text>
              <Text style={styles.activityValue}>61.01 km</Text>
            </View>
          </View>
        </View>

        <View style={styles.activityContainer}>
          {/* Activity Header */}
          <View style={styles.activityHeaderContainer}>
            <Text style={styles.activityHeaderText}>Today at 9:17am</Text>
          </View>

          {/* Activity Title */}
          <Text style={styles.activityTitle}>Morning Ride</Text>

          {/* Activity Stats */}
          <View style={styles.activityInfoContainer}>
            <View style={styles.activityInfoContainer_div1}>
              <Text style={styles.activityInfoText}>Distance</Text>
              <Text style={styles.activityValue}>11.64 km</Text>
            </View>

            <View style={styles.activityInfoContainer_div2}>
              <Text style={styles.activityInfoText}>Elev Gain</Text>
              <Text style={styles.activityValue}>11.64 km</Text>
            </View>
            
            <View style={styles.activityInfoContainer_div3}>
              <Text style={styles.activityInfoText}>Time</Text>
              <Text style={styles.activityValue}>42m 10s</Text>
            </View>
          </View>

          {/* Activity map */}
          <View style={styles.activityMapContainer}>
            <Image source={mapExample} style={styles.mapImage} />
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

    /////////////////////////////////////////////////////////////////////////////////////

    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 15,
      paddingVertical: 5,
      
      backgroundColor: '#00a6ef',
    },

    textContainer: {
      alignSelf: "flex-start", 
      fontSize: 18,
      fontWeight: "bold",
      color: 'white',
    },

    /////////////////////////////////////////////////////////////////////////////////////

    scrollViewContainer: {
      
    },

      weeklyContainer: {
        backgroundColor: "#fff",
        marginTop: 3,
      },

      weeklyContainer_textHeader: {
        fontSize: 14,
        fontWeight: "bold",
      },

      activityContainer: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 10,
        marginBottom: 10,
        
      },
        activityHeaderContainer: {
          marginTop: 5,
          marginBottom: 5,
          paddingHorizontal: 15,
        },
          activityHeaderText: { 
            fontSize: 11,
            fontWeight: "bold",
            color: 'grey',
          },

        activityTitle: {
          fontSize: 16,
          fontWeight: "bold",
          color: "#222",
          marginBottom: 8,
          paddingHorizontal: 15,
        },

        activityInfoContainer: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          paddingHorizontal: 15,
        },

          activityInfoContainer_div1: {
            flexDirection: "column",
            paddingRight: 20,
          },

          activityInfoContainer_div2: {
            flexDirection: "column",
            paddingRight: 20,
          },

          activityInfoContainer_div3: {
            flexDirection: "column",
            flexGrow: 1, // Takes up the remaining space
            textAlign: "center",
          },

            activityInfoText: {
              fontSize: 12,
              color: 'grey',
            },

            activityValue: {
              fontSize: 18,
              color: 'black',
            },


        activityMapContainer: {
          width: "100%",
          height: 220,
          paddingBottom: 40,
        },

          mapImage: {
            width: "100%",
            height: "100%",
          },





  

});
