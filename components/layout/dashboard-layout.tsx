'use client'

import React, { useState } from 'react'
import Sidebar from './sidebar'
import MobileSidebar from './mobile-sidebar'
import Navbar from './navbar'
import Footer from './footer'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarWidthClass = collapsed ? 'md:ml-20' : 'md:ml-64'

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar collapsed={collapsed} onCollapseToggle={() => setCollapsed((s) => !s)} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className={`flex-1 flex flex-col transition-all duration-200 ${sidebarWidthClass}`}>
        <Navbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <main className="flex-1 p-6 md:p-8 w-full">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
