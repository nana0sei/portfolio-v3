"use client";
import { PropsWithChildren } from "react";
import QueryClientProvider from "./QueryClientProvider";
import ThemeProvider from "./ThemeProvider";

const Provider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ThemeProvider attribute={"class"} defaultTheme="dark" enableSystem>
        <QueryClientProvider>{children}</QueryClientProvider>
      </ThemeProvider>
    </>
  );
};

export default Provider;
