import { AdvancedImage, lazyload } from "@cloudinary/react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cldImage } from "@/lib/cloudinary";
import type { CloudinaryImage } from "@/lib/entities";

interface Props {
  art: CloudinaryImage;
}

// Replaces next-cloudinary's <CldImage> with Cloudinary's <AdvancedImage>,
// driven by a url-gen CloudinaryImage (see lib/cloudinary.ts). Preserves the
// click-to-open dialog UX from the legacy app.
const ArtCard = ({ art }: Props) => {
  return (
    <>
      <Dialog>
        <DialogTrigger
          render={
            <button className="w-full rounded-lg overflow-clip hover:scale-95 transition-transform cursor-pointer">
              <AdvancedImage
                cldImg={cldImage(art.public_id)}
                width={500}
                height={500}
                alt="artwork"
                className="w-full h-auto block"
                plugins={[lazyload()]}
              />
            </button>
          }
        >
          Show Dialog
        </DialogTrigger>
        <DialogContent className={"min-w-fit bg-white"} showCloseButton={false}>
          <AdvancedImage
            cldImg={cldImage(art.public_id)}
            alt="artwork"
            className="max-h-[80vh] w-auto h-auto"
            plugins={[lazyload()]}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtCard;
