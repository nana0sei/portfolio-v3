import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ThemeProvider } from "next-themes";

import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/custom/Footer";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nana Osei" },
      { name: "description", content: "Nana Osei's Portfolio" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  notFoundComponent: NotFound,
  errorComponent: ErrorPage,
  shellComponent: RootDocument,
});

// Ported from legacy app/not-found.tsx (404).
function NotFound() {
  return (
    <div className="h-full">
      <div className="flex h-screen items-center justify-center">
        <div className="flex gap-2 items-center">
          <h3 className="text-2xl font-bold border-r px-2">404</h3> Page not
          found
        </div>
      </div>
    </div>
  );
}

// Ported from legacy app/error.tsx (500).
function ErrorPage() {
  return (
    <div className="h-full">
      <div className="flex flex-col h-screen items-center justify-center space-y-2">
        <div className="flex gap-2 items-center">
          <h3 className="text-2xl font-bold border-r px-2">500</h3> Something
          went wrong
        </div>

        <div></div>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex-1 no-scrollbar space-y-2 px-2">
            <Navbar />
            {children}
          </div>
          <Footer />
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
