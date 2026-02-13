import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Sidebar({ navigation }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'utilisateur_id',
        'role_utilisateur',
        'email_utilisateur',
      ]);
      navigation.replace('Login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>

      <Button title="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Scan_simple" onPress={() => navigation.navigate('ScanSimple')} />
      <Button title="Scan_entrée" onPress={() => navigation.navigate('ScanEntree')} />
      <Button title="Scan_sortie" onPress={() => navigation.navigate('ScanSortie')} />
      <Button title="Déconnexion" onPress={confirmLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
