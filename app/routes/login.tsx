import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Surgesport Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="Enter your email" />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="Enter your password" />
            </div>

            <Button className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
