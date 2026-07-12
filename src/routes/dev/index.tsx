import { createFileRoute } from "@tanstack/react-router";
import devTitle from "@/assets/devtitle.png";
import DevCard from "@/components/custom/DevCard";
import projects from "@/lib/data/projects";

export const Route = createFileRoute("/dev/")({ component: DevPage });

function DevPage() {
  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <img src={devTitle} alt="dev" width={250} height={250} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <DevCard project={project} key={project.name} />
        ))}
      </div>
    </div>
  );
}
