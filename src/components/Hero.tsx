import type { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const Hero: FC<Props> = ({ children }) => {
  return (
    <section
      className={`bg-overlay-50 grid items-center justify-center gap-4 text-center h-screen max-h-[90vh] lg:max-h-[83vh] -mx-4`}
    >
      {children}
    </section>
  );
};

export default Hero;
