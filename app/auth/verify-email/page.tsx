import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-center text-2xl">Check Your Email</CardTitle>
            <CardDescription className="text-center">We've sent you a verification link</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-sm text-gray-600">
              Please check your email and click the verification link to activate your account. Once verified, you can
              log in to access the system.
            </p>
            <Link href="/auth/login" className="text-sm text-blue-600 underline underline-offset-4 hover:text-blue-700">
              Back to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
