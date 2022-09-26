import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};
const CartReducer = (state, action) => {
  if (action.type === "ADD") {
    let updatedItems;
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    if (existingCartItem) {
      let updatedItem = {
        ...existingCartItem,
        amount: action.item.amount + existingCartItem.amount,
      };

      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }
    const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  if (action.type === "REMOVE") {
    const existingCartItemIndex = state.items.findIndex((item) => {
      return item.id === action.id;
    });
    const existingCartItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingCartItem.price;
    let updatedItems;
    if(existingCartItem.amount === 1){
      updatedItems = state.items.filter(item => item.id !== action.id)
    }else{
      const updatedItem = {...existingCartItem, amount: existingCartItem.amount -1};
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem
    }
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount
    }
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartState] = useReducer(
    CartReducer,
    defaultCartState
  );

  const AddItemIntoCart = (item) => {
    dispatchCartState({ type: "ADD", item: item });
  };
  const RemoveItemFromCart = (id) => {
    dispatchCartState({ type: "REMOVE", id: id });
  };
  const CartContextValue = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: AddItemIntoCart,
    removeItem: RemoveItemFromCart,
  };
  return (
    <CartContext.Provider value={CartContextValue}>
      {props.children}
    </CartContext.Provider>
  );
};
export default CartProvider;
