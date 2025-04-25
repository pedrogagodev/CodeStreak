"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SeparatorWithText } from "@/components/SeparatorWithText";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const signInSchema = z.object({
  email: z.string().email({ message: "Please, provide your email" }),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters" }),
});

type SignInType = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [isCredentialsError, setIsCredentialsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setIsCredentialsError(false);
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result?.ok) {
        return;
      }

      if (result?.ok) {
        router.push("/dashboard");
      }
      setIsLoading(false);
    } catch (error) {
      setIsCredentialsError(true);
      setIsLoading(false);
    }
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-[85%] pt-6 pb-0 md:w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isCredentialsError && (
                  <div className="text-red-500 text-sm">
                    Invalid email or password, please try again.
                  </div>
                )}
                <Button
                  type="submit"
                  className="font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "... Loading" : "Sign in"}
                </Button>
              </div>

              <span>
                <SeparatorWithText text="OR" />
              </span>
              <Button
                type="button"
                className="font-bold w-full hover:cursor-pointer"
                variant={"outline"}
                onClick={() => signIn("github", { callbackUrl: "/" })}
              >
                <Image
                  src="/githubLogo.svg"
                  alt="Github Logo"
                  width={28}
                  height={28}
                />
                Sign in with Github
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-accent/40 py-3 rounded-b-xl rounded-t-md">
          <div className="text-center w-full">
            New to CodeStreak?{" "}
            <Link
              href={"/signup"}
              className="text-primary font-bold hover:text-black hover:cursor-pointer"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
