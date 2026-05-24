import DashboardLayout from '@/components/layout/dashboard-layout';

export const metadata = {
  title: 'Protected',
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
