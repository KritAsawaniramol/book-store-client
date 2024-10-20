import { createContext, useContext, useState } from 'react'
import { getCountItemInCart } from './cart';
import PropTypes from 'prop-types';


const CartContext = createContext();

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) {
        throw new Error("useCart must be within CartContextProvider")
    }
    return ctx
}


function CartContextProvider({ children }) {
    const [countItemInCart, setCountItemInCart] = useState(getCountItemInCart())
  return (
    <CartContext.Provider value={{countItemInCart, setCountItemInCart}}>
        {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider

CartContextProvider.propTypes = {
    children: PropTypes.element
}