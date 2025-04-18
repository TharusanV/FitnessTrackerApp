import React, {useRef, useState, useEffect,} from 'react';
import { View, TouchableOpacity, StyleSheet, Text, AppState, AppStateStatus, Image, ScrollView,  } from "react-native";


const leaderboard = () => {

  const mockData = [
    { rank: 1, athlete: 'Alice Smith', time: '1:05:32', km: 12.4 },
    { rank: 2, athlete: 'John Doe', time: '1:12:10', km: 11.8 },
    { rank: 3, athlete: 'Emily Johnson', time: '1:18:45', km: 11.2 },
    { rank: 4, athlete: 'Michael Lee', time: '1:25:20', km: 10.6 },
    { rank: 5, athlete: 'Sarah Kim', time: '1:30:55', km: 10.2 },
  ];

  const [activeTime, setActiveTime] = useState<String>("Day");

  const timeButton = (timeFrame: String) => {
    setActiveTime(timeFrame);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.textContainer}>Leaderboard</Text>
      </View>

      <View style={styles.leaderboardTimeFrame_container}>
        {["Day", "Week", "Month", "Year", "Total"].map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeFrameButton,
              activeTime === time && styles.activeButton,
            ]}
            onPress={() => timeButton(time)}
          >
            <Text style={styles.buttonText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Rank</Text>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Athlete</Text>
        <Text style={styles.tableHeaderText}>Time</Text>
        <Text style={styles.tableHeaderText}>KM</Text>
      </View>


      <ScrollView style={styles.scrollContainer}>
        {mockData.map((item) => (
          <View key={item.rank} style={styles.row}>
            <Text style={styles.cell}>{item.rank}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.athlete}</Text>
            <Text style={styles.cell}>{item.time}</Text>
            <Text style={styles.cell}>{item.km.toFixed(1)}</Text>
          </View>
        ))}
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#00a6ef',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  textContainer: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  leaderboardTimeFrame_container: {
    backgroundColor: '#00a6ef',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timeFrameButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
  activeButton: {
    backgroundColor: "orange",
    borderColor: "orange",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: "#333",
  },
  scrollContainer: {
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  cell: {
    flex: 1,
    color: "#333",
  },
});

export default leaderboard