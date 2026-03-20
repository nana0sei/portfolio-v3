import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Artwork, CloudinaryImage } from "@/lib/entities";
import { CldImage } from "next-cloudinary";

interface Props {
  art: CloudinaryImage;
}
const ArtCard = ({ art }: Props) => {
  return (
    <>
      <Dialog>
        <DialogTrigger
          render={
            <button className="rounded-lg overflow-clip hover:scale-95 transition-transform cursor-pointer">
              <CldImage
                src={art.public_id}
                width={600}
                height={600}
                alt="artwork"
              />
            </button>
          }
        >
          Show Dialog
        </DialogTrigger>
        <DialogContent className={"min-w-fit bg-white"} showCloseButton={false}>
          <CldImage
            src={art.public_id}
            width={600}
            height={600}
            alt="artwork"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtCard;
