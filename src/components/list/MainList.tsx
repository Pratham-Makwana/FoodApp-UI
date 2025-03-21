import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import React, {FC, useRef, useState} from 'react';
import ExploreList from './ExploreList';
import RestaurantsList from './RestaurantsList';
import {useStyles} from 'react-native-unistyles';
import {restaurantStyles} from '@unistyles/restuarantStyles';
import {useSharedState} from '@features/tabs/SharedContext';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import BackToTopButton from '@components/ui/BackToTopButton';
import {filtersOption} from '@utils/dummyData';
import SortingAndFilters from '@components/home/SortingAndFilters';

const sectionedData = [
  {title: 'Explore', data: [{}], renderItem: () => <ExploreList />},
  {title: 'Restaurants', data: [{}], renderItem: () => <RestaurantsList />},
];
const MainList: FC = () => {
  const {styles} = useStyles(restaurantStyles);
  const {scrollY, scrollToTop, scrollYGlobal} = useSharedState();
  const perviousScrollYTopButton = useRef<number>(0);
  const prevScrollY = useRef(0);
  const sectionListRef = useRef<SectionList>(null);
  // console.log(scrollYGlobal.value);

  const [isRestaurantVisible, setIsRestaurantVisible] = useState(false);
  const [isNearEnd, setIsNearEnd] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currenScollY = event?.nativeEvent?.contentOffset?.y;
    const isScrollingDown = currenScollY > prevScrollY?.current;

    scrollY.value = isScrollingDown
      ? withTiming(1, {duration: 300})
      : withTiming(0, {duration: 300});

    scrollYGlobal.value = currenScollY;
    prevScrollY.current = currenScollY;

    const containerHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event?.nativeEvent?.layoutMeasurement?.height;
    const offset = event?.nativeEvent?.contentOffset?.y;

    setIsNearEnd(offset + layoutHeight >= containerHeight - 500);
  };

  const handleScrollToTop = async () => {
    scrollToTop();
    sectionListRef.current?.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      animated: true,
      viewPosition: 0,
    });
  };

  const backToTopStyle = useAnimatedStyle(() => {
    const isScrollingUp =
      scrollYGlobal?.value < perviousScrollYTopButton.current &&
      scrollYGlobal.value > 180;

    const opacity = withTiming(
      isScrollingUp && (isRestaurantVisible || isNearEnd) ? 1 : 0,
    );
    const translateY = withTiming(
      isScrollingUp && (isRestaurantVisible || isNearEnd) ? 0 : 10,
    );

    perviousScrollYTopButton.current = scrollYGlobal.value;

    return {
      opacity,
      transform: [{translateY}],
    };
  });

  const viewablilityConfig = {
    viewAreaCoveragePercentThreshold: 80,
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) => {
    const restaurantVisible = viewableItems.some(
      item => item?.section?.title === 'Restaurants' && item?.isViewable,
    );
    setIsRestaurantVisible(restaurantVisible);
  };

  return (
    <>
      <Animated.View style={[styles.backToTopButton, backToTopStyle]}>
        <BackToTopButton onPress={handleScrollToTop} />
      </Animated.View>
      <SectionList
        sections={sectionedData}
        overScrollMode="always"
        onScroll={handleScroll}
        ref={sectionListRef}
        scrollEventThrottle={16}
        bounces={false}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        keyExtractor={({item, index}) => index}
        contentContainerStyle={styles.listContainer}
        stickySectionHeadersEnabled={true}
        viewabilityConfig={viewablilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        renderSectionHeader={({section}) => {
          if (section.title !== 'Restaurants') {
            return null;
          }
          return (
            <Animated.View
              style={[
                isRestaurantVisible || isNearEnd ? styles.shadowBottom : null,
              ]}>
              <SortingAndFilters menuTitle="Sort" options={filtersOption} />
            </Animated.View>
          );
        }}
      />
    </>
  );
};

export default MainList;

const styles = StyleSheet.create({});
