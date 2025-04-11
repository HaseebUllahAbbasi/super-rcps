"use client";
import { logout } from "@/action/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoaderPinwheel } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function LogoutLoading() {
  useEffect(() => {
    (async () => {
        
        await logout();
      })();
  }, []);

  return (
    <div className="flex w-full min-h-screen  bg-background  items-center justify-center ">
      <div
        className="w-full p-5"
      >
        <Image
          src="/logo.png"
          className="mx-auto"
          alt="Logo"
          width={300}
          height={120}
        />
        <Card className="w-full   border shadow-none bg-transparent border-none ">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">
              Logging Out
            </CardTitle>
            <CardDescription className="text-gray-600">
              Please wait while we log you out...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <LoaderPinwheel className="h-10 w-10 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
