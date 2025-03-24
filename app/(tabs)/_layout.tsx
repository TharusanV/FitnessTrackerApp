import { View, Text, Image } from 'react-native'
import React from 'react'

const homeIcon = require('../../assets/icons/homeIcon.png');
const mapIcon = require('../../assets/icons/mapIcon.png');
const recordIcon = require('../../assets/icons/recordIcon.png');
const leaderboardIcon = require('../../assets/icons/leaderboardIcon.png');
const youIcon = require('../../assets/icons/youIcon.png');

import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs 
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: route.name === 'record' ? 'none' : 'flex',
          backgroundColor: '#00a6ef',
        },
        
      })}
    >
      <Tabs.Screen 
        name='index'
        options={{
          title: 'Home', 
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <Image source={homeIcon} style={{ tintColor: focused ? 'white' : '#D3D3D3', width: 24, height: 24, resizeMode: 'contain' }} />

            </>
          )
        }}
      />
      <Tabs.Screen 
        name='maps'
        options={{
          title: 'Maps', 
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <Image source={mapIcon} style={{ tintColor: focused ? 'white' : '#D3D3D3', width: 24, height: 24, resizeMode: 'contain' }} />
            </>
          )
        }}
      />
      <Tabs.Screen 
        name='record'
        options={{
          title: 'Record', 
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <Image source={recordIcon} style={{ tintColor: focused ? 'white' : '#D3D3D3', width: 24, height: 24, resizeMode: 'contain' }} />
            </>
          )
        }}
      />
      <Tabs.Screen 
        name='leaderboard'
        options={{
          title: 'Leaderboard', 
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <Image source={leaderboardIcon} style={{ tintColor: focused ? 'white' : '#D3D3D3', width: 24, height: 24, resizeMode: 'contain' }} />
            </>
          )
        }}
      />
      <Tabs.Screen 
        name='user'
        options={{
          title: 'You', 
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <Image source={youIcon} style={{ tintColor: focused ? 'white' : '#D3D3D3', width: 24, height: 24, resizeMode: 'contain' }} />
            </>
          )
        }}
      />
    </Tabs>
  )
}

export default _layout