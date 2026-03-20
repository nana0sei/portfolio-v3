"use client";

const ErrorPage = () => {
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
};

export default ErrorPage;
