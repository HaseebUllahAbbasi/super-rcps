import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex flex-col space-y-4 min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Image src={"/logo.png"} alt="Logo" width={200} height={200} />
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600">Enter your credentials below to access your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

