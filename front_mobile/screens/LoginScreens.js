import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function LoginScreens() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigation = useNavigation();

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (!text) {
      setPasswordError("");
    } else if (text.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(text)) {
      setPasswordError("Il faut une majuscule, une minuscule et un chiffre");
    } else {
      setPasswordError("");
    }
  };

 const handleLogin = async () => {
  Keyboard.dismiss();

  const loginData = {
    email_utilisateur: email,
    mot_de_passe_utilisateur: password,
  };

  try {
    const response = await axios.post(
      `http://192.168.1.104:5000/api/utilisateur/login`,
      loginData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    const data = response.data;

    // Sauvegarde des infos dans AsyncStorage
    await AsyncStorage.setItem("utilisateur_id", data.id_utilisateur.toString());
    await AsyncStorage.setItem("role_utilisateur", data.role_utilisateur);
    await AsyncStorage.setItem("email_utilisateur", email);

    // ✅ Alerte avec icône "Succès"
    Alert.alert("✅ Connexion réussie", "Bienvenue sur la plateforme !", [
      { text: "OK", onPress: () => navigation.replace("Dashboard") },
    ]);
  } catch (error) {
    // ❌ Alerte avec icône "Erreur"
    Alert.alert(
      "❌ Erreur de connexion",
      error.response?.data?.message || "Email ou mot de passe incorrect."
    );
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <View style={styles.passwordInputWrapper}>
        <TextInput
          style={[
            styles.input,
            passwordError && styles.inputError,
            styles.passwordInput,
          ]}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={handlePasswordChange}
        />
        <TouchableOpacity
          style={styles.iconRight}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? "visibility-off" : "visibility"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {passwordError !== "" && (
        <View style={styles.errorMessageContainer}>
          <Icon
            name="error-outline"
            size={16}
            color="red"
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{passwordError}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Pas encore inscrit ?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Register")}
        >
          Créer un compte
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.07,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 35,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  passwordInputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 44,
  },
  iconRight: {
    position: "absolute",
    right: 12,
    top: Platform.OS === "ios" ? 14 : 12,
  },
  inputError: {
    borderColor: "red",
  },
  errorMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -10,
    marginBottom: 10,
    paddingLeft: 4,
  },
  errorIcon: {
    marginRight: 5,
  },
  errorText: {
    color: "red",
    fontSize: 13,
  },
  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "600",
  },
  registerText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  link: {
    color: "#0066cc",
    fontWeight: "bold",
  },
});
