import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {v4 as uuid} from 'uuid';

interface CardItem {
  isVeg: boolean;
  id: string;
  name: string;
  price: number;
  quantity: number;
  cartPrice?: number;
  isCustomizable?: boolean;
  customizations?: any[];
}

interface RestaurantDetails {
  id: string;
  name: string;
  discount: string;
  discountAmount: string;
  time: string;
  distance: string;
  rating: number;
  imageUrl: string;
}

interface RestaurantCart {
  restaurant: RestaurantDetails;
  items: CardItem[];
}

interface CartState {
  carts: RestaurantCart[];
}

const initialState: CartState = {
  carts: [],
};

export const cardSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (
      state,
      action: PayloadAction<{restaurant: RestaurantDetails; item: CardItem}>,
    ) => {
      const {item, restaurant} = action.payload;
      //   console.log(item, restaurant);

      //   checking if existing Restaurant in the cart or not
      const existingRestaurantCart = state.carts.find(
        cart => cart?.restaurant?.id === restaurant?.id,
      );
      //   if restaurant exist
      if (existingRestaurantCart) {
        // checking if the item that added is existing in that restaurant or not
        const existingItem = existingRestaurantCart?.items?.find(
          cartItem => cartItem?.id === item?.id,
        );
        if (existingItem) {
          existingItem.quantity += 1;
          existingItem.cartPrice =
            (existingItem.cartPrice || 0) + existingItem?.price;
        } else {
          // if item is not found in restaurant than added to that restaurant
          existingRestaurantCart.items.push({
            ...item,
            quantity: 1,
            cartPrice: item?.cartPrice,
          });
        }
      } else {
        // if not add restaurant and card item
        state.carts.push({
          restaurant,
          items: [{...item, quantity: 1, cartPrice: item?.price}],
        });
      }
    },
    removeItemFromCart: (
      state,
      action: PayloadAction<{restaurant_id: string; itemId: string}>,
    ) => {
      const {restaurant_id, itemId} = action?.payload;
      const restaurantCart = state?.carts?.find(
        cart => cart?.restaurant?.id === restaurant_id,
      );
      if (!restaurantCart) return;
      console.log(restaurantCart);

      const itemIndex = restaurantCart?.items?.findIndex(
        item => item?.id == itemId,
      );

      if (itemIndex !== -1) {
        const item = restaurantCart?.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
          item.cartPrice = (item.cartPrice || 0) - item?.price;
        } else {
          restaurantCart.items.splice(itemIndex, 1);
        }
      }

      if (restaurantCart.items.length === 0) {
        state.carts = state.carts.filter(
          cart => cart.restaurant?.id !== restaurant_id,
        );
      }
    },

    addCustomizableitem: (
      state,
      action: PayloadAction<{
        restaurant: RestaurantDetails;
        item: CardItem;
        customization: {
          quantity: number;
          price: number;
          customizationOptions: any[];
        };
      }>,
    ) => {},

    removeCustomizableItem: (
      state,
      acton: PayloadAction<{
        restaurant_id: string;
        itemId: string;
        customizationId: string;
      }>,
    ) => {},

    updateCustomizableItem: (
      state,
      action: PayloadAction<{
        restaurant_id: string;
        itemId: string;
        customizationId: string;
        newCustomization: {
          quantity: number;
          price: number;
          customizationOptions: any[];
        };
      }>,
    ) => {},

    clearAllCarts: state => {
      state.carts = [];
    },
    clearRestaurantCart: (
      state,
      action: PayloadAction<{restaurant_id: string}>,
    ) => {
      const {restaurant_id} = action.payload;
      state.carts = state.carts.filter(
        cart => cart?.restaurant?.id !== restaurant_id,
      );
    },
  },
});

export const {
  addItemToCart,
  clearAllCarts,
  clearRestaurantCart,
  removeItemFromCart,
  addCustomizableitem,
  removeCustomizableItem,
  updateCustomizableItem,
} = cardSlice.actions;

export const selectCart = (state: RootState) => state.cart;

export const selectRestaurantCart = (restaurantId: string) =>
  createSelector(
    (state: RootState) =>
      state.cart.carts.find(cart => cart.restaurant.id === restaurantId),
    restaurantCard => (restaurantCard ? [...restaurantCard.items] : []),
  );

export const selectRestaurantCartItem = (
  restaurantId: string,
  itemId: string,
) =>
  createSelector(
    (state: RootState) =>
      state.cart.carts.find(cart => cart.restaurant.id === restaurantId)?.items,
    items => items?.find(item => item?.id === itemId) || null,
  );
export default cardSlice.reducer;
