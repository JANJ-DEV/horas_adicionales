import type { FC } from "react";
import VerticalScrollButton from "@/components/VerticalScrollButton";

type MainContentProps = {
  children?: React.ReactNode;
};

const MainContent: FC<MainContentProps> = ({ children }) => {
  return (
    <main className="min-w-0 max-w-full overflow-x-hidden px-4">
      {children}
      <VerticalScrollButton />
    </main>
  );
};

export default MainContent;
