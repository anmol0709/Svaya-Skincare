import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'svaya_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const add = (sku, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.sku === sku)
      if (existing) return prev.map((i) => (i.sku === sku ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { sku, qty }]
    })
    setOpen(true)
  }
  const setQty = (sku, qty) => {
    if (qty <= 0) return remove(sku)
    setItems((prev) => prev.map((i) => (i.sku === sku ? { ...i, qty } : i)))
  }
  const remove = (sku) => setItems((prev) => prev.filter((i) => i.sku !== sku))
  const clear = () => setItems([])

  const detailed = useMemo(
    () =>
      items
        .map((i) => {
          const product = products.find((p) => p.sku === i.sku)
          return product ? { ...product, qty: i.qty, lineTotal: product.price * i.qty } : null
        })
        .filter(Boolean),
    [items]
  )

  const subtotal = detailed.reduce((sum, i) => sum + i.lineTotal, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  const value = { items, detailed, subtotal, count, add, setQty, remove, clear, open, setOpen }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
