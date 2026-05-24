'use client'

type SubjectProgressProps = {
  value: number
}

export default function SubjectProgress({ value }: SubjectProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
        <span>Completion</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-lime-400 to-sky-500 transition-all" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
      </div>
    </div>
  )
}
