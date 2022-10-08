import create from "zustand";
import { persist } from "zustand/middleware";

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
        set({
          purchaseForm: {
            products: [{ name: "", qty: 1, buy_price: 0, sell_price: 0, _id: "" }],
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

import { createTrackedSelector } from "react-tracked";

export const useTrackedPurchaseStore = createTrackedSelector(usePurchaseStore);
