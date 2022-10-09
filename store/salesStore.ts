import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Product } from "../apis/product-service";

interface SalesStore {
  customerName: string;
  setCustomerName: (name: string) => void;
  setProductName: (name: string) => void;
  productName: string;
  setBrandName: (name: string) => void;
  brandName: string;
  setCategoryName: (name: string) => void;
  categoryName: string;
  cartItems: Product[];
  addToCart: (product: Product) => void;
  reset: () => void;
  setCartItems: (cartItems: Product[]) => void;
  deleteItemFromCart: (productId: string) => void;
}

const useSalesStore = create<SalesStore>()(
  devtools(
    persist(
      (set) => ({
        customerName: "",
        setCustomerName: (name: string) => set({ customerName: name }),
        productName: "",
        setProductName: (name: string) => set({ productName: name }),
        brandName: "",
        setBrandName: (name: string) => set({ brandName: name }),
        categoryName: "",
        setCategoryName: (name: string) => set({ categoryName: name }),
        cartItems: [],
        addToCart: (product: Product) => {
          set((state) => {
            const item = state.cartItems.findIndex((item) => item._id === product._id);

            if (item !== -1) {
              const newCartItems = [...state.cartItems];
              newCartItems[item].qty += 1;
              return {
                cartItems: newCartItems,
              };
            }
            return {
              cartItems: [...state.cartItems, { ...product }],
            };
          });
        },
        setCartItems: (cartItems: Product[]) => {
          set(() => ({
            cartItems,
          }));
        },
        deleteItemFromCart: (productId: string) => {
          set((state) => ({
            cartItems: state.cartItems.filter((item) => item._id !== productId),
          }));
        },
        reset: () => {
          set((state) => ({
            cartItems: [],
            customerName: "",
          }));
        },
      }),
      {
        name: "sales-store",
      }
    )
  )
);

export default useSalesStore;
