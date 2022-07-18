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
} from "@mui/material";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { deleteAdmin, getAdmin } from "../apis/admin-service";
import AddAdminDialog from "../components/AddAdminDialog";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { data, status, isLoading } = useQuery("admins", getAdmin);

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation("deleteAdmin", deleteAdmin, {
    onSuccess: (data) => {
      toast.success(data.msg);
      queryClient.invalidateQueries("admins");
    },
  });

  const { user } = useAuth();

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
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            {status === "loading" ? (
              <TableBody sx={{ display: "flex", m: "4rem", width: "100%" }}>
                <CircularProgress />
              </TableBody>
            ) : (
              <>
                <TableBody>
                  {data.map((row: any) => (
                    <TableRow key={row.uid}>
                      <TableCell>{row.email}</TableCell>
                      <TableCell align="right">
                        <ButtonGroup size="small">
                          <Button
                            disabled={user.uid === row.uid}
                            color="error"
                            variant="contained"
                            onClick={() => {
                              mutateAsync(row.uid);
                            }}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </TableContainer>
      </Stack>
    </Layout>
  );
}

export default Admin;
