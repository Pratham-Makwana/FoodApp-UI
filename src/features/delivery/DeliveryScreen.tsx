import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStyles} from 'react-native-unistyles';
import {homeStyles} from '@unistyles/homeStyles';
import {useSharedState} from '@features/tabs/SharedContext';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Graphics from '@components/home/Graphics';
import HeaderSection from '@components/home/HeaderSection';
import MainList from '@components/list/MainList';

const DeliveryScreen = () => {
  const inset = useSafeAreaInsets();
  const {styles} = useStyles(homeStyles);
  const {scrollYGlobal} = useSharedState();

  const backgroudColorChange = useAnimatedStyle(() => {
    const opacity = interpolate(scrollYGlobal.value, [1, 50], [0, 1]);
    return {
      backgroundColor: `rgba(255,255,255,${opacity})`,
    };
  });

  const moveUpStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollYGlobal.value,
      [0, 50],
      [0, -50],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{translateY: translateY}],
    };
  });

  const moveUpStyleNotExtrapolation = useAnimatedStyle(() => {
    const translateY = interpolate(scrollYGlobal.value, [0, 50], [0, -50]);
    return {
      transform: [{translateY: translateY}],
    };
  });

  return (
    <View style={styles.container}>
      <View style={{height: Platform.OS === 'android' ? inset.top : 0}} />
      <Animated.View style={moveUpStyle}>
        {/* Lottie Animation */}
        <Animated.View style={moveUpStyleNotExtrapolation}>
          <Graphics />
        </Animated.View>

        <Animated.View style={[backgroudColorChange, styles.topHeader]}>
          <HeaderSection />
        </Animated.View>
      </Animated.View>

      <Animated.View style={moveUpStyle}>
        <MainList />
      </Animated.View>
    </View>
  );
};

export default DeliveryScreen;

const styles = StyleSheet.create({});
