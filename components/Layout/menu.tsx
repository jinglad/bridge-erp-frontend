import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import EuroIcon from "@mui/icons-material/Euro";
import Admin from "@mui/icons-material/AdminPanelSettings";
import SellIcon from "@mui/icons-material/Sell";
import React from "react";

export const menu = [
  {
    icon: <InventoryOutlinedIcon />,
    title: "Products",
    items: [
      {
        title: "Registered Products",
        to: "/products",
      },
      {
        title: "Categories",
        to: "/categories",
      },
      {
        title: "Brands",
        to: "/brand",
      },
    ],
  },
  {
    icon: <ContactsOutlinedIcon />,
    title: "Contacts",
    items: [
      {
        title: "Suppliers",
        to: "/suppliers",
      },
      {
        title: "Customers",
        to: "/customers",
      },
    ],
  },
  {
    icon: <ShoppingCartOutlinedIcon />,
    title: "Purchase",
    to: "/purchase",
  },
  {
    icon: <EuroIcon />,
    title: "Expense",
    to: "/expense",
  },
  {
    icon: <TrendingUpOutlinedIcon />,
    title: "Sales Point",
    to: "/sales",
  },
  {
    icon: <SellIcon />,
    title: "Orders",
    to: "/orders",
  },
  {
    icon: <Admin />,
    title: "Admins",
    to: "/admins",
  },
];
