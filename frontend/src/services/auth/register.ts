import { signIn } from "next-auth/react";

interface RegisterProps {
  data: {
    email: string;
    name: string;
    password: string;
  };
}

export async function register({ data }: RegisterProps) {
  const res = await fetch(
    `${process.env.API_SERVER_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/dashboard",
    });
  }
}
