import React, {useState, useEffect} from 'react'; 
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, ScrollView} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DetalleEvento = ({route}) => {
    const {evento} = route.params;
    const [comments, setComments] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    //const [userId] = useState(1); // Suponiendo un ID de usuario fijo, cámbialo según tu lógica de autenticación
    //const [usuario_id, setUsuarioId] = useState('');
    const [usuario_id, setUsuarioId] = useState(123); // Usuario siempre 123


    const [userRating, setUserRating] = useState(0);

  

    const fetchComments = async () => {
      try {
          const response = await fetch(`https://croacky.onrender.com/comentario/obtenercomentarios/${evento.id}`);
          const data = await response.json();
          setComments(data);
      } catch (error) {
          console.error('Error obteniendo comentarios:', error);
      }
  };


    //useEffect(() => {
    //  const fetchUsuarioId = async () => {
    //    try {
    //      const storedUserId = await AsyncStorage.getItem('usuario_id');
     //     if (storedUserId) {
      //      setUsuarioId(storedUserId); // Guarda el usuario_id en el estado
    //      } else {
    //        Alert.alert('Error', 'No se encontró el usuario en el almacenamiento');
    //      }
    //    } catch (error) {
    //      console.error('Error obteniendo usuario_id:', error);
    //    }
   //   };
    
  //  fetchUsuarioId();
  //  fetchComments();
  //  fetchAverageRating();
  //}, [evento.id]);

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch('https://croacky.onrender.com/comentario/crear', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              evento_id: evento.id,
              usuario_id,
              content: newComment,
          }),
      });
      if (!response.ok) {  // Verifica el estado de la respuesta
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear comentario');
      }
      setNewComment('');
      fetchComments(); // Actualiza la lista de comentarios
} catch (error) {
    console.error('Error creando comentario:', error);
}
};
  
const fetchAverageRating = async () => {
  try {
      const response = await fetch(`https://croacky.onrender.com/valoracion/media/${evento.id}`);
      const data = await response.json();
      setAverageRating(data.averageRating);
  } catch (error) {
      console.error('Error obteniendo media de valoraciones:', );
  }
};

const handleRating = (rating) => {
  setUserRating(rating);  // Guarda el número de estrellas seleccionadas
};


return(
  <ScrollView style={styles.container}>
  <Image source={{ uri: evento.foto || 'https://via.placeholder.com/150' }} style={styles.image} />
  <Text style={styles.title}>{evento.nombre}</Text>
  <Text style={styles.info}>Descripción: {evento.descripcion}</Text>
  <Text style={styles.info}>Fecha: {evento.fecha}</Text>
  <Text style={styles.info}>Ubicación: {evento.ubicacion}</Text>
  <Text style={styles.info}>Aforo: {evento.aforo}</Text>
  <Text style={styles.info}>Temática: {evento.tematica}</Text>
  <Text style={styles.info}>Duración: {evento.duracion}</Text>

  <View style={styles.ratingContainer}>
      <Text style={styles.info}>Valoración Media: {averageRating.toFixed(1)}</Text>
      {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} onPress={() => handleRating(star)}>
              <Text style={userRating >= star ? styles.filledStar : styles.emptyStar}>★</Text>
          </TouchableOpacity>
      ))}
  </View>
  
  <TextInput
      style={styles.input}
      placeholder="Escribe tu comentario..."
      value={newComment}
      onChangeText={setNewComment}
  />
  <Button title="Enviar Comentario" onPress={handleCommentSubmit} />

  <Text style={styles.commentTitle}>Comentarios:</Text>
  {comments.map(comment => (
      <View key={comment.id} style={styles.comment}>
          <Text style={styles.commentUser}>Usuario {comment.usuario_id}:</Text>
          <Text style={styles.commentText}>{comment.content}</Text>
      </View>
  ))}
</ScrollView>
);
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    info: {
      fontSize: 16,
      marginBottom: 5,
    },

    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    filledStar: { color: 'gold', fontSize: 20 },
    emptyStar: { color: 'gray', fontSize: 20 },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    commentTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
    comment: { marginTop: 10, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
    commentUser: { fontWeight: 'bold' },
    commentText: { fontSize: 16 },


  });
  
  export default DetalleEvento;