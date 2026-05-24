 import Link from 'next/link';

const features = [
  {
    title: 'Smart study planning',
    description: 'Create structured learning plans for subjects, topics, and tasks with ease.',
  },
  {
    title: 'Progress tracking',
    description: 'Visualize study streaks, task completion, and knowledge growth over time.',
  },
  {
    title: 'Central note management',
    description: 'Store notes, upload resources, and keep everything connected to your study flow.',
  },
];



export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-12 lg:p-16">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-sky-400/20 via-transparent to-transparent blur-3xl" />
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-slate-800/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
                PLMS
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Focus faster, track smarter, and learn with clarity.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                PLMS brings subjects, notes, topics, and planner tools together in a modern study workspace designed for productivity.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-2xl bg-sky-400 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Start studying
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40 ring-1 ring-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between rounded-3xl bg-slate-950/70 p-5 text-slate-50">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Your study hub</p>
                  <h2 className="mt-3 text-2xl font-semibold">Weekly mastery score</h2>
                </div>
                <div className="rounded-3xl bg-slate-800/90 px-4 py-3 text-xs uppercase tracking-[0.24em] text-slate-300">
                  84%
                </div>
              </div>
              <div className="mt-8 space-y-5">
                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                  <p className="text-sm text-slate-400">Study streak</p>
                  <p className="mt-3 text-3xl font-semibold text-white">6 days</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                  <p className="text-sm text-slate-400">Notes saved</p>
                  <p className="mt-3 text-3xl font-semibold text-white">28 entries</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10"
            >
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-4 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 grid gap-10 rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Study tracking</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Keep every milestone visible</h2>
            <p className="max-w-xl text-slate-300 leading-8">
              Build confidence by tracking progress across subjects, topics, and note completion. PLMS helps you see what’s done, what’s next, and where you can speed up.
            </p>
            <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <span className="inline-flex rounded-full bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200">
                Daily study reminders
              </span>
              <span className="inline-flex rounded-full bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200">
                Notes & resource sync
              </span>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40 ring-1 ring-white/10">
            <div className="grid gap-6">
              <div className="rounded-3xl bg-slate-900/80 p-6">
                <p className="text-sm text-sky-300">Next review</p>
                <p className="mt-3 text-2xl font-semibold text-white">Physics exam prep</p>
                <p className="mt-2 text-slate-400">2 days left • 4 topics remaining</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-6">
                <p className="text-sm text-slate-400">Focus session</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-3/5 rounded-full bg-sky-400" />
                </div>
                <p className="mt-3 text-sm text-slate-300">60% complete toward today’s target</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-white/10 bg-gradient-to-r from-sky-500/15 via-slate-900/10 to-indigo-500/15 p-10 shadow-2xl shadow-slate-950/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">Take action</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Launch your personal learning system today.</h2>
              <p className="mt-4 text-slate-300 leading-8">
                Join PLMS to organize your notes, track your progress, and turn your study plan into accomplishments.
              </p>
            </div>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-slate-100"
            >
              Get started free
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
