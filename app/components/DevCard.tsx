import { AiFillGithub } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import placeholder from "../assets/placeholder.png";
import { Project } from "../entities/Project";

interface Props {
  project: Project;
}

const DevCard = ({ project }: Props) => {
  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <figure>
          <img src={project.image || placeholder} alt={project.name} />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            <div className="flex gap-1">
              <p> {project.name}</p>
              {project.link && (
                <Link
                  to={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiExternalLink size="25px" />
                </Link>
              )}

              {project.git && (
                <Link
                  to={project.git}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
