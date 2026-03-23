import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useState } from "react"
import useAuthActions from "~/hooks/useAuthActions"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { forgotPassword, loading, error } = useAuthActions()

  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await forgotPassword(email)

      if (res) {
        setSuccess("Password reset link sent to your email")
      }
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your email to receive a reset link
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Success */}
              {success && (
                <p className="text-sm text-green-500 text-center">
                  {success}
                </p>
              )}

              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Remember your password?{" "}
                <a href="/login" className="underline">
                  Login
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Image Section */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="/Login-amico.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}