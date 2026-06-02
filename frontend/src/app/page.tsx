import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, Zap, Shield, Users } from 'lucide-react';
import ChatWidget from '@/components/widget/ChatWidget';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Bot className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">MAXR</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Get Started
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  AI Customer Support, Done Right.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Deploy a production-ready AI chatbot on your website in minutes. 
                  Knowledge-aware, lead-capturing, and human-ready.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/register">Start Free Trial</Link>
                </Button>
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl">
                <Zap className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">RAG Knowledge Base</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Upload your docs and the AI learns your business instantly.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl">
                <Users className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">Lead Capture</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Convert visitors into leads with automated contact collection.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl">
                <Shield className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">Admin Takeover</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Jump into any conversation when a human touch is needed.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 MAXR AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
      <ChatWidget />
    </div>
  );
}
