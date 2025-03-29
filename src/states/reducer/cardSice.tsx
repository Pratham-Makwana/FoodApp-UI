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
    ) => {
      console.log('==> action', action.payload);
      console.log('==> state', state.carts);
      const {restaurant, item, customization} = action.payload;

      const existingRestaurantCart = state.carts.find(
        cart => cart.restaurant.id === restaurant.id,
      );

      console.log('==> existingRestaurantCart ', existingRestaurantCart);

      // Existing Restaurant
      if (existingRestaurantCart) {
        // Existing Cart Item
        const existingItem = existingRestaurantCart?.items?.find(
          cartItem => cartItem?.id === item?.id,
        ) as any;
        console.log('==> existingItem ', existingItem);

        // Item Exist so increase quantitty
        if (existingItem) {
          const existingCustomizationIndex =
            existingItem?.customizations?.findIndex(
              (cust: any) =>
                JSON.stringify(cust.customizationOptions) ===
                JSON.stringify(customization.customizationOptions),
            );
          console.log(
            '==> existingCustomizationIndex',
            existingCustomizationIndex,
          );
          // existingCustomizationIndex if exist
          if (
            existingCustomizationIndex !== undefined &&
            existingCustomizationIndex !== -1
          ) {
            // console.log("==> existingItem",existingItem);
            const existingCustomization =
              existingItem?.customizations[existingCustomizationIndex];
            // console.log('==> existingCustomization', existingCustomization);

            existingCustomization.quantity += customization?.quantity;
            existingCustomization.cartPrice += customization?.price;
          } else {
            const newCustomizationId = uuid();
            existingItem?.customizations?.push({
              id: newCustomizationId,
              ...customization,
              quantity: customization?.quantity,
              cartPrice: customization?.price,
              price: customization?.price / customization?.quantity,
            });
          }
          existingItem.quantity += customization?.quantity;
          existingItem.cartPrice =
            (existingItem?.cartPrice || 0) + customization?.price;
        } else {
          // Push Item in the cart
          const newCustomizationId = `c1`;
          existingRestaurantCart.items.push({
            ...item,
            quantity: customization.quantity,
            cartPrice: customization.price,
            customizations: [
              {
                id: newCustomizationId,
                ...customization,
                quantity: customization.quantity,
                cartPrice: customization.price,
                price: customization.price / customization.quantity,
              },
            ],
          });
        }
      } else { 
        // Not a Existing Restaurant
        const newCustomizationId = `c1`;
        state.carts.push({
          restaurant,
          items: [
            {
              ...item,
              quantity: customization.quantity,
              cartPrice: customization?.price,
              customizations: [
                {
                  id: newCustomizationId,
                  ...customization,
                  quantity: customization?.quantity,
                  cartPrice: customization.price,
                  price: customization.price / customization.quantity,
                },
              ],
            },
          ],
        });
      }
    },

    removeCustomizableItem: (
      state,
      acton: PayloadAction<{
        restaurant_id: string;
        itemId: string;
        customizationId: string;
      }>,
    ) => {
      const {restaurant_id, itemId, customizationId} = acton.payload;
      // check is restaurant Exist
      const restaurantCart = state?.carts?.find(
        cart => cart?.restaurant?.id === restaurant_id,
      );
      // console.log("==> restaurantCart ", restaurantCart);

      // if not return
      if (!restaurantCart) return;

      // check for that restaurant item exist
      const item = restaurantCart?.items?.find(
        cartItem => cartItem?.id === itemId,
      );

      // console.log("==> item", item);

      // if not return
      if (!item) return;

      // Find The Customization Index For That Item
      const customizationIndex = item?.customizations?.findIndex(
        cust => cust?.id === customizationId,
      ) as number;
      // console.log("==> customizationIndex",customizationIndex);
      // console.log("==>item?.customizations", item?.customizations);

      // If Exist
      if (customizationIndex !== -1 && item?.customizations) {
        const customization = item.customizations[customizationIndex];
        // console.log('==> customization', customization);

        // check the customization quantity
        // according to that decrease quantity and cartPrice
        if (customization?.quantity > 1) {
          customization.quantity -= 1;
          customization.cartPrice -= customization?.price;
        } else {
          // if customization quantity is 1 then remove that particular customization
          item?.customizations?.splice(customizationIndex, 1);
        }

        item.quantity -= 1;
        item.cartPrice = (item?.cartPrice || 0) - customization?.price;

        // if item not have quantity and customization remove the item
        console.log(item?.quantity, item?.customizations?.length === 0);

        if (item?.quantity === 0 || item?.customizations?.length === 0) {
          restaurantCart.items = restaurantCart?.items?.filter(
            cartItem => cartItem.id !== itemId,
          );
        }

        // if item is not exist for particular restaurant remove that restaurant
        if (restaurantCart?.items?.length === 0) {
          state.carts = state.carts.filter(
            cart => cart?.restaurant?.id !== restaurant_id,
          );
        }
      }
    },

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
    ) => {
      const {restaurant_id, itemId, customizationId, newCustomization} =
        action.payload;

      const restaurantCart = state.carts.find(
        cart => cart.restaurant.id === restaurant_id,
      );
      if (!restaurantCart) return;

      const item = restaurantCart.items.find(
        cartItem => cartItem.id === itemId,
      );
      if (!item || !item.customizations) return;

      const matchingCustomizationIndex = item?.customizations?.findIndex(
        (cust: any) =>
          cust?.id !== customizationId &&
          JSON.stringify(cust.customizationOptions) ===
            JSON.stringify(newCustomization.customizationOptions),
      );

      const tragetCustomizationIndex = item?.customizations?.findIndex(
        cust => cust.id === customizationId,
      );

      if (tragetCustomizationIndex === -1) return;

      const tragetCustomization =
        item?.customizations[tragetCustomizationIndex];

      if (matchingCustomizationIndex !== -1) {
        const matchingCustomization =
          item.customizations[tragetCustomizationIndex];

        matchingCustomization.quantity += newCustomization?.quantity;
        matchingCustomization.cartPrice += newCustomization.price;

        item?.customizations?.splice(tragetCustomizationIndex, 1);
      } else {
        tragetCustomization.quantity = newCustomization.quantity;
        tragetCustomization.cartPrice = newCustomization.price;
        tragetCustomization.price =
          newCustomization.price / newCustomization.quantity;
        tragetCustomization.customizationOptions =
          newCustomization.customizationOptions;
      }

      item.quantity = item.customizations?.reduce(
        (sum, cust) => sum + cust.quantity,
        0,
      );
      item.cartPrice = item.customizations?.reduce(
        (sum, cust) => sum + cust.cartPrice,
        0,
      );
    },

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
