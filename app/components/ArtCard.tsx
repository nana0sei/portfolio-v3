import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Artwork } from "@/lib/entities";
import { CldImage } from "next-cloudinary";

interface Props {
  art: Artwork;
}
const ArtCard = ({ art }: Props) => {
  return (
    <>
      <Dialog>
        <DialogTrigger
          render={
            <button className="rounded-lg overflow-clip hover:scale-95 transition-transform cursor-pointer">
              <CldImage src={art.url} width={600} height={600} alt="artwork" />
            </button>
          }
        >
          Show Dialog
        </DialogTrigger>
        <DialogContent className={"min-w-fit"} showCloseButton={false}>
          <CldImage src={art.url} width={600} height={600} alt="artwork" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtCard;
