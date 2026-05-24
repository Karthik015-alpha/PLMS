import { Metadata } from 'next';
import DashboardLayout from '@/components/layout/dashboard-layout';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Dashboard',
  },
  description: 'Access your learning dashboard with progress tracking, subject overview, and activity feed.',
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
