// dateFormatter.js
const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  export const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
  
    return `${dia} ${mes}, ${año}`;
  };
  
  export const formatearHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };