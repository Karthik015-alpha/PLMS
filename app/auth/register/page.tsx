import RegisterForm from '../../../components/forms/register-form'

export const metadata = {
  title: 'Register',
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="w-full max-w-xl">
        <div className="mx-auto">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
