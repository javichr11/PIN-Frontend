import Svg, { Path, Line, Circle, Rect, Polygon } from 'react-native-svg';

const TematicaIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="6,9 10,3 14,9" /> {/* Triángulo con la punta hacia arriba */}
    <Rect x="3" y="13" width="6" height="6" /> {/* Cuadrado */}
    <Circle cx="16" cy="16" r="3.5" /> {/* Círculo */}
  </Svg>
);

const PostAddIcon = () => (
  <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={'#FA6A44'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Rectángulo sin la esquina superior derecha */}
      <Path d="M4 6h10v10H6a2 2 0 0 1-2-2V6z" />
      {/* Signo "+" en la parte superior derecha */}
      <Line x1="18" y1="8" x2="22" y2="8" />
      <Line x1="20" y1="6" x2="20" y2="10" />
    </Svg>
);

export { TematicaIcon, PostAddIcon };
