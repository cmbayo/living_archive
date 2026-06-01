import { Neighborhood } from "@/types";

interface LotHeaderProps {
  name: string;
  neighborhood: Neighborhood | null;
  dateFounded: string | null;
  architectDesigner: string | null;
  publicSpace: boolean;
}

export default function LotHeader({
  name,
  neighborhood,
  dateFounded,
  architectDesigner,
  publicSpace,
}: LotHeaderProps) {
  return (
    <header className="lot-header">
      <h1 className="lot-name">{name}</h1>
      <div className="lot-meta">
        {neighborhood && <span>{neighborhood.name}</span>}
        {dateFounded && (
          <span>{new Date(dateFounded).getFullYear()}</span>
        )}
        {architectDesigner && <span>{architectDesigner}</span>}
        {publicSpace && <span>public space</span>}
      </div>
    </header>
  );
}