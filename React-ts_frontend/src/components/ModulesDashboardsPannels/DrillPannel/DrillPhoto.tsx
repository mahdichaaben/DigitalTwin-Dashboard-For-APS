// DrillPhoto.tsx
import drillImg from "@/assets/drill_real_img.png"; // adjust path relative to this file

interface DrillPhotoProps {
  alt?: string;
  className?: string;
}

const DrillPhoto: React.FC<DrillPhotoProps> = ({ alt = "Drill Machine", className }) => {
  return (
    <>
      <img
        src={drillImg}
        alt={alt}
        className="rounded-xl shadow-lg max-w-full h-auto object-cover"/>
 </>
  );
};

export default DrillPhoto;
