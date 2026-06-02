import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold tracking-tight">MAXR</h1>
          <p className="text-sm text-muted-foreground">
            AI-Powered Customer Support Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
