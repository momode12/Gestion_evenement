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
  Box,
  Typography,
  Container,
  TablePagination,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import { Edit, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import Add_customers from "./Add_customers";
import Update_customers from "./Update_customers";

function Customers() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [openAdd, setOpenAdd] = useState(false);
  const [openModify, setOpenModify] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch clients from the backend
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/client/fetch");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }
        console.log("Clients reçus:", data);
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        setError(error.message);
      }
      setLoading(false);
    };
    fetchClients();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = clients.filter((client) =>
      [
        client.nom_client || "",
        client.prenom_client || "",
        client.email || "",
        client.id_client || "",
      ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredClients(filtered);
    setPage(0);
  }, [searchQuery, clients]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dialogs
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenModify = (client) => {
    setSelectedClient(client); // ← ici on passe un objet simple
    setOpenModify(true);
  };

  const handleCloseModify = () => {
    setOpenModify(false);
    setSelectedClient(null);
  };
  const handleDelete = async (id_client) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement le client.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/client/delete/${id_client}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Échec de la suppression");
        }
        const updatedClients = clients.filter((c) => c.id_client !== id_client);
        setClients(updatedClients);
        setFilteredClients(updatedClients);

        Swal.fire("Supprimé !", "Le client a été supprimé.", "success");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        setError(error.message);
        Swal.fire("Erreur", error.message, "error");
      }
    }
  };

  // After add or update
  const handleSuccess = async (newClient) => {
    // Ajoutez ou modifiez le client dans le tableau local
    const updatedClients = clients.map((client) =>
      client.id_client === newClient.id_client ? newClient : client
    );
    setClients(updatedClients);
    setFilteredClients(updatedClients);

    // Appeler fetchClients pour récupérer les données mises à jour du serveur
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/client/fetch");
        if (!response.ok) {
          throw new Error("Échec de la récupération des clients");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Format de données invalide");
        }
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
        setError(error.message);
      }
      setLoading(false);
    };

    // Récupérer les clients mis à jour
    await fetchClients();

    // Fermer les dialogues
    handleCloseAdd();
    handleCloseModify();
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Liste des clients
        </Typography>
      </Box>

      <Paper sx={{ p: 1, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpenAdd}>
            <AddIcon /> Ajouter
          </Button>
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "300px" }}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      <Add_customers
        open={openAdd}
        handleClose={handleCloseAdd}
        onSuccess={handleSuccess}
      />
      <Update_customers
        open={openModify}
        handleClose={handleCloseModify}
        selectedClient={selectedClient}
        clientData={selectedClient}
        onSuccess={handleSuccess}
      />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Erreur: {error}
        </Typography>
      )}

      <TableContainer
        component={Paper}
        sx={{ maxHeight: { xs: "500px", md: "700px" } }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                CIN
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Photo
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Nom
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Prénom
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Adresse
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Téléphone
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                PAF
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography>Chargement...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography>Aucun client trouvé</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow key={client.id_client}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {client.id_client || "N/A"}
                    </TableCell>
                    <TableCell>
                      {client.image ? (
                        <img
                          src={`data:image/jpeg;base64,${client.image}`}
                          alt="Client"
                          style={{
                            width: "35px",
                            height: "35px",
                            objectFit: "cover",
                            borderRadius: "50%", // <-- rend l'image ronde
                            border: "2px solid #ccc", // optionnel : bordure légère
                          }}
                          onError={(e) =>
                            (e.target.src = "/fallback-image.png")
                          }
                        />
                      ) : (
                        "Aucune image"
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {client.nom || "N/A"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {client.prenom || "N/A"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {client.email || "N/A"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {client.adresse || "N/A"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {client.telephone || "N/A"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {client.paf || "N/A"} Ar
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModify(client)}
                        sx={{ mr: 1 }}
                      >
                        <Edit fontSize="small" />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(client.id_client)}
                      >
                        <Delete fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[4, 10, 25]}
        component="div"
        count={filteredClients.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
}

export default Customers;
