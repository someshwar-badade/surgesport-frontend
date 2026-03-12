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
import { useNavigate } from "react-router"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { error, userRegister, loading } = useAuthActions();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "1"
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await userRegister(form);

    if (res) {
      navigate("/login");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className=" p-0">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-balance text-muted-foreground">
                  Sign up to get started
                </p>
              </div>
              
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                  }}
                  required
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="********"
                  value={form.password_confirmation}
                  onChange={(e) => {
                    setForm({ ...form, password_confirmation: e.target.value });
                  }}
                  required
                />
              </Field>
              
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Select 
                    value={form.role_id} 
                    onValueChange={(value) => setForm({ ...form, role_id: value })}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="1">User</SelectItem>
                    <SelectItem value="2">Admin</SelectItem>
                    </SelectContent>
                </Select>
                </Field>
              
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </Field>
              
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
              
              <FieldDescription className="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}