import loangrid from "@/app/assets/loangrid.png";
import portfolio from "@/app/assets/portfolio.png";
import fhq from "@/app/assets/fhq.png";

import { Project } from "../entities";

const projects: Project[] = [
  {
    name: "loangrid",
    description: "a credit scoring and monitoring engine.",
    image: loangrid,
    link: "https://logicielghana.com/platorms/platforms/loangrid",
    git: "",
    tools: ["nextjs", "shadcn/ui", "tanstack query"],
  },

  {
    name: "portfolio",
    description:
      "you can see my dev projects, art and recently played music here.",
    image: portfolio,
    link: "https://www.nanaosei.xyz",
    git: "",
    tools: [
      "nextjs",
      "shadcn/ui",
      "tanstack query",
      "cloudinary",
      "spotify api",
    ],
  },

  {
    name: "faith hq",
    description: "a church management system",
    image: fhq,
    link: "https://logicielghana.com/platorms/platforms/fathhq",
    git: "",
    tools: ["nextjs", "daisy ui", "tanstack query", "redux"],
  },
];

export default projects;
