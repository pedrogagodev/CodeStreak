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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email({ message: "Please, provide your email" }),
  name: z.string().min(1, { message: "Please, provide your name" }),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters" }),
});

type SignUpType = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const form = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", name: "", password: "" },
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-[85%] pt-6 pb-0">
        <CardHeader>
          <CardTitle className="text-lg">
            Create your CodeStreak account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
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
              <Button type="submit" className="font-semibold w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-accent/40 py-3 rounded-b-xl rounded-t-md">
          <div className="text-center w-full">
            Already have an account?{" "}
            <Link
              href={"/signin"}
              className="text-primary font-bold hover:text-black hover:cursor-pointer"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
