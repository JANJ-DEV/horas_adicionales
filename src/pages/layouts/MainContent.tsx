import type { FC } from "react";
import VerticalScrollButton from "@/components/VerticalScrollButton";

type MainContentProps = {
  children?: React.ReactNode;
};

const MainContent: FC<MainContentProps> = ({ children }) => {
  return (
    <main className="app-page mt-4 min-w-0 max-w-full overflow-x-hidden md:mt-6 lg:mt-8">
      {children}
      <VerticalScrollButton />
    </main>
  );
};

export default MainContent;
