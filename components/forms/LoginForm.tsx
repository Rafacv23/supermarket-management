"use client"

import { signup } from "@/lib/actions/auth"
import { useActionState, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader, LogIn } from "lucide-react"

export function LoginForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  return (
    <form action={action} className="grid grid-cols-1 gap-8">
      <div>
        <Label htmlFor="name" className="mb-4">
          Nombre
        </Label>
        <Input id="name" name="name" placeholder="Nombre" />
      </div>
      {state?.errors?.name && (
        <p className="bg-destructive text-destructive-foreground rounded p-2 text-sm">
          {state.errors.name}
        </p>
      )}

      <div>
        <Label htmlFor="password" className="mb-4">
          Contraseña
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
          />
          <Button type="button" onClick={() => setShowPassword(!showPassword)}>
            {!showPassword ? (
              <span className="flex items-center gap-2">
                <Eye size={16} /> Mostrar
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <EyeOff size={16} /> Ocultar
              </span>
            )}
          </Button>
        </div>
      </div>
      {state?.errors?.password && (
        <div className="bg-destructive text-destructive-foreground rounded p-2 text-sm">
          <p>Error:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <Button disabled={pending} type="submit" className="w-full">
        {pending ? (
          <span className="flex items-center gap-2">
            <Loader size={16} className="animate-spin" /> Iniciando sesión...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn size={16} /> Iniciar sesión
          </span>
        )}
      </Button>
    </form>
  )
}
