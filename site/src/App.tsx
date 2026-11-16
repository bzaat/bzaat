import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { FileDown, Github, Linkedin, Mail } from "lucide-react";
import { profile, projects } from "./data";
import { ValCurves } from "./components/ValCurves";
import { Publications } from "./components/Publications";
import { Projects } from "./components/Projects";
import { ProjectDrawer } from "./components/ProjectDrawer";
import { Stack } from "./components/Stack";
import { ThemeDock } from "./components/ThemeDock";
import { AmbientCanvas } from "./components/fx/AmbientCanvas";
import { HeroVideo } from "./components/fx/HeroVideo";
import { useTheme } from "./theme";
import { castAt, useSpells } from "./spells";
import { SpellLayer } from "./components/fx/SpellLayer";
import { SpellToggle } from "./components/SpellToggle";
import { ChibiCast } from "./components/ChibiCast";
import { DuelCutscene } from "./components/fx/DuelCutscene";

const cvHref = `${import.meta.env.BASE_URL}${profile.cv}`;
const projectFromHash = () => {
  const m = window.location.hash.match(/^#project-(.+)$/);
  return m && projects.some((p) => p.id === m[1]) ? m[1] : null;
};

export default function App() {
  const [openId, setOpenId] = useState<string | null>(() => projectFromHash());

  // Deep links: #project-<id> opens that project's drawer.
  useEffect(() => {
    const onHash = () => setOpenId(projectFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const open = useCallback((id: string) => {
    history.replaceState(null, "", `#project-${id}`);
    setOpenId(id);
  }, []);
  const close = useCallback(() => {
    if (window.location.hash.startsWith("#project-")) history.replaceState(null, "", "#projects");
    setOpenId(null);
  }, []);

  const project = projects.find((p) => p.id === openId) ?? null;
  const theme = useTheme();
  const spells = useSpells();
  const revelio = (e: MouseEvent<HTMLElement>) => castAt(e.currentTarget, "Revelio!");

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-amber px-4 py-2 font-medium text-amber-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          <a href="#top" className="hidden font-display font-semibold tracking-wide sm:block">
            Khanh Nguyen Pham
          </a>
          <ul className="flex items-center text-sm sm:gap-2">
            {[
              ["#publications", "Publications"],
              ["#projects", "Projects"],
              ["#stack", "Stack"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="inline-flex min-h-11 items-center rounded-md px-1.5 text-muted hover:text-text sm:px-2.5">
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={cvHref}
                download
                onClick={revelio}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-1.5 text-amber hover:underline sm:ml-1 sm:px-2.5"
              >
                <FileDown aria-hidden="true" className="size-4" />
                CV
              </a>
            </li>
            <li>
              <SpellToggle />
            </li>
          </ul>
        </nav>
      </header>

      <main id="main" className="pb-24">
        {/* Hero: the looping video sits behind the chibi cast and the frosted ResNet-50 card */}
        <div className="relative isolate overflow-hidden">
        <section id="top" aria-labelledby="hero-title" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-ok/40 px-3.5 py-1.5 text-sm">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-ok" />
              <span>{profile.availability}</span>
            </p>
            <p className="mt-2 pl-1 text-sm text-muted">{profile.availabilityDetail}</p>

            <div className="mt-8 flex items-center gap-5">
              <img
                src={`${import.meta.env.BASE_URL}${profile.photo}`}
                alt="Portrait of Pham Nguyen Khanh Nguyen"
                width={480}
                height={675}
                fetchPriority="high"
                className="h-[6.75rem] w-20 shrink-0 rounded-md border border-line-strong object-cover md:h-36 md:w-28"
              />
              <h1 id="hero-title" className="glow-title min-w-0 font-display text-4xl font-semibold leading-[1.1] md:text-5xl">
                {profile.name}
              </h1>
            </div>
            <p className="mt-6 max-w-[34ch] text-xl leading-snug md:text-2xl">
              Applied machine learning and computer vision, tested against honest baselines.
            </p>
            <p className="mt-5 max-w-[56ch] text-muted">
              I build models from the ground up, measure what actually made them work, and report what the numbers
              support. My research direction is embodied AI and world models: perception that feeds decisions in the
              physical world.
            </p>

            <dl className="mt-8 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">Education</dt>
                <dd>
                  {profile.education}
                  <span className="block text-muted">{profile.graduation}</span>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Focus</dt>
                <dd>Computer vision, embodied AI, world models</dd>
              </div>
              <div>
                <dt className="text-muted">Roles of interest</dt>
                <dd>{profile.roles}</dd>
              </div>
              <div>
                <dt className="text-muted">Languages</dt>
                <dd>{profile.spoken}</dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={cvHref}
                download
                onClick={revelio}
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-amber px-4 font-medium text-amber-ink hover:bg-amber/90"
              >
                <FileDown aria-hidden="true" className="size-4" />
                Download CV
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line-strong px-4 hover:border-text"
              >
                <Github aria-hidden="true" className="size-4" />
                <span className="font-mono text-sm">{profile.githubHandle}</span>
                <span className="sr-only">on GitHub (opens in a new tab)</span>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line-strong px-4 hover:border-text"
              >
                <Mail aria-hidden="true" className="size-4" />
                Email me
              </a>
            </div>
          </div>

          <div className="relative mt-40 lg:col-span-6 lg:mt-36">
          <HeroVideo theme={theme} still={!spells} className="-inset-x-10 -top-64 -bottom-16 sm:-inset-x-20 lg:-inset-x-24 lg:-top-72" />
          <ChibiCast theme={theme} />
          <figure className="fx-card hero-glass rounded-lg p-4 md:p-6">
            <ValCurves />
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line pt-4 text-sm text-muted">
              <span className="max-w-[46ch]">
                Same ResNet-50, two starting points. Mean validation accuracy over three seeds, 37 pet breeds.
              </span>
              <button
                type="button"
                onClick={() => open("resnet50")}
                aria-haspopup="dialog"
                className="min-h-11 cursor-pointer font-medium text-steel underline decoration-steel/40 underline-offset-4 hover:decoration-steel"
              >
                See the experiment
              </button>
            </figcaption>
          </figure>
          </div>
        </section>
        </div>

        <div className="mx-auto max-w-6xl space-y-28 px-4 pb-28 md:px-8">
          <Publications />
          <Projects onOpen={open} />
          <Stack />
        </div>
      </main>

      <footer className="border-t border-line bg-raised">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-14 pb-28 md:grid-cols-12 md:px-8">
          <div className="md:col-span-6">
            <h2 className="font-display text-2xl font-semibold">Get in touch</h2>
            <p className="mt-3 max-w-[48ch] text-muted">
              Looking for an AI or deep learning internship from February to April 2027 in Malaysia. Email is the fastest way
              to reach me.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-5 inline-flex min-h-11 items-center font-mono text-lg text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
            >
              {profile.email}
            </a>
          </div>
          <ul className="flex flex-col gap-1 text-sm md:col-span-4 md:col-start-9">
            <li>
              <a className="inline-flex min-h-11 items-center gap-2 hover:text-amber" href={profile.github} target="_blank" rel="noreferrer">
                <Github aria-hidden="true" className="size-4" /> GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className="inline-flex min-h-11 items-center gap-2 hover:text-amber" href={profile.linkedin} target="_blank" rel="noreferrer">
                <Linkedin aria-hidden="true" className="size-4" /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a className="inline-flex min-h-11 items-center gap-2 hover:text-amber" href={cvHref} download onClick={revelio}>
                <FileDown aria-hidden="true" className="size-4" /> Download CV (PDF)
              </a>
            </li>
            <li className="mt-4 text-muted">{profile.location}</li>
            <li className="text-muted">AITA Lab reading group on federated learning, Oct 2025 to Feb 2026.</li>
          </ul>
        </div>
      </footer>

      <ProjectDrawer project={project} onClose={close} />
      {spells && <AmbientCanvas theme={theme} />}
      <SpellLayer />
      <DuelCutscene />
      <ThemeDock />
    </>
  );
}
