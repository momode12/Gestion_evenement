import { useState, useEffect } from "react";
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
import Swal from "sweetalert2";

function Update_customers({ open, handleClose, onSuccess, clientData }) {
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

  const [fileObject, setFileObject] = useState(null);

  // Populate form with client data when dialog opens
  useEffect(() => {
    if (open && clientData) {
      console.log("clientData received:", clientData); // Debug log
      setFormData({
        cin_client: clientData.id_client || "",
        photo_client: clientData.image || "",
        nom_client: clientData.nom || "", // Assure-toi que ce champ existe
        prenom_client: clientData.prenom || "",
        email_client: clientData.email || "",
        adresse_client: clientData.adresse || "",
        telephone_client: clientData.telephone || "",
        paf_client: clientData.paf || "",
      });

      setFileObject(null); // Reset file object for new uploads
    } else if (!open) {
      // Reset form when dialog closes
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
      setFileObject(null);
    }
  }, [clientData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileObject(file);
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
    // Basic validation for required fields
    if (
      !formData.cin_client ||
      !formData.nom_client ||
      !formData.prenom_client
    ) {
      Swal.fire({
        icon: "warning",
        title: "Champs requis",
        text: "Veuillez remplir tous les champs obligatoires (CIN, Nom, Prénom).",
      });
      return;
    }

    const id_utilisateur = localStorage.getItem("utilisateur_id");
    if (!id_utilisateur) {
      Swal.fire({
        icon: "warning",
        title: "Utilisateur non identifié",
        text: "Impossible de modifier un client sans utilisateur connecté.",
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
      form.append("id_utilisateur", id_utilisateur);
      if (fileObject) {
        form.append("photo_client", fileObject); // Only append if a new file is selected
      }

      const response = await fetch(
        `http://localhost:5000/api/client/update/${clientData?.id_client}`,
        {
          method: "PUT",
          body: form,
        }
      );

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
      console.error("Erreur lors de la modification du client :", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier un client</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
          sx={{ mt: 1 }}
        >
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
            <IconButton
              color="primary"
              component="span"
              aria-label="upload picture"
            >
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
          required
        />
        <TextField
          size="small"
          margin="dense"
          name="nom_client"
          label="Nom"
          fullWidth
          value={formData.nom_client}
          onChange={handleChange}
          required
        />
        <TextField
          margin="dense"
          size="small"
          name="prenom_client"
          label="Prénom"
          fullWidth
          value={formData.prenom_client}
          onChange={handleChange}
          required
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
        <Button onClick={handleSubmit} variant="contained">
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Update_customers;
