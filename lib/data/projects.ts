import loangrid from "@/app/assets/loangrid.png";
import portfolio from "@/app/assets/portfolio.png";
import faithhq from "@/app/assets/fhq.png";
import { Project } from "../entities";

const projects: Project[] = [
  {
    name: "loangrid",
    description: "a credit scoring and monitoring engine.",
    image: loangrid,
    link: "https://logicielghana.com/platorms/platforms/loangrid",
    git: "",
    tools: ["nextjs", "tailwind", "shadcn/ui"],
  },

  {
    name: "portfolio",
    description:
      "you can see my dev projects, art and recently played music here.",
    image: portfolio,
    link: "https://www.nanaosei.xyz",
    git: "",
    tools: ["react", "typescript", "tailwind"],
  },

  {
    name: "faith hq",
    description: "a church management system",
    image: faithhq,
    link: "https://logicielghana.com/platorms/platforms/fathhq",
    git: "",
    tools: [],
  },
];

export default projects;
