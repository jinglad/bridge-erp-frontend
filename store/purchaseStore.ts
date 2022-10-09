import create from "zustand";
import { persist } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";

interface IProductForm {
  name: string;
  qty: number;
  buy_price: number;
  sell_price: number;
  _id: string;
}

export interface PurchaseForm {
  products: IProductForm[];
  supplier: string;
}

interface PurchaseStore {
  purchaseForm: PurchaseForm;
  setPurchaseForm: (purchaseForm: PurchaseForm) => void;
  resetPurchaseForm: () => void;
}

const usePurchaseStore = create<PurchaseStore>()(
  persist(
    (set) => ({
      purchaseForm: {
        products: [{ name: "", qty: 1, buy_price: 0, sell_price: 0, _id: "" }],
        supplier: "",
      },
      setPurchaseForm: (purchaseForm: PurchaseForm) => {
        set({
          purchaseForm: purchaseForm,
        });
      },

      resetPurchaseForm: () => {
        const newProducts = [{ name: "", qty: 1, buy_price: 0, sell_price: 0, _id: "" }];

        set({
          purchaseForm: {
            products: newProducts,
            supplier: "",
          },
        });
      },
    }),

    {
      name: "purchase-form",
    }
  )
);

export default usePurchaseStore;

export const useTrackedPurchaseStore = createTrackedSelector(usePurchaseStore);
