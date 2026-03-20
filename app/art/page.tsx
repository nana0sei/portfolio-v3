import art from "@/app/assets/arttitle.png";
import Image from "next/image";

const ArtPage = () => {
  return (
    <>
      <div className="h-screen space-y-2">
        <div className="flex justify-center">
          <Image src={art} alt="art" width={250} height={250} />
        </div>
      </div>
    </>
  );
};

export default ArtPage;
