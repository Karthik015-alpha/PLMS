import LoginForm from '../../../components/forms/login-form'

export const metadata = {
  title: 'Login',
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 transition-colors duration-300">
      <LoginForm />
    </div>
  )
}
