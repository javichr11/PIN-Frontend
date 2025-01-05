import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useUser } from '../context/UserProvider';

export default function Notificaciones() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications(); 
      const interval = setInterval(fetchNotifications, 60000); 
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch('https://croacky.onrender.com/notificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: user.id }),
      });

      if (!response.ok) {
        throw new Error(`Error al obtener notificaciones: ${response.status}`);
      }

      const data = await response.json();

      const today = new Date();

      const filteredNotifications = data.filter(notification => {
        const notificationDate = new Date(notification.fecha_creacion);
        return notificationDate.getDate() === today.getDate() &&
               notificationDate.getMonth() === today.getMonth() &&
               notificationDate.getFullYear() === today.getFullYear();
      });


      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las notificaciones. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderNotification = ({ item }) => {

    return (

      <View style={styles.notificationItem}>
      <Text style={styles.message}>{item.mensaje}</Text>
      <Text style={styles.date}>
        {item.fecha_creacion ? 
          new Date(item.fecha_creacion).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })
          : 'Fecha no disponible'}
      </Text>
    </View>

    );

  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={fetchNotifications}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes notificaciones nuevas.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  notificationItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 1,
  },
  message: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
});
