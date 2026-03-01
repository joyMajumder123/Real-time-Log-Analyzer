"use client";

import React from "react";
import { Bell, MoonStar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";

// user preferences - refresh rate, theme, notifications
export default function SettingsPage() {
  const [settings, setSettings] = React.useState({
    refreshInterval: 5,
    retentionDays: 30,
    darkMode: true,
    notifications: true,
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="headline">Settings</h1>
        <p className="subtle-text mt-1">Tune how your observability cockpit behaves and looks.</p>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Dashboard Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium block mb-2">
              Refresh Interval
            </label>
            <select
              value={settings.refreshInterval}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  refreshInterval: parseInt(e.target.value),
                })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-64"
            >
              <option value={2}>2 seconds</option>
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              How often to refresh dashboard data
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <label className="text-sm font-medium block mb-2">
              Data Retention
            </label>
            <select
              value={settings.retentionDays}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  retentionDays: parseInt(e.target.value),
                })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-64"
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              How long to keep historical data
            </p>
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MoonStar className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Currently enabled (dark theme)
                </p>
              </div>
            </div>
            <div className="h-6 w-12 rounded-full bg-primary" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">Alert notifications enabled</p>
              </div>
            </div>
            <div className="h-6 w-12 rounded-full bg-primary" />
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">API URL</label>
            <input
              type="text"
              value="http://localhost:8080"
              readOnly
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value="••••••••••••••••"
                readOnly
                className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm"
              />
              <Button variant="outline" size="sm">
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card variant="elevated" className="border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-300">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive" className="w-full sm:w-auto">
            Clear All Cache
          </Button>
          <p className="text-xs text-muted-foreground">
            This will clear your browser cache and you'll need to reload data
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="default">Save Settings</Button>
        <Button variant="outline">Reset to Default</Button>
      </div>
    </div>
  );
}
