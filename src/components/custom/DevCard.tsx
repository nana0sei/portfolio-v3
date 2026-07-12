import placeholder from "@/assets/placeholder.png";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/lib/entities";
import { SquareArrowOutUpRight } from "lucide-react";
import { AiFillGithub } from "react-icons/ai";

interface Props {
  project: Project;
}

const DevCard = ({ project }: Props) => {
  return (
    <>
      <Card className="shadow-xl">
        <img
          src={project.image || placeholder}
          alt={project.name}
          className="w-full object-cover"
        />
        <CardContent className="space-y-1">
          <div className="flex gap-1 items-center">
            <p className="font-bold text-lg"> {project.name}</p>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400"
              >
                <SquareArrowOutUpRight size={20} />
              </a>
            )}

            {project.git && (
              <a href={project.git} target="_blank" rel="noreferrer">
                <AiFillGithub size={20} />
              </a>
            )}
          </div>
          <p className="italic">{project.description}</p>
          <div className="flex flex-wrap gap-1 pt-1">
            {project.tools.map((tool) => (
              <Badge key={tool} variant="secondary">
                {tool}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DevCard;
