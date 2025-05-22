import { create } from "zustand"
import { persist } from "zustand/middleware"

interface OrderProduct {
  name: string
  barcode: string
  stock: number
}

interface OrderStore {
  order: OrderProduct[]
  addProduct: (product: OrderProduct) => void
  removeProduct: (barcode: string) => void
  clearOrder: () => void
}

// Stack the products in localStorage until the user sends out to the database
export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      order: [],

      addProduct: (product) => {
        const existing = get().order.find((p) => p.barcode === product.barcode)
        if (existing) {
          // If product already exists, update stock
          set({
            order: get().order.map((p) =>
              p.barcode === product.barcode
                ? {
                    ...p,
                    name: product.name,
                    stock: p.stock + product.stock,
                  }
                : p
            ),
          })
        } else {
          set({ order: [...get().order, product] })
        }
      },

      removeProduct: (barcode) => {
        set({
          order: get().order.filter((p) => p.barcode !== barcode),
        })
      },

      clearOrder: () => {
        set({ order: [] })
      },
    }),
    {
      name: "receive-storage", // localStorage key
    }
  )
)
