import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {FC, useEffect} from 'react';
import {useAppSelector} from '@states/reduxHook';
import {selectRestaurantCartItem} from '@states/reducer/cardSice';
import {useStyles} from 'react-native-unistyles';
import {modelStyles} from '@unistyles/modelStyles';
import CustomText from '@components/global/CustomText';
import {Colors} from '@unistyles/Constants';
import MiniFoodCard from '@components/restaurant/MiniFoodCard';

const RepeatItemModal: FC<{
  item: any;
  restaurant: any;
  onOpenAddModal: () => void;
  closeModal: () => void;
}> = ({closeModal, item, onOpenAddModal, restaurant}) => {
  const cartItem = useAppSelector(
    selectRestaurantCartItem(restaurant?.id, item?.id),
  );
  console.log("==> cartItem",cartItem);
  
  const {styles} = useStyles(modelStyles);

  useEffect(() => {
    if (!cartItem) {
      closeModal();
    }
  }, [cartItem]);

  return (
    <View>
      <View style={styles.noShadowHeaderContainer}>
        <View style={styles.flexRowGap}>
          <CustomText fontFamily="Okra-Bold" fontSize={13}>
            Reapeat last used customuzation
          </CustomText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainerWhiteBackground}>
        {cartItem?.customizations?.map((cus, index) => {
          return (
            <MiniFoodCard
              item={item}
              cus={cus}
              key={index}
              restaurant={restaurant}
            />
          );
        })}
      </ScrollView>

      <View style={styles.noShadowFooterContainer}>
        <TouchableOpacity onPress={onOpenAddModal}>
          <CustomText
            fontFamily="Okra-Bold"
            color={Colors.active}
            fontSize={11}>
            + Add new customisation
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RepeatItemModal;
