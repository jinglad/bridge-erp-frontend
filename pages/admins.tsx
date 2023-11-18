import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  ButtonGroup,
  Button,
  Stack,
  Box,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteAdmin, getAdmin } from "../apis/admin-service";
import AddAdminDialog from "../components/AddAdminDialog";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";
import useUserStore from "../store/userStore";

function Admin() {
  const { user } = useUserStore((state) => state);
  // const { user } = useAuth();
  // const [email, setEmail] = useState("");

  // const addAdmin = async () => {
  //   const response = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/admin`,{
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       "authorization": `Bearer ${localStorage.getItem("token")}`
  //     },
  //     body: JSON.stringify({email})
  //   })
  //   if(response.ok) {
  //     alert("Admin Added Successgully");
  //   } else {
  //     alert("Something wrong. Try again please.")
  //   }
  // }

  return (
    <Layout>
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <AddAdminDialog />
        </Box>
      </Stack>
    </Layout>
  );
}

export default Admin;
