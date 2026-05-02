import { C } from '../../theme/colors';

export function QiblaCompass() {
  return (
    <svg viewBox="0 0 110 110" width="108" height="108">
      <circle cx="55" cy="55" r="50" fill="white" stroke={C.border} strokeWidth="1.2" />
      <circle cx="55" cy="55" r="40" fill="none" stroke={C.border} strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="55" cy="55" r="28" fill="none" stroke={C.border} strokeWidth="0.6" />
      <text x="55" y="10"  textAnchor="middle" fill={C.textDark}  fontSize="10" fontWeight="700">N</text>
      <text x="55" y="104" textAnchor="middle" fill={C.textLight} fontSize="9">S</text>
      <text x="103" y="59" textAnchor="middle" fill={C.textLight} fontSize="9">E</text>
      <text x="7"   y="59" textAnchor="middle" fill={C.textLight} fontSize="9">O</text>
      {[["NO",18,18],["NE",92,18],["SE",92,95],["SO",18,95]].map(([d,x,y])=>(
        <text key={String(d)} x={Number(x)} y={Number(y)} textAnchor="middle" fill={C.textLight} fontSize="7" opacity="0.6">{d}</text>
      ))}
      <g transform="rotate(245,55,55)">
        <polygon points="55,18 59,52 55,57 51,52" fill={C.green} />
        <polygon points="55,57 59,80 55,92 51,80" fill="#C8D8C4" />
        <rect x="49" y="13" width="12" height="9" rx="1.5" fill={C.green} opacity="0.9" />
        <rect x="51" y="14.5" width="8" height="6" rx="1" fill="white" opacity="0.25" />
      </g>
      <circle cx="55" cy="55" r="5.5" fill={C.green} />
      <circle cx="55" cy="55" r="2.5" fill="white" />
    </svg>
  );
}