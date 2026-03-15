import type { AuthResponse } from "@/types/auth";

/** Google id_token ile backend'e giriş yap, AuthResponse döner */
export async function authWithGoogle(idToken: string): Promise<AuthResponse> {
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message ?? data.error ?? "Giriş başarısız");
  }

  return data as AuthResponse;
}
