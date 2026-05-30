"use server";
import { signIn, signOut } from "@/auth";

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return { error: "Credenciais inválidas." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
