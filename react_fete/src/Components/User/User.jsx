import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
  Box,
  Typography,
  TextField,
  Tooltip,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Update_user from "./Update_user";

function User() {
  const [openModify, setOpenModify] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Ajout de selectedUser
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const handleOpenModify = (user) => {
    setSelectedUser(user);
    setOpenModify(true);
  };

  const handleCloseModify = () => {
    setOpenModify(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrage des données (corrigé pour utiliser 'id' au lieu de 'id_utilisateur')
  const filteredData = Array.isArray(data)
    ? data.filter((user) =>
        user.id.toString().includes(searchTerm)
      )
    : [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/utilisateur`);
      console.log("Données récupérées :", response.data);
      // Vérifiez si response.data est un tableau directement
      setData(Array.isArray(response.data) ? response.data : response.data.rows || []);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      setError("Erreur lors de la récupération des utilisateurs.");
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "15vh"
        }}
      >
        <Typography variant="h3" component="h4" maxWidth="sm" sx={{ mb: 4}}>
          Liste des utilisateurs
        </Typography>
      </Box>
      <Paper sx={{ p: 2, mb:  0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label="Rechercher un utilisateur"
            variant="outlined"
            size="small"
            sx={{ width: "300px" }}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
        </Box>
      </Paper>
      <Update_user
        openModify={openModify}
        handleCloseModify={handleCloseModify}
        onSuccess={fetchUsers}
        selectedUser={selectedUser} // Corriger selectedParent en selectedUser
      />

      {error && (
        <Box sx={{ color: "red", marginTop: "20px" }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "20px" }}>
        <TableContainer elevation={2} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Numéro</TableCell>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Prénom</TableCell>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Rôle</TableCell>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(paginatedData) && paginatedData.length > 0 ? (
                paginatedData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.nom}</TableCell>
                    <TableCell>{user.prenom}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.statut}</TableCell>
                    <TableCell>
                      <Tooltip title="Modifier">
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => handleOpenModify(user)} // Corriger parent en user
                          sx={{ marginRight: 1 }}
                        >
                          <EditIcon /> Modifier
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[4, 8, 12]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Container>
  );
}

export default User;