import type { FC } from "react";
import VerticalScrollButton from "@/components/VerticalScrollButton";

type MainContentProps = {
  children?: React.ReactNode;
};

const MainContent: FC<MainContentProps> = ({ children }) => {
  return (
    <main className="px-4">
      {children}
      <VerticalScrollButton />
    </main>
  );
};

export default MainContent;
