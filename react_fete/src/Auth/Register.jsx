import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleKeyUp = (e) => {
      setCapsLockActive(e.getModifierState("CapsLock"));
    };
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (!value) {
      setPasswordError("");
    } else if (value.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      setPasswordError(
        "Le mot de passe doit contenir au moins un chiffre, une lettre minuscule et une lettre majuscule"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmError("Les mots de passe ne correspondent pas");
    } else {
      setConfirmError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifications avant envoi
    if (!username || !prenom || !email || !password || !confirmPassword || !role) {
      Swal.fire({
        icon: "warning",
        title: "Champs requis",
        text: "Veuillez remplir tous les champs",
      });
      return;
    }

    if (passwordError || confirmError) {
      Swal.fire({
        icon: "error",
        title: "Erreur de mot de passe",
        text: "Veuillez vérifier les mots de passe",
      });
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Les mots de passe ne correspondent pas");
      Swal.fire({
        icon: "error",
        title: "Mot de passe",
        text: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    const registrationData = {
      nom_utilisateur: username,
      prenom_utilisateur: prenom,
      email_utilisateur: email,
      role_utilisateur: role,
      mot_de_passe_utilisateur: password,     
      statut_utilisateur: "en attente",
    };

    try {
      const response = await fetch(`${API_URL}/api/utilisateur/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Inscription réussie !",
          showConfirmButton: false, // Affiche le bouton
          timer: 2000,   
        }).then(() => navigate("/login"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: data.message || "Erreur lors de l'inscription",
        });
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur de connexion au serveur.",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 0.2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          style={{
            padding: 20,
            display: "flex",
            marginTop: "5%",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Inscription
          </Typography>
          <Box component="form" sx={{ mt: 1, width: "100%" }} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              label="Nom d'utilisateur"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              label="Prénom"
              margin="normal"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label" size="small">
                Rôle
              </InputLabel>
              <Select
                labelId="role-select-label"
                size="small"
                value={role}
                label="Rôle"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="responsable">Responsable</MenuItem>
                <MenuItem value="securite_entree">Sécurité Entrée</MenuItem>
                <MenuItem value="securite_sortie">Sécurité Sortie</MenuItem>
              </Select>
              <FormHelperText>Sélectionnez le rôle de l'utilisateur</FormHelperText>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: passwordError && (
                  <ErrorOutlineIcon
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                    color="error"
                  />
                ),
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Confirmer le mot de passe"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              error={!!confirmError}
              helperText={confirmError}
              InputProps={{
                endAdornment: confirmError && (
                  <ErrorOutlineIcon
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                    color="error"
                  />
                ),
              }}
            />
            {capsLockActive && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WarningIcon color="warning" sx={{ marginRight: 1 }} />
                <Typography variant="body2" color="warning">
                  Le verrouillage des majuscules est activé
                </Typography>
              </Box>
            )}
            <div style={{ marginTop: "20px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPassword}
                    onChange={handleShowPassword}
                    color="primary"
                  />
                }
                label="Afficher le mot de passe"
              />
            </div>
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
              S'inscrire
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Déjà un compte ?{" "}
              <Button
                onClick={() => navigate("/")}
                sx={{ textDecoration: "underline", cursor: "pointer" }}
              >
                Se connecter
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;
