import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const { userId } = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">Welcome back! Here&apos;s an overview of your account.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your current plan and usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Active</p>
            <p className="text-sm text-[var(--muted-foreground)]">Free tier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-[var(--muted-foreground)]">Total actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User ID</CardTitle>
            <CardDescription>Your unique identifier</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono break-all">{userId}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}