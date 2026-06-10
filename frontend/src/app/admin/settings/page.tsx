'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function SettingsPage() {
  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your AI assistant, branding, and account preferences.
        </p>
      </div>

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          <TabsTrigger value="widget">Widget Branding</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Engine Settings</CardTitle>
              <CardDescription>
                Configure the core behavior and provider for your assistant.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">AI Provider</Label>
                <select id="provider" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>OpenAI (GPT-4o-mini)</option>
                  <option>Groq (Llama 3 70B)</option>
                  <option>Anthropic (Claude 3.5 Sonnet)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt">System Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="You are a helpful customer support assistant for MAXR..."
                  rows={6}
                  defaultValue="You are a helpful customer support assistant for MAXR. Your goal is to answer questions based on the provided knowledge base. If you don't know the answer, politely ask for the user's email so a human agent can follow up."
                />
                <p className="text-xs text-muted-foreground">
                  The system prompt defines the personality and rules for the AI.
                </p>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Lead Capture</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically ask for contact info when a question is outside knowledge.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="widget">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Appearance</CardTitle>
              <CardDescription>
                Customize how the chat widget looks on your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input id="primary-color" defaultValue="#0f172a" />
                    <div className="h-10 w-10 rounded border bg-[#0f172a]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="widget-name">Assistant Name</Label>
                  <Input id="widget-name" defaultValue="MAXR Assistant" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcome-msg">Welcome Message</Label>
                <Input id="welcome-msg" defaultValue="Hello! How can we help you today?" />
              </div>
              <div className="space-y-2">
                <Label>Widget Position</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="position" defaultChecked />
                    <span className="text-sm">Bottom Right</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="position" />
                    <span className="text-sm">Bottom Left</span>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Branding</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your profile and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="admin@maxr.io" disabled />
                </div>
              </div>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
