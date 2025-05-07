"use server"

import { FormState, SignupFormSchema } from "@/lib/definitions"
import { prisma } from "../prisma"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, password } = validatedFields.data

  const user = await prisma.user.findUnique({
    where: {
      name: name,
      password: password,
    },
  })

  if (!user) {
    return {
      message:
        "No se ha encontrado ningun usuario con ese nombre o contraseña.",
    }
  }

  await createSession(user.id)

  redirect("/")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
