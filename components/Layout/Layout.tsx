import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { Collapse, IconButton, useMediaQuery } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { hasChildren } from "../../utils/hasChildren";
import LoginButton from "../Login/LoginButton";
import { menu } from "./menu";

const drawerWidth = 240;

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(true);
  const matches = useMediaQuery("(min-width:600px)");
  const [dVariant, setDVariant] = useState<"permanent" | "persistent" | "temporary" | undefined>("permanent");
  console.log(matches);
  const toggleDrawer = () => {
    if (matches) {
      if (dVariant === "permanent") {
        setDVariant("temporary");
      } else {
        setDVariant("permanent");
      }
    } else {
      setOpen(!open);
    }
  };

  useEffect(() => {
    setOpen(false);
    if (matches) {
      setDVariant("permanent");
    } else {
      setDVariant("temporary");
    }
  }, [matches]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" fontWeight="bold" noWrap component="div">
            Bridge ERP
          </Typography>
          <Box flexGrow={1}>
            <IconButton
              sx={{
                marginLeft: "15px",
              }}
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <LoginButton />
        </Toolbar>
      </AppBar>
      <Drawer
        variant={dVariant}
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          {menu.map((item, key) => (
            <MenuItem key={key} item={item} />
          ))}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
}

const MenuItem = ({ item }: any) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} />;
};

const SingleLevel = ({ item }: any) => {
  return (
    <NextLink href={item.to} passHref>
      <ListItem button>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItem>
    </NextLink>
  );
};

const MultiLevel = ({ item }: any) => {
  const { items: children } = item;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children.map((child: any, key: any) => (
            <MenuItem key={key} item={child} />
          ))}
        </List>
      </Collapse>
    </Fragment>
  );
};
