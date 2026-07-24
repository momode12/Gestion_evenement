import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Swal from 'sweetalert2';

function AddCustomers({ open, handleClose, onSuccess }) {
  const [formData, setFormData] = useState({
    cin_client: "",
    photo_client: "",
    nom_client: "",
    prenom_client: "",
    email_client: "",
    adresse_client: "",
    telephone_client: "",
    paf_client: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const [fileObject, setFileObject] = useState(null);
const API_URL = import.meta.env.VITE_API_URL;

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFileObject(file); // <=== Utilisé dans handleSubmit
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setFormData((prev) => ({
        ...prev,
        photo_client: base64,
      }));
    };
    reader.readAsDataURL(file);
  }
};


const handleSubmit = async () => {
  const id_utilisateur = localStorage.getItem("utilisateur_id");
  if (!id_utilisateur) {
    Swal.fire({
      icon: "warning",
      title: "Utilisateur non identifié",
      text: "Impossible d'ajouter un client sans utilisateur connecté.",
    });
    return;
  }
  try {
    const form = new FormData();
    form.append("cin_client", formData.cin_client);
    form.append("nom_client", formData.nom_client);
    form.append("prenom_client", formData.prenom_client);
    form.append("email_client", formData.email_client);
    form.append("adresse_client", formData.adresse_client);
    form.append("telephone_client", formData.telephone_client);
    form.append("paf_client", formData.paf_client);
    form.append("id_utilisateur", id_utilisateur); // à adapter
    form.append("photo_client", fileObject);

    const response = await fetch(`${API_URL}/api/client/create`, {
      method: "POST",
      body: form,
    });

    const result = await response.json();

    if (response.ok) {
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: result.message,
        timer: 3000,
        showConfirmButton: false,
      });
      onSuccess(result);

      // Réinitialiser les champs du formulaire après un ajout réussi
      setFormData({
        cin_client: "",
        photo_client: "",
        nom_client: "",
        prenom_client: "",
        email_client: "",
        adresse_client: "",
        telephone_client: "",
        paf_client: "",
      });
      setFileObject(null); // Réinitialiser la photo aussi
    } else {
      handleClose();
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: result.error || "Une erreur s’est produite.",
      });
    }
  } catch (error) {
    handleClose();
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Impossible de contacter le serveur.",
    });
    console.error("Erreur lors de l'ajout du client :", error);
  }
};


  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un client</DialogTitle>
      <DialogContent>
        <Stack direction="column" alignItems="center" spacing={2} sx={{ mt: 1 }}>
          <Avatar
            src={
              formData.photo_client
                ? `data:image/jpeg;base64,${formData.photo_client}`
                : ""
            }
            sx={{ width: 100, height: 100 }}
          />
          <label htmlFor="upload-photo">
            <input
              style={{ display: "none" }}
              id="upload-photo"
              name="upload-photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <IconButton color="primary" component="span" aria-label="upload picture">
              <PhotoCamera />
            </IconButton>
          </label>
        </Stack>

        <TextField
          margin="dense"
          size="small"
          name="cin_client"
          label="CIN"
          fullWidth
          value={formData.cin_client}
          onChange={handleChange}
        />
        <TextField
        size="small"
          margin="dense"
          name="nom_client"
          label="Nom"
          fullWidth
          value={formData.nom_client}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          size="small"
          name="prenom_client"
          label="Prénom"
          fullWidth
          value={formData.prenom_client}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          size="small"
          name="email_client"
          label="Email"
          fullWidth
          value={formData.email_client}
          onChange={handleChange}
        />
        <TextField
        size="small"
          margin="dense"
          name="adresse_client"
          label="Adresse"
          fullWidth
          value={formData.adresse_client}
          onChange={handleChange}
        />
        <TextField
        size="small"
          margin="dense"
          name="telephone_client"
          label="Téléphone"
          fullWidth
          value={formData.telephone_client}
          onChange={handleChange}
        />
        <TextField
        size="small"
          margin="dense"
          name="paf_client"
          label="PAF"
          type="number"
          fullWidth
          value={formData.paf_client}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddCustomers;
