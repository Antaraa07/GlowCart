import React, {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  products: [],
  cart: [],
  loading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, loading: action.payload};
    
    case 'SET_ERROR':
      return {...state, error: action.payload, loading: false};
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    
    case 'SET_PRODUCTS':
      return {...state, products: action.payload, loading: false};
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? {...item, quantity: item.quantity + 1}
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, {...action.payload, quantity: 1}],
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? {...item, quantity: action.payload.quantity}
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {...state, cart: []};
    
    case 'LOGOUT':
      return {
        ...initialState,
        products: state.products,
      };
    
    default:
      return state;
  }
}

export function AppProvider({children}) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          dispatch({type: 'SET_USER', payload: JSON.parse(userData)});
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  // Actions
  const setLoading = (loading) => {
    dispatch({type: 'SET_LOADING', payload: loading});
  };

  const setError = (error) => {
    dispatch({type: 'SET_ERROR', payload: error});
  };

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      dispatch({type: 'SET_USER', payload: userData});
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      dispatch({type: 'LOGOUT'});
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const setProducts = (products) => {
    dispatch({type: 'SET_PRODUCTS', payload: products});
  };

  const addToCart = (product) => {
    dispatch({type: 'ADD_TO_CART', payload: product});
  };

  const removeFromCart = (productId) => {
    dispatch({type: 'REMOVE_FROM_CART', payload: productId});
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: {id: productId, quantity},
      });
    }
  };

  const clearCart = () => {
    dispatch({type: 'CLEAR_CART'});
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    state,
    setLoading,
    setError,
    login,
    logout,
    setProducts,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};