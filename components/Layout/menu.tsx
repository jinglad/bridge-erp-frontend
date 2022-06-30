import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
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
    icon: <TrendingUpOutlinedIcon />,
    title: "Sales Point",
    to: "/sales",
  },
];
