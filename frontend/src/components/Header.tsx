"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function Header() {
  const { data: session, status } = useSession();

  const isSignedIn = status === "authenticated";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 min-w-full items-center justify-between px-2 md:px-10">
        <Link href={"/"}>
          <div className="flex items-center gap-2 hover:cursor-pointer">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Image
                src="/githubLogo.svg"
                alt="CodeStreak Logo"
                width={40}
                height={40}
              />
            </div>
            <span className="md:text-xl font-bold">CodeStreak</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button onClick={() => signOut({ redirectTo: "/" })} />
            </div>
          ) : (
            <div className="flex gap-4 items-center justify-center">
              <Link
                href="/signin"
                className="text-sm font-medium hover:text-primary"
              >
                Log in
              </Link>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
