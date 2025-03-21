import {
  View,
  Text,
  StatusBar,
  Platform,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStyles} from 'react-native-unistyles';
import {loginStyles} from '@unistyles/authStyles';
import CustomText from '@components/global/CustomText';
import BreakerText from '@components/ui/BreakerText';
import PhoneInput from '@components/ui/PhoneInput';
import {resetAndNavigate} from '@utils/NavigationUtils';
import SocialLogin from '@components/ui/SocialLogin';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';

const LoginScreen = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const keyboardOffSetHeight = useKeyboardOffsetHeight();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const {styles} = useStyles(loginStyles);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetAndNavigate('UserBottomTab');
    }, 2000);
  };
  // console.log(keyboardOffSetHeight);
  // console.log('==> ', -keyboardOffSetHeight * 0.25);

  useEffect(() => {
    if (keyboardOffSetHeight == 0) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      // when keyboard open move component to up by tranfromY
      Animated.timing(animatedValue, {
        toValue: -keyboardOffSetHeight * 0.25,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [keyboardOffSetHeight]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={Platform.OS !== 'ios'} />
      <Image
        source={require('@assets/images/login.png')}
        style={styles.cover}
      />

      <Animated.ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        style={{transform: [{translateY: animatedValue}]}}
        contentContainerStyle={styles.bottomContainer}>
        <CustomText style={styles.title} variant="h2" fontFamily="Okra-Bold">
          India's #1 Food Delivery and Dinig App
        </CustomText>

        <BreakerText text="log in or sign up" />
        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          onBlur={() => {}}
          onFocus={() => {}}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          disabled={loading}
          activeOpacity={0.8}
          onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomText color="#fff" fontFamily="Okra-Medium" variant="h5">
              {' '}
              Continue
            </CustomText>
          )}
        </TouchableOpacity>

        <BreakerText text="or" />

        <SocialLogin />
      </Animated.ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <CustomText>By Continuing, you agree to our</CustomText>
        <View style={styles.footerTextContainer}>
          <CustomText style={styles.footerText}>Term Of Service</CustomText>
          <CustomText style={styles.footerText}>Privacy Policy</CustomText>
          <CustomText style={styles.footerText}>Content Policies</CustomText>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
