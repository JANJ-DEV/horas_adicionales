import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "../../src/components/Footer";

describe("Footer component", () => {
  it("renderiza el texto de copyright con el año actual", () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} JDNJ`)).toBeInTheDocument();
  });

  it("renderiza el enlace a LinkedIn con la URL correcta", () => {
    render(<Footer />);

    const linkedInLink = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedInLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/juan-antonio-valdivia-camacho-09598a279/"
    );
    expect(linkedInLink).toHaveAttribute("target", "_blank");
    expect(linkedInLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renderiza el enlace a GitHub con la URL correcta", () => {
    render(<Footer />);

    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/JuanDNJ");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renderiza el enlace al CV con la URL correcta", () => {
    render(<Footer />);

    const cvLink = screen.getByRole("link", { name: /cv/i });
    expect(cvLink).toHaveAttribute("href", "https://cv-juan.vercel.app/");
    expect(cvLink).toHaveAttribute("target", "_blank");
    expect(cvLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renderiza todos los enlaces del footer", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cv/i })).toBeInTheDocument();
  });
});
