'use client'

import React from 'react'
import Link from 'next/link'
import { Home, BookOpen, Calendar, BarChart2, Settings, X } from 'lucide-react'

type Props = { open: boolean; onClose: () => void }

const NAV_ITEMS = [
  { title: 'Dashboard', href: '/dashboard', icon: <Home size={18} /> },
  { title: 'Subjects', href: '/subjects', icon: <BookOpen size={18} /> },
  { title: 'Study-Desk', href: '/study-desk', icon: <BookOpen size={18} /> },
  { title: 'Planner', href: '/planner', icon: <Calendar size={18} /> },
  { title: 'Analytics', href: '/analytics', icon: <BarChart2 size={18} /> },
  { title: 'Settings', href: '/settings', icon: <Settings size={18} /> },
]

export default function MobileSidebar({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-lg p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-semibold">PL</div>
            <span className="font-semibold">PLMS</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>

        <nav>
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={onClose} className="flex items-center gap-3 p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div>{item.icon}</div>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
