"use client"

import { signup } from "@/lib/actions/auth"
import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  return (
    <form action={action}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Name" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <Button disabled={pending} type="submit">
        Sign Up
      </Button>
    </form>
  )
}
