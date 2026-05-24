'use client'

import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/50 backdrop-blur p-4">
      <div className="max-w-7xl mx-auto text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
        <div>PLMS &copy; {new Date().getFullYear()}</div>
        <div>Built with ❤️</div>
      </div>
    </footer>
  )
}
