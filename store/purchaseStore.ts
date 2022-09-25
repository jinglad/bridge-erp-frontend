import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IProductForm {
  name: string;
  qty: number;
  buy_price: number;
  sell_price: number;
  _id: string;
}

interface PurchaseForm {
  products: IProductForm[];
  supplier: string;
  to_be_paid: number;
  paid: number;
  payment_method: string;
}

interface PurchaseStore {
  purchaseFrom: PurchaseForm;
  setPurchaseForm: (purchaseForm: PurchaseForm) => void;
}

const usePurchaseStore = create<PurchaseStore>()(
  devtools(
    persist((set) => ({
      purchaseFrom: {
        products: [{ name: "", qty: 1, buy_price: 0, sell_price: 0, _id: "" }],
        supplier: "",
        to_be_paid: 0,
        paid: 0,
        payment_method: "",
      },
      setPurchaseForm: (purchaseForm: PurchaseForm) => {
        set({
          purchaseFrom: purchaseForm,
        });
      },
    })),
    {
      name: "purchase-store",
    }
  )
);

export default usePurchaseStore;
