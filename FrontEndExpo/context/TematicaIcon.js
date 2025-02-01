import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

const TematicaIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="6,9 10,3 14,9" /> {/* Triángulo con la punta hacia arriba */}
    <Rect x="3" y="13" width="6" height="6" /> {/* Cuadrado */}
    <Circle cx="16" cy="16" r="3.5" /> {/* Círculo */}
  </Svg>
);

export default TematicaIcon;
