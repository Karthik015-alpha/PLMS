'use client'

import React from 'react'
import { Search, Bell, Menu, User } from 'lucide-react'

type Props = { onMobileMenuToggle?: () => void }

export default function Navbar({ onMobileMenuToggle }: Props) {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/50 backdrop-blur p-3 md:p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={onMobileMenuToggle} aria-label="Open menu">
            <Menu size={18} />
          </button>

          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-3 flex-1">
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1 w-full max-w-md">
            <Search size={16} className="text-gray-500" />
            <input placeholder="Search..." className="bg-transparent flex-1 ml-2 outline-none text-sm text-gray-700 dark:text-gray-200" />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><Bell size={18} /></button>
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center"><User size={16} /></div>
          </div>
        </div>
      </div>
    </header>
  )
}

