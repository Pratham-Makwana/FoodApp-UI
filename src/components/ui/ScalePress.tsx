import {ViewStyle, Animated, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';

interface ScalePressProps {
  onPress?: () => void;
  onLongPrss?: () => void;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}
const ScalePress: FC<ScalePressProps> = ({
  children,
  style,
  onLongPrss,
  onPress,
}) => {
  const scaleValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressOut={onPressOut}
      onLongPress={onLongPrss}
      onPressIn={onPressIn}
      activeOpacity={1}
      style={{...style}}>
      <Animated.View style={{transform: [{scale: scaleValue}], width: '100%'}}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ScalePress;
