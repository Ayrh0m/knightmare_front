interface PieceProps {
  type: string;
  color: "w" | "b";
}

export default function Piece({ type, color }: PieceProps) {
    const fileName = `${color}_${type}.svg`;
  return <img src={`/pieces/${fileName}`} alt={type} className="piece"/>;
}
