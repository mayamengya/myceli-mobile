import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut, User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { checkHealth } from '../services/api';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function HomeScreen({ user, onLogout }: Props) {
  const [serverStatus, setServerStatus] = useState('checking...');

  useEffect(() => {
    checkHealth(user)
      .then(data => setServerStatus(data.status))
      .catch(() => setServerStatus('unreachable'));
  }, []);

  async function handleLogout() {
    await signOut(auth);
    onLogout();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Server status</Text>
        <Text style={[
          styles.statusValue,
          { color: serverStatus === 'healthy' ? '#2D6A4F' : '#e74c3c' }
        ]}>
          {serverStatus}
        </Text>
      </View>

      <Text style={styles.uid}>Firebase UID: {user.uid}</Text>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  statusCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  uid: {
    fontSize: 11,
    color: '#bbb',
    marginBottom: 48,
  },
  logout: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#666',
  },
});