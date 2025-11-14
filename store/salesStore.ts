import { createTrackedSelector } from "react-tracked";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Product } from "../apis/product-service";

interface ICustomer {
  _id: string;
  customerName: string;
}

interface SalesStore {
  customer: ICustomer | null;
  setCustomer: (data: ICustomer | null) => void;
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
        customer: null,
        setCustomer: (data: ICustomer | null) => set({ customer: data }),
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
            customer: null,
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

export const useTrackedSalesStore = createTrackedSelector(useSalesStore);
