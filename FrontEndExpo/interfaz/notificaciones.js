import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useUser } from '../context/UserProvider';
import { Ionicons } from 'react-native-vector-icons';
import dayjs from 'dayjs';

const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
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
      setNotifications(data);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.notificationsContainer}>
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notification}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={24} color="#FFF" />
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.notificationText}>{notification.mensaje}</Text>
                <Text style={styles.dateText}>
                  Recibida el: {dayjs(notification.fecha_creacion).format('YYYY-MM-DD HH:mm:ss')}
                </Text>       
              </View>
            </View>
          ))}
          {notifications.length === 0 && (
            <View style={styles.noNotifications}>
              <Text style={styles.noNotificationsText}>No tienes notificaciones nuevas.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  loader: {
    marginTop: 20,
  },
  notificationsContainer: {
    paddingBottom: 20,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(204, 148, 254, 0.75)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4949',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  notificationText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    color: '#AAA',
    fontSize: 12,
    textAlign: 'right',
  },
  noNotifications: {
    alignItems: 'center',
    marginTop: 40,
  },
  noNotificationsText: {
    color: '#AAA',
    fontSize: 16,
  },
});

export default NotificationsComponent;