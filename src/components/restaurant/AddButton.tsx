import {TouchableOpacity, View} from 'react-native';
import React, {FC, memo, useCallback, useRef} from 'react';
import {useStyles} from 'react-native-unistyles';
import {foodStyles} from '@unistyles/foodStyles';
import CustomText from '@components/global/CustomText';
import {Colors} from '@unistyles/Constants';
import AnimatedNumbers from 'react-native-animated-numbers';
import ScalePress from '@components/ui/ScalePress';
import Icon from '@components/global/Icon';
import {RFValue} from 'react-native-responsive-fontsize';
import {useAppDispatch, useAppSelector} from '@states/reduxHook';
import {
  addItemToCart,
  removeCustomizableItem,
  removeItemFromCart,
  selectRestaurantCartItem,
} from '@states/reducer/cardSice';
import CustomModal from '@components/modal/CustomModal';
import AddItemModal from '@components/modal/AddItemModal';
import RepeatItemModal from '@components/modal/RepeatItemModal';
import RemoveItemModal from '@components/modal/RemoveItemModal';

const AddButton: FC<{item: any; restaurant: any}> = ({item, restaurant}) => {
  const dispatch = useAppDispatch();
  const {styles} = useStyles(foodStyles);
  const card = useAppSelector(
    selectRestaurantCartItem(restaurant?.id, item?.id),
  );

  const modalRef = useRef<any>(null);

  const openModal = () => {
    modalRef?.current?.openModal(
      <AddItemModal
        item={item}
        onClose={() => modalRef?.current?.closeModal()}
        restaurant={restaurant}
      />,
    );
  };
  const openRepeatModal = () => {
    modalRef.current?.openModal(
      <RepeatItemModal
        item={item}
        onOpenAddModal={openModal}
        onClose={() => modalRef?.current?.closeModal()}
        restaurant={restaurant}
      />,
    );
  };

  const openRemoveModal = () => {
    modalRef.current?.openModal(
      <RemoveItemModal
        item={item}
        onClose={() => modalRef?.current?.closeModal()}
        restaurant={restaurant}
      />,
    );
  };

  const addCartHandler = useCallback(() => {
    if (item?.isCustomizable) {
      if (card != null) {
        openRepeatModal();
        return;
      }
      openModal();
    } else {
      dispatch(
        addItemToCart({
          restaurant: restaurant,
          item: {...item, customisation: []},
        }),
      );
    }
  }, [dispatch, item, restaurant, card]);

  const removeCardHandler = useCallback(() => {
    if (item?.isCustomizable) {
      if (card?.customizations && card?.customizations?.length > 1) {
        openRemoveModal();
        return;
      }

      dispatch(
        removeCustomizableItem({
          restaurant_id: restaurant?.id,
          customizationId: card?.customizations![0]?.id,
          itemId: item?.id,
        }),
      );
    } else {
      dispatch(
        removeItemFromCart({restaurant_id: restaurant?.id, itemId: item?.id}),
      );
    }
  }, [dispatch, item, restaurant, card]);
  return (
    <>
      <CustomModal ref={modalRef} />
      <View style={styles.addButtonContainer(card !== null)}>
        {card ? (
          <View style={styles.selectedContainer}>
            <ScalePress onPress={removeCardHandler}>
              <Icon
                iconFamily="MaterialCommunityIcons"
                color="#fff"
                name="minus-thick"
                size={RFValue(13)}
              />
            </ScalePress>
            <AnimatedNumbers
              includeComma={false}
              animationDuration={300}
              animateToNumber={card?.quantity}
              fontStyle={styles.animatedCount}
            />
            <ScalePress onPress={addCartHandler}>
              <Icon
                iconFamily="MaterialCommunityIcons"
                color="#fff"
                name="plus-thick"
                size={RFValue(13)}
              />
            </ScalePress>
          </View>
        ) : (
          <TouchableOpacity
            onPress={addCartHandler}
            style={styles.noSelectionContainer}
            activeOpacity={0.6}
            accessibilityLabel="Add item to cart">
            <CustomText
              variant="h5"
              fontFamily="Okra-Bold"
              color={Colors.primary}>
              Add
            </CustomText>
            <CustomText
              variant="h5"
              color={Colors.primary}
              style={styles.plusSmallIcon}>
              +
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
      {item?.customizationOptions && (
        <CustomText fontFamily="Okra-Medium" style={styles.customizeText}>
          customisable
        </CustomText>
      )}
    </>
  );
};

export default memo(AddButton);
