import { AiFillGithub } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import placeholder from "@/app/assets/placeholder.png";
import { Project } from "@/lib/entities";
import Image from "next/image";
import Link from "next/link";

interface Props {
  project: Project;
}

const DevCard = ({ project }: Props) => {
  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <figure>
          <Image
            width={1000}
            height={1000}
            src={project.image || placeholder}
            alt={project.name}
            className="w-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            <div className="flex gap-1">
              <p> {project.name}</p>
              {project.link && (
                <Link href={project.link} target="_blank">
                  <FiExternalLink size="25px" />
                </Link>
              )}

              {project.git && (
                <Link href={project.git} target="_blank">
                  <AiFillGithub size="25px" />
                </Link>
              )}
            </div>
          </h2>
          <p className="italic">{project.description}</p>
        </div>
      </div>
    </>
  );
};

export default DevCard;
