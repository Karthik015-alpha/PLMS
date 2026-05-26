'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'
import ProfilePopover from './profile-popover'

type Props = { onMobileMenuToggle?: () => void }

export default function Navbar({ onMobileMenuToggle }: Props) {
  const pathname = usePathname()

  // Resolve title dynamically from the active route
  const getPageTitle = () => {
    if (!pathname) return 'Dashboard'
    
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return 'Dashboard'
    
    const lastSegment = segments[segments.length - 1]
    
    // Format segments cleanly
    const title = lastSegment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      
    if (title === 'Dashboard') return 'Dashboard'
    if (title === 'Study Desk') return 'Study Desk'
    
    // Check nested route directories
    if (segments.includes('subjects')) {
      if (segments.includes('topics')) {
        if (segments.includes('notes')) {
          if (pathname.endsWith('/edit')) return 'Edit Note'
          if (pathname.endsWith('/create')) return 'Create Note'
          return 'Note View'
        }
        if (pathname.endsWith('/edit')) return 'Edit Topic'
        if (pathname.endsWith('/create')) return 'Create Topic'
        return 'Topic View'
      }
      if (pathname.endsWith('/edit')) return 'Edit Subject'
      if (pathname.endsWith('/create')) return 'Create Subject'
      return 'Subject View'
    }
    
    return title
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/60 backdrop-blur-md p-3 md:p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onMobileMenuToggle}
            aria-label="Open menu"
            suppressHydrationWarning
          >
            <Menu size={18} />
          </button>

          <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              suppressHydrationWarning
            >
              <Bell size={18} />
            </button>
            <ProfilePopover />
          </div>
        </div>
      </div>
    </header>
  )
}

