"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { logout } from "@/action/auth";

export default function LogoutLoading() {
  useEffect(() => {
    (async () => {
        
        await logout();
      })();
  }, []);

  return (
    <div className="flex w-full min-h-screen   items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full p-5"
      >
        <Image
          src="/logo.png"
          className="mx-auto"
          alt="Logo"
          width={300}
          height={120}
        />
        <Card className="w-full   border shadow-none border-none ">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">
              Logging Out
            </CardTitle>
            <CardDescription className="text-gray-600">
              Please wait while we log you out...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
