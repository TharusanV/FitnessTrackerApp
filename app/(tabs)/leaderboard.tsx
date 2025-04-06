import React, {useRef, useState, useEffect,} from 'react';
import { View, TouchableOpacity, StyleSheet, Text, AppState, AppStateStatus, Image, ScrollView,  } from "react-native";


const leaderboard = () => {

  const timeButton = (timeFrame: String) => {

  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.textContainer}>Leaderboard</Text>
      </View>

      <View style={styles.leaderboardTimeFrame_container}>
        <TouchableOpacity style={styles.timeFrameButton} onPress={() => timeButton("Day")}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Day</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeFrameButton} onPress={() => timeButton("Week")}>
          <Text style={{  color: "white", fontWeight: "bold" }}>Week</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeFrameButton} onPress={() => timeButton("Month")}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeFrameButton} onPress={() => timeButton("Year")}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Year</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.timeFrameButton} onPress={() => timeButton("Total")}>
          <Text style={{  color: "white", fontWeight: "bold" }}>Total</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <Text style={{ marginLeft: "5%", width: "15%" }}>Rank</Text>
        <Text style={{ width: "45%" }}>Athlete</Text> 
        <Text style={{ width: "15%" }}>Time</Text>
        <Text style={{ marginRight: "5%", width: "15%" }}>KM</Text> 
      </View>


      <ScrollView>

      </ScrollView>

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
    justifyContent: 'center',
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
    height: "5%", 
  },

  textContainer: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },


  leaderboardTimeFrame_container: {
    backgroundColor: '#00a6ef',
    marginTop: "1%",
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    alignItems: 'center',
    height: "5%",
  },


  timeFrameButton: {
    
  },
  
  
});


export default leaderboard