import { Link } from "react-router-dom";

type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;     // internal route
  external?: string; // external link
  status?: "Featured" | "In Progress" | "Shipped";
};

const TECH = [
  "C++",
  "TypeScript",
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
      "Non-blocking IRC server in C++ (poll()), plus a web client to demo channels, PMs, and operator commands.",
    tags: ["C++", "poll()", "Sockets", "React", "TypeScript"],
    href: "/irc",
    status: "Featured",
  },
  {
  title: "3D Cube (Three.js Demo)",
  description:
    "Interactive Three.js scene with orbit controls, animated gradient shader background, bloom + outline post-processing, and rotation toggle.",
  tags: ["TypeScript", "Three.js", "WebGL", "Shaders"],
  href: "/cube", 
  status: "Featured",
  },
  {
    title: "Portfolio (This Site)",
    description:
      "Personal portfolio built with React + TypeScript + Tailwind. Clean UI, project cards, and internal demos.",
    tags: ["React", "TypeScript", "Tailwind", "Vite"],
    external: "https://github.com/ttero1/Portfolio", 
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute right-[-120px] top-[35%] h-[360px] w-[360px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute left-[-140px] top-[55%] h-[360px] w-[360px] rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center">
              <span className="text-sm font-bold text-white/80">YN</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm text-white/60">Portfolio</div>
              <div className="font-semibold tracking-tight">Teemu Tero</div>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-2">
            <a
              href="#projects"
              className="rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
            >
              Projects
            </a>
            <a
              href="#about"
              className="rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
            >
              About
            </a>
            <a
              href="#contact"
              className="rounded-xl px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
            >
              Contact
            </a>
          </nav>
        </header>

        {/* Hero */}
        <section className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Hi, I'm <span className="text-purple-300">Teemu Tero</span>.
            </h1>
            <p className="mt-4 text-lg text-white/70 max-w-2xl">
              Software developer focused on{" "}
              <span className="text-white">systems</span>,{" "}
              <span className="text-white">networking</span>, and{" "}
              <span className="text-white">web</span>. I build reliable backends,
              clean interfaces, and tooling that's easy to maintain.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/irc"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700 transition"
              >
                Open Web IRC Client
                <span className="transition group-hover:translate-x-0.5">→</span>
              </Link>

              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
              >
                View projects
              </a>
            </div>

            {/* Tech chips */}
            <div className="mt-8">
              <div className="text-sm font-semibold text-white/70">
                Tech I use
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {TECH.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Stats / Highlights */}
          <div className="lg:col-span-5">
            <Card className="h-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-white/60">Currently</div>
                  <div className="mt-1 text-xl font-semibold">
                    Building networking tools + web demos
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                  {year}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-bold">C++</div>
                  <div className="mt-1 text-xs text-white/60">
                    Systems focus
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-bold">TS</div>
                  <div className="mt-1 text-xs text-white/60">
                    Web + tooling
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-bold">TLS</div>
                  <div className="mt-1 text-xs text-white/60">
                    Infra-minded
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-4">
                <div className="text-sm font-semibold">What I care about</div>
                <ul className="mt-2 space-y-2 text-sm text-white/70">
                  <li className="flex gap-2">
                    <span className="text-purple-300">•</span>
                    Correctness, clean APIs, and predictable behavior
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-300">•</span>
                    Performance where it matters, simplicity everywhere else
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-300">•</span>
                    Shipping demos that prove the system works
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
              <p className="mt-1 text-white/60">
                A few things I've built recently.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {PROJECTS.map((p) => {
              const isInternal = Boolean(p.href);
              const isExternal = Boolean(p.external);

              const Wrapper = ({ children }: { children: React.ReactNode }) => {
                if (isInternal) {
                  return (
                    <Link
                      to={p.href!}
                      className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                    >
                      {children}
                    </Link>
                  );
                }
                if (isExternal) {
                  return (
                    <a
                      href={p.external}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                    >
                      {children}
                    </a>
                  );
                }
                return <div className="block rounded-2xl">{children}</div>;
              };

              return (
                <Wrapper key={p.title}>
                  <Card className="group hover:bg-white/[0.05] transition">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{p.title}</h3>
                          <StatusPill status={p.status} />
                        </div>
                        <p className="mt-2 text-sm text-white/70">
                          {p.description}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                        {isInternal ? "Demo" : isExternal ? "Link" : "Details"}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>

                    {isInternal && (
                      <div className="mt-5 text-sm font-semibold text-purple-200">
                        Open →
                      </div>
                    )}
                  </Card>
                </Wrapper>
              );
            })}
          </div>
        </section>

        {/* About */}
        <section id="about" className="mt-14 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Card>
              <h2 className="text-2xl font-bold tracking-tight">About</h2>
              <p className="mt-3 text-white/70">
                I enjoy building systems where the “invisible parts” matter:
                protocols, state machines, performance constraints, and
                deployment. I like projects that combine low-level correctness
                with a clean UI for demoing and testing.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Systems</div>
                  <p className="mt-1 text-sm text-white/70">
                    Non-blocking I/O, memory ownership, and predictable runtime.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Networking</div>
                  <p className="mt-1 text-sm text-white/70">
                    Sockets, protocols, and server architecture.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Web</div>
                  <p className="mt-1 text-sm text-white/70">
                    TypeScript frontends that make complex projects easy to
                    demo.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Infra</div>
                  <p className="mt-1 text-sm text-white/70">
                    TLS, reverse proxies, containerization, and environments.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card>
              <h3 className="text-lg font-semibold">Quick links</h3>
              <div className="mt-4 space-y-2">
                <Link
                  to="/irc"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition"
                >
                  <span className="text-white/90">Web IRC Demo</span>
                  <span className="text-purple-200">→</span>
                </Link>

                <a
                  href="https://github.com/ttero1"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition"
                >
                  <span className="text-white/90">GitHub</span>
                  <span className="text-white/60">↗</span>
                </a>
              </div>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mt-14">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
                <p className="mt-1 text-white/60">
                  Want to collaborate or chat? Reach out.
                </p>
              </div>

              <a
                href="mailto:teemu.tero92@gmail.com"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 font-semibold text-black hover:bg-white/90 transition"
              >
                Email me
              </a>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Location</div>
                <div className="mt-1 text-sm text-white/70">
                  Espoo / Remote
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Focus</div>
                <div className="mt-1 text-sm text-white/70">
                  Systems + Networking
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Stack</div>
                <div className="mt-1 text-sm text-white/70">
                  C++ / TS / Docker
                </div>
              </div>
            </div>
          </Card>
        </section>

        <footer className="mt-10 pb-10 text-center text-xs text-white/40">
          © {year} Teemu Tero. Built with React + Tailwind.
        </footer>
      </div>
    </div>
  );
}

