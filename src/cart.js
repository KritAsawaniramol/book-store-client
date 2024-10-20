export const getCart = () =>  JSON.parse(localStorage.getItem('cart')) || [];

export const setCart = (cart) => {localStorage.setItem('cart', JSON.stringify(cart))}

export const addBookToCart = (bookID) => {
    const cart = getCart()
    cart.push(bookID)
    setCart(cart)
}

export const getCountItemInCart = () => {
    const cart = getCart()
    return cart.length
}

export const removeBookFromCart = (idx) => {
    const cart = getCart()
    cart.splice(idx, 1)
    setCart(cart)
}