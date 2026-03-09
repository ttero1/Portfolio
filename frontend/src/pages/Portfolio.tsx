import { Link } from "react-router-dom";

type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  external?: string;
  github?: string;
  demo?: string;
  status?: "Featured" | "In Progress" | "Shipped";
  featured?: boolean;
};

const TECH = [
  "C++",
  "TypeScript",
  "JavaScript",
  "React",
  "Node.js",
  "Docker",
  "NGINX",
  "Linux",
  "Networking",
  "SQL",
  "Git",
];

const PROJECTS: Project[] = [
  {
    title: "Web IRC Client + IRC Server",
    description:
      "Non-blocking IRC server written in C++ using poll() to manage multiple clients, authentication, channels, private messaging, and operator commands. A React + TypeScript web client visualizes live protocol behavior and server state.",
    tags: ["C++", "Sockets", "poll()", "Networking", "React", "TypeScript"],
    href: "/irc",
    github: "https://github.com/ttero1/IRC-Web-Client",
    status: "Featured",
    featured: true,
  },
  {
    title: "Clipboard OCR Extension",
    description:
      "Browser extension that converts clipboard images into text using Tesseract.js. Designed for a fast paste-to-extract workflow and lightweight in-browser OCR.",
    tags: ["JavaScript", "Tesseract.js", "Browser Extension"],
    external: "https://github.com/ttero1/OCR-extension",
    github: "https://github.com/ttero1/OCR-extension",
    status: "In Progress",
  },
  {
    title: "3D Cube (Three.js Demo)",
    description:
      "Interactive Three.js scene with orbit controls, animated shader background, bloom and outline post-processing, and real-time rotation controls. Built as a playground for WebGL rendering experiments.",
    tags: ["TypeScript", "Three.js", "WebGL", "Shaders"],
    href: "/cube",
    status: "Shipped",
  },
  {
    title: "Portfolio",
    description:
      "Personal portfolio built with React, TypeScript, and Tailwind. Designed to showcase systems and networking projects through live demos and clean technical presentation.",
    tags: ["React", "TypeScript", "Tailwind", "Vite"],
    external: "https://github.com/ttero1/Portfolio",
    github: "https://github.com/ttero1/Portfolio",
    status: "Shipped",
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      {children}
    </span>
  );
}

function StatusPill({ status }: { status: Project["status"] }) {
  if (!status) return null;

  const styles =
    status === "Featured"
      ? "border-purple-400/30 bg-purple-500/10 text-purple-200"
      : status === "Shipped"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      : "border-amber-400/30 bg-amber-500/10 text-amber-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${styles}`}
    >
      {status}
    </span>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const year = new Date().getFullYear();

  const featured = PROJECTS.find((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <section className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Hi, I'm <span className="text-purple-300">Teemu Tero</span>.
            </h1>

            <p className="mt-4 text-lg text-white/70 max-w-2xl">
              I build networked systems and developer tools, from
              non-blocking C++ servers to TypeScript interfaces that make
              complex behavior easy to test and demonstrate.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/irc"
                className="inline-flex items-center rounded-2xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700 transition"
              >
                Try the IRC demo →
              </Link>

              <a
                href="https://github.com/ttero1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold hover:bg-white/10 transition"
              >
                GitHub
              </a>
            </div>

            <div className="mt-8">
              <div className="text-sm font-semibold text-white/70">
                Technologies
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {TECH.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="lg:col-span-5">
            <Card>
              <div className="text-sm text-white/60">Engineering focus</div>

              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>• Non-blocking I/O and networking systems</li>
                <li>• Clear protocols and predictable state machines</li>
                <li>• Clean UI demos for complex backend behavior</li>
                <li>• Containerized deployments and infrastructure</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Featured Project */}
        {featured && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              Featured Project
            </h2>

            <div className="mt-6">
              <Card>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{featured.title}</h3>
                  <StatusPill status={featured.status} />
                </div>

                <p className="mt-3 text-white/70">{featured.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {featured.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>

                <div className="mt-6 flex gap-4">
                  {featured.href && (
                    <Link
                      to={featured.href}
                      className="text-purple-300 hover:text-purple-200"
                    >
                      Live demo →
                    </Link>
                  )}

                  {featured.github && (
                    <a
                      href={featured.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/70 hover:text-white"
                    >
                      Source code ↗
                    </a>
                  )}
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Other Projects */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">More Projects</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((p) => (
              <Card key={p.title}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{p.title}</h3>
                  <StatusPill status={p.status} />
                </div>

                <p className="mt-2 text-sm text-white/70">{p.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>

                <div className="mt-4 flex gap-3 text-sm">
                  {p.href && (
                    <Link to={p.href} className="text-purple-300">
                      Demo →
                    </Link>
                  )}

                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/70"
                    >
                      Source ↗
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-white/40">
          © {year} Teemu Tero
        </footer>
      </div>
    </div>
  );
}