import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

function Entree_Sortie() {
  const [entreesSorties, setEntreesSorties] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterCin, setFilterCin] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role_utilisateur");
    setIsAdmin(role === "admin");
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:5000/api/entree_sortie/fetch")
      .then((response) => {
        setEntreesSorties(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération :", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!filterCin) {
      setFilteredData(entreesSorties);
    } else {
      const filtered = entreesSorties.filter((item) =>
        item.cin_client.toLowerCase().includes(filterCin.toLowerCase())
      );
      setFilteredData(filtered);
      setPage(0);
    }
  }, [filterCin, entreesSorties]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: `Supprimer cette entrée ?`,
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/entree_sortie/delete/${id}`);


        Swal.fire("Supprimé !", "L'entrée a été supprimée.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Erreur", "Impossible de supprimer cette entrée.", "error");
        console.error("Erreur suppression :", error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Liste des Entrées / Sorties
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Rechercher par CIN"
          variant="outlined"
          size="small"
          value={filterCin}
          onChange={(e) => setFilterCin(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          sx={{ minWidth: 250 }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#fff" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>CIN</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Prénom</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>État</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date & Heure</TableCell>
              {isAdmin && (
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={item.id_entree_sortie} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{item.cin_client}</TableCell>
                  <TableCell>{item.nom}</TableCell>
                  <TableCell>{item.prenom}</TableCell>
                  <TableCell>{item.etat}</TableCell>
                  <TableCell>{item.date_heure}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item.id_entree_sortie)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>
    </Box>
  );
}

export default Entree_Sortie;
