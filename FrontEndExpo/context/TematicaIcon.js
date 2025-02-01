import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

const TematicaIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="6,9 10,3 14,9" /> {/* Triángulo con la punta hacia arriba */}
    <Rect x="3" y="13" width="6" height="6" /> {/* Cuadrado */}
    <Circle cx="16" cy="16" r="3.5" /> {/* Círculo */}
  </Svg>
);

const PostAddIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 10v6M16 13h6" /> {/* Símbolo de "+" */}
    <Path d="M5 20h14a2 2 0 0 0 2-2v-5" /> {/* Parte superior */}
    <Path d="M19 10V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" /> {/* Contorno */}
    <Path d="M9 6h6M9 10h6M9 14h2" /> {/* Líneas del documento */}
  </Svg>
);

export default {TematicaIcon, PostAddIcon};
