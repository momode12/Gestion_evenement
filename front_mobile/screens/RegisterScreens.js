import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from 'axios';

export default function RegisterScreens() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [role, setRole] = useState("");
  const navigation = useNavigation();

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (!value) {
      setPasswordError("");
    } else if (value.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      setPasswordError(
        "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre"
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

  const handleSubmit = async () => {
  if (!username || !prenom || !email || !password || !confirmPassword || !role) {
    Alert.alert("Champs requis", "Veuillez remplir tous les champs");
    return;
  }

  if (passwordError || confirmError) {
    Alert.alert("Erreur de mot de passe", "Veuillez vérifier les mots de passe");
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
    const response = await axios.post(`http://192.168.1.104:5000/api/utilisateur`, registrationData);

    if (response.status === 200 || response.status === 201) {
      Alert.alert("✅ Succès", "Inscription réussie !");
      navigation.navigate("Login");
    } else {
      Alert.alert("❌ Erreur", response.data.message || "❌ Erreur lors de l'inscription");
    }
  } catch (error) {
    console.error("❌ Erreur d'inscription:", error);

    if (error.response) {
      // Erreur envoyée par le serveur (ex: 400 ou 500)
      const message = error.response.data.message || "❌ Erreur du serveur";
      Alert.alert("❌ Erreur", message);
    } else if (error.request) {
      // Pas de réponse du serveur
      Alert.alert("❌ Erreur", "Aucune réponse du serveur. Vérifiez l'URL ou la connexion.");
    } else {
      // Autre erreur
      Alert.alert("❌ Erreur", "Une erreur s'est produite.");
    }
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Inscription</Text>

        {/* Nom utilisateur */}
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Prénom */}
        <View style={styles.inputContainer}>
          <Icon
            name="person-outline"
            size={20}
            color="#666"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={prenom}
            onChangeText={setPrenom}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="Sélectionner un rôle" value="" />
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="Responsable" value="responsable" />
            <Picker.Item label="Sécurité Entrée" value="securite_entree" />
            <Picker.Item label="Sécurité Sortie" value="securite_sortie" />
          </Picker>
        </View>

        {/* Mot de passe */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? "visibility-off" : "visibility"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <View style={styles.errorRow}>
            <Icon name="error-outline" size={16} color="red" />
            <Text style={styles.errorText}>{passwordError}</Text>
          </View>
        ) : null}

        {/* Confirmer mot de passe */}
        <View style={styles.inputContainer}>
          <Icon
            name="lock-outline"
            size={20}
            color="#666"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? "visibility-off" : "visibility"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {confirmError ? (
          <View style={styles.errorRow}>
            <Icon name="error-outline" size={16} color="red" />
            <Text style={styles.errorText}>{confirmError}</Text>
          </View>
        ) : null}

        {/* Bouton inscription */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

          <Text style={styles.registerText}>
                Déjà un compte ? {' '}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                Se connecter
                </Text>
                   </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles (ajouté styles.errorRow)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 20, paddingTop: 50 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  icon: {
    marginRight: 8,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  input: {
    flex: 1,
    height: 45,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
 registerText: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  link: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginLeft: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 4,
  },
});
