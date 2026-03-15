import type { FC } from "react";
import { FaLinkedin, FaGithub, FaFileAlt } from "react-icons/fa";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      href: "https://www.linkedin.com/in/juan-antonio-valdivia-camacho-09598a279/",
      label: "LinkedIn",
      icon: FaLinkedin,
      ariaLabel: "Visitar mi LinkedIn",
    },
    {
      href: "https://github.com/JuanDNJ",
      label: "GitHub",
      icon: FaGithub,
      ariaLabel: "Visitar mi GitHub",
    },
    {
      href: "https://cv-juan.vercel.app/",
      label: "CV",
      icon: FaFileAlt,
      ariaLabel: "Ver mi CV",
    },
  ];

  return (
    <footer className="app-surface mt-auto w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm font-medium text-[var(--text-muted)]">© {currentYear} JDNJ</p>

        <nav aria-label="Enlaces sociales y profesional">
          <ul className="flex items-center gap-4">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2 text-sm font-medium text-[var(--text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                >
                  <link.icon size={16} aria-hidden="true" />
                  <span className="hidden sm:inline">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
