'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, BookOpen, Calendar, BarChart2, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { logoutUser } from '@/features/auth/auth.actions'

type NavItem = { title: string; href: string; icon: React.ReactNode }

const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <Home size={18} /> },
  { title: 'Subjects', href: '/subjects', icon: <BookOpen size={18} /> },
  { title: 'Study-Desk', href: '/study-desk', icon: <BookOpen size={18} /> },
  { title: 'Planner', href: '/planner', icon: <Calendar size={18} /> },
  { title: 'Analytics', href: '/analytics', icon: <BarChart2 size={18} /> },
  { title: 'Settings', href: '/settings', icon: <Settings size={18} /> },
]

export default function Sidebar({ collapsed, onCollapseToggle }: { collapsed: boolean; onCollapseToggle: () => void }) {
  const pathname = usePathname() || '/dashboard'
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <aside className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 ${collapsed ? 'md:w-20' : 'md:w-64'} bg-white/6 backdrop-blur border-r border-gray-200 dark:border-gray-800 p-4`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-semibold">PL</div>
          {!collapsed && <span className="font-semibold">PLMS</span>}
        </div>
        <button onClick={onCollapseToggle} aria-label="Toggle sidebar" className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link href={item.href} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <div className={`flex items-center justify-center ${active ? 'text-white' : 'text-gray-500'}`}>{item.icon}</div>
                  {!collapsed && <span className="text-sm">{item.title}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 p-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          <LogOut size={16} />
          {!collapsed && <span>{isLoggingOut ? 'Signing out...' : 'Logout'}</span>}
        </button>
      </div>
    </aside>
  )
}

