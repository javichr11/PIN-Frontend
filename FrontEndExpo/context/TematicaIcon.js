import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

const TematicaIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="6,9 10,3 14,9" /> {/* Triángulo con la punta hacia arriba */}
    <Rect x="3" y="13" width="6" height="6" /> {/* Cuadrado */}
    <Circle cx="16" cy="16" r="3.5" /> {/* Círculo */}
  </Svg>
);

const PostAddIcon = () => (
  <Svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FA6A44"><Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240v80H200v560h560v-240h80v240q0 33-23.5 56.5T760-120H200Zm440-400v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z"/></Svg>
);

export default {TematicaIcon, PostAddIcon};
