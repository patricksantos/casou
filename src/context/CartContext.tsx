import { createContext, useContext, useState, type ReactNode } from 'react'
import { gifts } from '../data/gifts'

interface CartContextType {
  items: number[]
  addItem: (id: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  total: number
  count: number
  cartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType>(null!)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<number[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const addItem = (id: number) =>
    setItems((prev) => (prev.includes(id) ? prev : [...prev, id]))

  const removeItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i !== id))

  const clearCart = () => setItems([])

  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)

  const total = items.reduce((sum, id) => {
    const gift = gifts.find((g) => g.id === id)
    return sum + (gift?.price ?? 0)
  }, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count: items.length, cartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
