import {View, Text} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {useAppDispatch} from '@states/reduxHook';
import {useStyles} from 'react-native-unistyles';
import {modelStyles} from '@unistyles/modelStyles';

const AddItemModal: FC<{
  item: any;
  restaurant: any;
  onClose: () => void;
}> = ({item, onClose, restaurant}) => {
  const dispatch = useAppDispatch();
  const {} = useStyles(modelStyles);
  const [data, setData] = useState({
    quantity: 1,
    price: item?.price,
    selectedOption: {} as Record<string, number>,
  });

  useEffect(() => {
    const defaultSelectedOption: Record<string, number> = {};

    let initialPrice = item?.price || 0;

    item?.customizationOptions?.forEach((customization: any) => {
      if (customization?.required) {
        const defaultOptionIndex = customization?.options?.findIndex(
          (option: any) => option?.price === 0,
        );

        if (defaultOptionIndex !== -1) {
          defaultSelectedOption[customization.type] = defaultOptionIndex;
          initialPrice +=
            customization?.options[defaultOptionIndex]?.price || 0;
        }
        console.log(defaultSelectedOption);
      }
    });

    setData(prevData => ({
      ...prevData,
      selectedOption: defaultSelectedOption,
      price: initialPrice,
    }));
  }, [item]);
  console.log(data);

  const calculatePrice = (
    quantity: number,
    selectedOption: Record<string, number>,
  ) => {
    const basePrice = item?.price || 0;
    let customizationPrice = 0;
    Object.keys(selectedOption).forEach(type => {
      const optionIndex = selectedOption[type];
      const optionPrice =
        item?.customizationOption?.find((c: any) => c.type === type)?.options?.[
          optionIndex
        ]?.price || 0;
      customizationPrice += optionPrice;
    });
    return (basePrice + customizationPrice) * quantity;
  };

  return (
    <View>
      <Text>AddItemModal</Text>
    </View>
  );
};

export default AddItemModal;
