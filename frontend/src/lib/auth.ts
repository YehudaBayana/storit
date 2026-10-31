import { cookies } from "next/headers";
import { apiClient } from "@/api/apiClient";
import { getCurrentResponse } from "@/types/global.types";

export async function getSession(): Promise<getCurrentResponse> {
  // 1. Get the cookies that the user's browser sent to Next.js
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  // If no session cookie exists, user is not logged in
  if (!sessionCookie) {
    return null;
  }

  // Convert the cookies into a string format that the fetch function can read
  const cookieString = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const data = await apiClient<getCurrentResponse>(`/api/auth/me`, {
      headers: {
        // Forward the cookies to the backend so it knows who is asking
        Cookie: cookieString,
      },
      cache: "no-store",
    });

    // 3. If the backend says the user is not logged in, return null
    if (!data?.user) {
      return null;
    }

    // 4. Return the user data matching your getCurrentResponse type
    return data;
  } catch {
    return null;
  }
}
