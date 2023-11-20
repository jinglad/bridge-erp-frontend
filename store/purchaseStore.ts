import create from "zustand";
import { persist } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";
import { ISupplier } from "../apis/supplier-service";

interface IProductForm {
  name: string;
  purchase_qty: number;
  buy_price: number;
  sell_price: number;
  _id: string;
}

export interface PurchaseForm {
  products: IProductForm[];
  supplier: ISupplier;
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
        products: [{ name: "", purchase_qty: 1, buy_price: 0, sell_price: 0, _id: "" }],
        supplier: { _id: "", name: "" } as ISupplier,
      },
      setPurchaseForm: (purchaseForm: PurchaseForm) => {
        set({
          purchaseForm: purchaseForm,
        });
      },

      resetPurchaseForm: () => {
        const newProducts = [
          { name: "", purchase_qty: 1, buy_price: 0, sell_price: 0, _id: "" },
        ];

        set({
          purchaseForm: {
            products: newProducts,
            supplier: { _id: "", name: "" } as ISupplier,
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
