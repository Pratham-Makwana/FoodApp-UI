
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SharedStateProvider } from './SharedContext'
import UserBottomTab from './UserBottomTab'

const AnimatedTabs = () => {
  return (
  <SharedStateProvider>
    <UserBottomTab/>
  </SharedStateProvider>
  )
}

export default AnimatedTabs

const styles = StyleSheet.create({})