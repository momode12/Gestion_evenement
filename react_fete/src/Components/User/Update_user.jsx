import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function Update_user({ openModify, handleCloseModify, selectedUser, onSuccess }) {
  // État pour les champs du formulaire
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    prenom: '',
    email: '',
    role: '',
    statut: '',
  });

  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  // Initialiser les champs du formulaire lorsque selectedUser change
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        id: selectedUser.id || '',
        nom: selectedUser.nom || '',
        prenom: selectedUser.prenom || '',
        email: selectedUser.email || '',
        role: selectedUser.role || '',
        statut: selectedUser.statut || '',
      });
      setErrors({});
    }
  }, [selectedUser]);

  // Gérer les changements dans le champ statut
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Selected statut: '${value}'`); // Debug: Log selected value
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Valider le formulaire (seulement pour le statut)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.statut) newErrors.statut = 'Le statut est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire pour mettre à jour le statut
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Utiliser le statut tel quel (valeurs contrôlées par Select)
    const statut = formData.statut;
    console.log(`Submitting statut: '${statut}'`); // Debug: Log statut before submission
    handleCloseModify();
    // Afficher une alerte de confirmation avec SweetAlert2
    const confirmationText =
      statut === 'Refusé'
        ? 'Êtes-vous sûr de vouloir refuser cet utilisateur ? Cela supprimera l’utilisateur de la base de données.'
        : `Êtes-vous sûr de vouloir définir le statut à "${statut}" ?`;
        handleCloseModify();
    const result = await Swal.fire({
      title: 'Confirmer l’action',
      text: confirmationText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      // Log the exact payload
      const payload = { statut };
      console.log('Sending payload:', payload);
      const response = await axios.put(
        `${API_URL}/api/utilisateur/validation/${formData.id}`,
        payload
      );
      console.log('API response:', response.data); // Debug: Log API response
      handleCloseModify();
      await Swal.fire({
        title: 'Succès',
        text:
          statut === 'Refusé'
            ? 'Utilisateur refusé et supprimé avec succès.'
            : `Statut mis à jour à "${statut}" avec succès.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
      console.log('Error response:', error.response?.data); // Debug: Log error details
      handleCloseModify();
      await Swal.fire({
        title: 'Erreur',
        text: error.response?.data?.message || 'Erreur lors de la mise à jour du statut. Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setErrors({ submit: 'Erreur lors de la mise à jour. Veuillez réessayer.' });
    }
  };

  return (
    <Modal
      open={openModify}
      onClose={handleCloseModify}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={3}>
          Modifier le statut de l'utilisateur
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="ID"
            name="id"
            value={formData.id}
            fullWidth
            margin="normal"
            disabled
            variant="outlined"
          />
          <TextField
            label="Nom"
            name="nom"
            value={formData.nom}
            fullWidth
            margin="normal"
            disabled
            variant="outlined"
          />
          <TextField
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            fullWidth
            margin="normal"
            disabled
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            fullWidth
            margin="normal"
            disabled
            variant="outlined"
          />
          <TextField
            label="Rôle"
            name="role"
            value={formData.role}
            fullWidth
            margin="normal"
            disabled
            variant="outlined"
          />
          <FormControl fullWidth margin="normal" error={!!errors.statut}>
            <InputLabel>Statut</InputLabel>
            <Select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              label="Statut"
            >
              <MenuItem value="En attente">En attente</MenuItem>
              <MenuItem value="Accepté">Accepté</MenuItem>
              <MenuItem value="Refusé">Refusé</MenuItem>
            </Select>
            {errors.statut && <Typography color="error">{errors.statut}</Typography>}
          </FormControl>
          {errors.submit && (
            <Typography color="error" mt={2}>
              {errors.submit}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button onClick={handleCloseModify} variant="outlined" color="secondary">
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Enregistrer
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default Update_user;