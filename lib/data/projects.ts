import loangrid from "@/app/assets/loangrid.png";
import portfolio from "@/app/assets/portfolio.png";
import { Project } from "../entities";

const projects: Project[] = [
  {
    name: "loangrid",
    description:
      "a credit scoring engine designed for financial institutions, government programs, and development partners to assess creditworthiness of beneficiaries quickly and accurately. built for scalability and easy integration, the system enables responsible lending, minimizes risk, and promotes financial inclusion for underserved populations.",
    image: loangrid,
    link: "https://logicielghana.com/platorms/platforms/loangrid",
    git: "",
    tools: ["nextjs", "tailwind", "shadcn/ui"],
  },

  {
    name: "portfolio",
    description: "here.",
    image: portfolio,
    link: "https://www.nanaosei.xyz",
    git: "",
    tools: ["react", "typescript", "tailwind"],
  },
];

export default projects;
