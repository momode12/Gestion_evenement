import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";

const extractCIN = (rawData) => {
  const regex = /CIN:\s*(.+)/i; // Regexp pour détecter "CIN:" + espace(s) + valeur
  const match = rawData.match(regex);
  return match ? match[1].trim() : rawData.trim(); // Retourne CIN ou tout le texte si non trouvé
};

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [flash, setFlash] = useState("off");
  const [hasFlash, setHasFlash] = useState(true);
  const [storedData, setStoredData] = useState({ role_utilisateur: null });
  const [isLoadingData, setIsLoadingData] = useState(true);

  const handleBarCodeScanned = useCallback(
  async ({ type, data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const utilisateur_id = await AsyncStorage.getItem("utilisateur_id");
      const role_utilisateur = storedData.role_utilisateur;

      const cinClient = extractCIN(data);

      const etatResponse = await fetch(
        `${API_URL}/api/entree_sortie/etat`
      );
      const etatData = await etatResponse.json();
      const etatFete = etatData.etat; // 'entree', 'sortie' ou null

      console.log("QR brut :", data);
      console.log("CIN extrait :", cinClient);
      console.log("État actuel :", etatFete);
      console.log("Rôle :", role_utilisateur);

      let action = null;

      if (etatFete === "sortie" && role_utilisateur === "securite_entree") {
        action = "entree";
      } else if (etatFete === "entree" && role_utilisateur === "securite_sortie") {
        action = "sortie";
      } else {
        Alert.alert(
          "⛔ Accès refusé",
          "Action non autorisée selon l’état actuel ou votre rôle."
        );
        setScanned(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/entree_sortie/${action}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cin_client: cinClient,
            id_utilisateur: utilisateur_id,
          }),
        }
      );

      const result = await response.json();

      Alert.alert(
        response.ok
          ? action === "entree"
            ? "🚪 Entrée réussie"
            : "🔓 Sortie réussie"
          : "❌ Erreur",
        result.message || `Action ${action} effectuée.`,
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    } catch (error) {
      console.error("Erreur API:", error);
      Alert.alert("❌ Erreur", "Une erreur s’est produite.");
      setScanned(false);
    }
  },
  [scanned, storedData]
);


  useEffect(() => {
    const loadStoredData = async () => {
      try {
        setIsLoadingData(true);
        const role_utilisateur = await AsyncStorage.getItem("role_utilisateur");
        setStoredData({ role_utilisateur: role_utilisateur || "Non défini" });
      } catch (error) {
        console.error("Erreur AsyncStorage :", error);
        Alert.alert("Erreur", "Impossible de charger les données utilisateur.");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadStoredData();
    if (!permission) requestPermission();
  }, [permission]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        "utilisateur_id",
        "role_utilisateur",
        "email_utilisateur",
      ]);
      navigation.replace("Login");
    } catch (error) {
      console.error("Erreur déconnexion :", error);
      Alert.alert("Erreur", "Échec de la déconnexion.");
    }
  }, [navigation]);

  const confirmLogout = useCallback(() => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Oui", onPress: handleLogout },
    ]);
  }, [handleLogout]);

  const increaseZoom = useCallback(
    () => setZoom((prev) => Math.min(1, parseFloat((prev + 0.1).toFixed(1)))),
    []
  );

  const decreaseZoom = useCallback(
    () => setZoom((prev) => Math.max(0, parseFloat((prev - 0.1).toFixed(1)))),
    []
  );

  const toggleFlash = useCallback(() => {
    if (hasFlash) {
      setFlash((prev) => (prev === "torch" ? "off" : "torch"));
    } else {
      Alert.alert("Erreur", "Le flash n'est pas disponible sur cet appareil.");
    }
  }, [hasFlash]);

  return (
    <View style={styles.container}>
      {!permission ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.infoText}>
            Chargement de la permission caméra...
          </Text>
        </View>
      ) : !permission.granted ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>L'accès à la caméra est refusé</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={requestPermission}
          >
            <Text style={styles.retryButtonText}>Redemander l'accès</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Scanner un QR Code</Text>

          <View style={styles.dataContainer}>
            {isLoadingData ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <View style={styles.dataRow}>
                <Icon
                  name="user"
                  size={20}
                  color="#555"
                  style={styles.dataIcon}
                />
                <Text style={styles.dataText}>
                  Rôle : {storedData.role_utilisateur}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cameraContainer}>
            <CameraView
              onBarcodeScanned={handleBarCodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              zoom={zoom}
              flash={flash}
              style={StyleSheet.absoluteFillObject}
            />
            {scanned && <View style={styles.scanOverlay} />}
          </View>

          <View style={styles.zoomTextContainer}>
            <Text style={styles.zoomText}>
              Zoom : {(zoom * 100).toFixed(0)}%
            </Text>
          </View>

          <View style={styles.controls}>
            <Pressable style={styles.controlButton} onPress={decreaseZoom}>
              <Icon name="minus" size={24} color="#fff" />
            </Pressable>
            <Pressable style={styles.controlButton} onPress={increaseZoom}>
              <Icon name="plus" size={24} color="#fff" />
            </Pressable>
            <Pressable
              style={[
                styles.controlButton,
                flash === "torch" && styles.flashButtonActive,
                !hasFlash && styles.buttonDisabled,
              ]}
              onPress={toggleFlash}
              disabled={!hasFlash}
            >
              <Icon
                name={flash === "torch" ? "zap" : "zap-off"}
                size={24}
                color={hasFlash ? "#fff" : "#999"}
              />
            </Pressable>
          </View>

          <View style={styles.bottomSpacer} />

          <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Icon name="log-out" size={24} color="#fff" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 20,
    textAlign: "center",
  },
  dataContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataIcon: {
    marginRight: 10,
  },
  dataText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  cameraContainer: {
    width: "90%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#007AFF",
    elevation: 6,
    marginTop: 20,
    marginBottom: 20,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 122, 255, 0.3)",
    borderWidth: 3,
     marginBottom: 20,
    borderColor: "#007AFF",
  },
  zoomTextContainer: {
    marginVertical: 12,
  },
  zoomText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 12,
    elevation: 4,
  },
  controlButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  flashButtonActive: {
    backgroundColor: "#FFD600",
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  bottomSpacer: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 30,
    width: "100%",
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  infoText: {
    fontSize: 18,
    color: "#333",
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    color: "#E53935",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
