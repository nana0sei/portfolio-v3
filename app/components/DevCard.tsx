import placeholder from "@/app/assets/placeholder.png";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/lib/entities";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";

interface Props {
  project: Project;
}

const DevCard = ({ project }: Props) => {
  return (
    <>
      <Card className="shadow-xl">
        <Image
          width={1000}
          height={1000}
          src={project.image || placeholder}
          alt={project.name}
          className="w-full object-cover"
        />
        <CardContent className="space-y-1">
          <div className="flex gap-1 items-center">
            <p className="font-bold text-lg"> {project.name}</p>
            {project.link && (
              <Link
                href={project.link}
                target="_blank"
                className="hover:text-blue-400"
              >
                <SquareArrowOutUpRight size={20} />
              </Link>
            )}

            {project.git && (
              <Link href={project.git} target="_blank">
                <AiFillGithub size={20} />
              </Link>
            )}
          </div>
          <p className="italic">{project.description}</p>
        </CardContent>
      </Card>
    </>
  );
};

export default DevCard;
