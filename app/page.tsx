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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-8 shadow-xl dark:shadow-none backdrop-blur-xl sm:p-12 lg:p-16">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-sky-400/20 via-transparent to-transparent blur-3xl" />
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-sky-50 dark:bg-slate-800/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">
                PLMS
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Focus faster, track smarter, and learn with clarity.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                PLMS brings subjects, notes, topics, and planner tools together in a modern study workspace designed for productivity.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-sky-400 dark:hover:bg-sky-300 px-6 py-3 text-base font-semibold text-white dark:text-slate-950 transition shadow-lg shadow-indigo-500/25 dark:shadow-sky-500/25"
                >
                  Start studying
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-slate-100 dark:bg-slate-900/80 p-8 shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl">
              <div className="flex items-center justify-between rounded-3xl bg-white dark:bg-slate-950/70 p-5 border border-slate-200 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 shadow-sm dark:shadow-none">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Your study hub</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">Weekly mastery score</h2>
                </div>
                <div className="rounded-3xl bg-slate-200 dark:bg-slate-800/90 px-4 py-3 text-xs uppercase tracking-[0.24em] text-slate-600 dark:text-sky-300 font-semibold">
                  84%
                </div>
              </div>
              <div className="mt-8 space-y-5">
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950/60 p-5 shadow-sm dark:shadow-none">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Study streak</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">6 days</p>
                </div>
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950/60 p-5 shadow-sm dark:shadow-none">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Notes saved</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">28 entries</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[2rem] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-8 shadow-xl dark:shadow-none backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl dark:hover:bg-slate-900/70"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-4 text-slate-600 dark:text-slate-300">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 grid gap-10 rounded-[2rem] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-10 shadow-xl dark:shadow-none backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Study tracking</p>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">Keep every milestone visible</h2>
            <p className="max-w-xl text-slate-600 dark:text-slate-300 leading-8">
              Build confidence by tracking progress across subjects, topics, and note completion. PLMS helps you see what’s done, what’s next, and where you can speed up.
            </p>
            <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                Daily study reminders
              </span>
              <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                Notes & resource sync
              </span>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/80 p-8 shadow-inner dark:shadow-none">
            <div className="grid gap-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-none">
                <p className="text-sm text-sky-600 dark:text-sky-300 font-semibold">Next review</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">Physics exam prep</p>
                <p className="mt-2 text-slate-500 dark:text-slate-400">2 days left • 4 topics remaining</p>
              </div>
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-none">
                <p className="text-sm text-slate-500 dark:text-slate-400">Focus session</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full w-3/5 rounded-full bg-sky-500 dark:bg-sky-400" />
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">60% complete toward today’s target</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-sky-100/50 to-indigo-100/50 dark:from-sky-500/15 dark:via-slate-900/10 dark:to-indigo-500/15 p-10 shadow-xl dark:shadow-none backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-300">Take action</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">Launch your personal learning system today.</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-8">
                Join PLMS to organize your notes, track your progress, and turn your study plan into accomplishments.
              </p>
            </div>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 dark:bg-white px-8 py-4 text-base font-semibold text-white dark:text-slate-950 shadow-lg shadow-indigo-500/20 dark:shadow-sky-500/20 transition hover:bg-indigo-700 dark:hover:bg-slate-100"
            >
              Get started free
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
