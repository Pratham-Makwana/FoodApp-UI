import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useStyles} from 'react-native-unistyles';
import {homeStyles} from '@unistyles/homeStyles';
import {useSharedState} from '@features/tabs/SharedContext';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import Icon from '@components/global/Icon';
import {Colors} from '@unistyles/Constants';
import RollingContent from 'react-native-rolling-bar';
import CustomText from '@components/global/CustomText';
import {useAppDispatch, useAppSelector} from '@states/reduxHook';
import {setVegMode} from '@states/reducer/userSlice';

const searchItem: string[] = [
  'Search "chai samosa"',
  'Search "chai samosa"',
  'Search "chai samosa"',
  'Search "chai samosa"',
  'Search "chai samosa"',
];

const SearchBar = () => {
  const isVegMode = useAppSelector(state => state.user.isVegMode);
  const dispacth = useAppDispatch();
  const {styles} = useStyles(homeStyles);
  const {scrollYGlobal} = useSharedState();
  const textColorAnimation = useAnimatedStyle(() => {
    const textColor = interpolate(scrollYGlobal.value, [0, 80], [255, 0]);
    return {
      color: `rgb(${textColor},${textColor},${textColor})`,
    };
  });

  return (
    <>
      <SafeAreaView />
      <View style={[styles.flexRowBetween, styles.padding]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.searchInputContainer}>
          <Icon
            iconFamily="Ionicons"
            name="search"
            size={20}
            color={isVegMode ? Colors.active : Colors.primary}
          />

          <RollingContent
            interval={3000}
            defaultStyle={false}
            customStyle={styles.textContainer}>
            {searchItem.map((item, index) => {
              return (
                <CustomText
                  fontSize={12}
                  fontFamily="Okra-Medium"
                  key={index}
                  style={styles.rollingText}>
                  {item}
                </CustomText>
              );
            })}
          </RollingContent>

          <Icon
            name="mic-outline"
            color={isVegMode ? Colors.active : Colors.primary}
            size={20}
            iconFamily="Ionicons"
          />
        </TouchableOpacity>

        <Pressable
          style={styles.vegMode}
          onPress={() => dispacth(setVegMode(!isVegMode))}>
          <Animated.Text style={[textColorAnimation, styles.animatedText]}>
            VEG
          </Animated.Text>
          <Animated.Text style={[textColorAnimation, styles.animatedSubText]}>
            MODE
          </Animated.Text>
          <Image
            source={
              isVegMode
                ? require('@assets/icons/switch_on.png')
                : require('@assets/icons/switch_off.png')
            }
            style={styles.switch}
          />
        </Pressable>
      </View>
    </>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
