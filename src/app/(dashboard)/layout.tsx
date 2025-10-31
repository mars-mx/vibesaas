import { Metadata } from "next";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/features/dashboard/components/layout/dashboard-layout';

export const metadata: Metadata = {
  title: "Dashboard | VibeSaaS",
  description: "Your VibeSaaS dashboard",
};

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <DashboardLayout hideSidebar={true}>{children}</DashboardLayout>;
}