import { CldImage } from "next-cloudinary";
import useCloudinary from "../hooks/useCloudinary";
import { Artwork } from "@/lib/entities";

interface Props {
  art: Artwork;
}
const ArtCard = ({ art }: Props) => {
  const { image } = useCloudinary(art.url);
  return (
    <>
      <div
        className="hover:scale-95 transition-transform overflow-clip cursor-pointer rounded-lg bg-slate-200 dark:bg-slate-100"
        onClick={() => {
          //@ts-expect-error: issue with daisy ui. works anyway
          document.getElementById(`modal-${art.url}`)!.showModal();
        }}
      >
        <CldImage src={art.url} width={600} height={600} alt="artwork" />
      </div>{" "}
      {/* dialog */}
      <dialog id={`modal-${art.url}`} className="modal">
        <div className="modal-box space-y-1 p-2 bg-white dark:text-black">
          <CldImage src={art.url} width={600} height={600} alt="artwork" />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ArtCard;
