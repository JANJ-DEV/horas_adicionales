import type { FC } from "react";

type MainContentProps = {
  children?: React.ReactNode;
}

const MainContent: FC<MainContentProps> = ({ children }) => {
  return (
    <main className="p-4">
      {children}
    </main>
  )
}

export default MainContent;