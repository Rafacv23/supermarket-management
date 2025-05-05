import { create } from "zustand"
import { persist } from "zustand/middleware"

interface OrderProduct {
  barcode: string
  stock: number
}

interface ReceiveStore {
  receivedProducts: OrderProduct[]
  addProduct: (product: OrderProduct) => void
  updateProductStock: (barcode: string, stock: number) => void
  removeProduct: (barcode: string) => void
  clearOrder: () => void
}

// Stack the products in localStorage until the user sends out to the database
export const useReceiveStore = create<ReceiveStore>()(
  persist(
    (set, get) => ({
      receivedProducts: [],

      addProduct: (product) => {
        const existing = get().receivedProducts.find(
          (p) => p.barcode === product.barcode
        )
        if (existing) {
          // If product already exists, update stock
          set({
            receivedProducts: get().receivedProducts.map((p) =>
              p.barcode === product.barcode
                ? { ...p, stock: p.stock + product.stock }
                : p
            ),
          })
        } else {
          set({ receivedProducts: [...get().receivedProducts, product] })
        }
      },

      updateProductStock: (barcode, stock) => {
        set({
          receivedProducts: get().receivedProducts.map((p) =>
            p.barcode === barcode ? { ...p, stock } : p
          ),
        })
      },

      removeProduct: (barcode) => {
        set({
          receivedProducts: get().receivedProducts.filter(
            (p) => p.barcode !== barcode
          ),
        })
      },

      clearOrder: () => {
        set({ receivedProducts: [] })
      },
    }),
    {
      name: "order-storage", // localStorage key
    }
  )
)
