import type { FC } from "react";

type MainContentProps = {
  children?: React.ReactNode;
}

const MainContent: FC<MainContentProps> = ({ children }) => {
  return (
    <main className="px-4">
      {children}
    </main>
  )
}

export default MainContent;