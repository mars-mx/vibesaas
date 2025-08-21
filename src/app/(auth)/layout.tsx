import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | VibeSaaS",
  description: "Sign in or create your VibeSaaS account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}