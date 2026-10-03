"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export function ContactRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/about/#contact"); }, [router]);
  return null;
}
