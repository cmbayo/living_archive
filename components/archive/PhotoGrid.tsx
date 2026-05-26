import { Media } from "@/types";

interface PhotoGridProps {
  photos: Media[];
  lotName: string;
}

export default function PhotoGrid({ photos, lotName }: PhotoGridProps) {
  if (photos.length === 0) return null;

  return (
    <div className="photo-grid">
      {photos.map(photo => (
        <img
          key={photo.id}
          src={photo.url}
          alt={lotName}
          className="photo"
        />
      ))}
    </div>
  );
}