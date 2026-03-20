import Image from "next/image";
import dev from "@/app/assets/devtitle.png";
import DevCard from "../../components/custom/DevCard";
import projects from "@/lib/data/projects";

const DevPage = () => {
  return (
    <>
      <div className="h-screen space-y-2">
        <div className="flex justify-center">
          <Image src={dev} alt="dev" width={250} height={250} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-32">
          {projects.map((project) => (
            <DevCard project={project} key={project.name} />
          ))}
        </div>
      </div>
    </>
  );
};

export default DevPage;
