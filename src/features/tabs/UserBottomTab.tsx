import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DeliveryScreen from '@features/delivery/DeliveryScreen';
import LiveScreen from '@features/live/LiveScreen';
import DiningScreen from '@features/dining/DiningScreen';
import ReorderScreen from '@features/reorder/ReorderScreen';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();
const UserBottomTab = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen name="Delivery" component={DeliveryScreen} />
      <Tab.Screen name="Reorder" component={ReorderScreen} />
      <Tab.Screen name="Dining" component={DiningScreen} />
      <Tab.Screen name="Live" component={LiveScreen} />
    </Tab.Navigator>
  );
};

export default UserBottomTab;

const styles = StyleSheet.create({});
