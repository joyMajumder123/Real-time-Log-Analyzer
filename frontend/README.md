# Frontend - Real-Time Log Analyzer

A modern, high-performance React/Next.js dashboard for real-time log analytics with TanStack Query integration, dark theme, and rich UI components.

## Features 🚀

- **Real-Time Dashboard** - Live metrics and log streaming
- **Advanced Filtering** - Filter logs by service, level, status code
- **Rich Visualizations** - Interactive charts using Recharts
- **Service Monitoring** - Overview of all monitored services
- **Analytics** - Historical trends and data analysis
- **Dark Theme** - Modern dark UI with smooth transitions
- **Responsive Design** - Mobile-friendly interface
- **Type-Safe** - Full TypeScript support

## Tech Stack 🛠️

- **Frontend Framework**: [Next.js 14](https://nextjs.org/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Table Components**: [TanStack Table v8](https://tanstack.com/table/v8)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [Zustand](https://zustand-demo.vercel.app/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Language**: TypeScript 5.3+

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard
│   ├── logs/
│   │   └── page.tsx            # Log viewer with filters
│   ├── services/
│   │   └── page.tsx            # Service monitoring
│   ├── analytics/
│   │   └── page.tsx            # Historical analytics
│   └── settings/
│       └── page.tsx            # Configuration
├── components/
│   ├── Layout.tsx              # Sidebar, Header, Footer
│   ├── Button.tsx              # Reusable button component
│   ├── Card.tsx                # Card container
│   ├── Badge.tsx               # Status badges
│   ├── Charts.tsx              # Chart components
│   ├── DataTable.tsx           # Reusable table component
│   ├── MetricCard.tsx          # Metric display card
│   └── States.tsx              # Loading, Error, Empty states
├── hooks/
│   ├── useMetrics.ts           # API query hooks
│   └── useStore.ts             # Zustand stores
├── lib/
│   ├── api.ts                  # API client & React Query config
│   └── cn.ts                   # Class name utility
├── types/
│   └── index.ts                # TypeScript interfaces
├── styles/
│   └── globals.css             # Global styles
└── public/                     # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update API URL in .env.local if different
# NEXT_PUBLIC_API_URL=http://your-backend-url:8080
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Type Checking

```bash
npm run type-check
```

## API Integration

The frontend communicates with the backend via REST API. Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your backend instance.

### Expected API Endpoints

```
GET  /api/metrics              - Get current metrics
GET  /api/metrics/historical   - Get historical metrics
GET  /api/logs                 - Get logs with filters
GET  /api/services             - List all services
GET  /api/metrics/realtime     - Real-time metrics stream (SSE)
```

## Component Examples

### Metric Card

```tsx
<MetricCard
  title="Total Logs"
  value={1234}
  unit="entries"
  trend={12}
  description="Last 24 hours"
  icon="📊"
/>
```

### Data Table

```tsx
<DataTable
  data={logs}
  columns={columns}
  pagination={true}
  sorting={true}
/>
```

### Chart

```tsx
<LatencyChart
  data={timeSeriesData}
  title="Latency Trend"
/>
```

## Customization

### Theme Colors

Edit `tailwind.config.ts` to customize the color scheme:

```ts
colors: {
  primary: "hsl(210 100% 50%)",     // Blue
  secondary: "hsl(210 100% 35%)",   // Darker blue
  // ... more colors
}
```

### Dark Mode

The app uses Tailwind's dark mode. All components are optimized for dark theme by default. To support light mode, update the root layout:

```tsx
<html lang="en" className="dark light">
```

## Performance Optimization

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Data Caching**: TanStack Query with configurable stale time
- **Lazy Loading**: Dynamic imports for heavy components

## Browser Support

- Chrome/Edge ≥ 90
- Firefox ≥ 88
- Safari ≥ 14
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Guidelines

### Component Structure

```tsx
// Always use "use client" for interactive components
"use client";

import React from "react";
import { Card } from "@/components/Card";

export function MyComponent() {
  return <Card>{/* content */}</Card>;
}
```

### Styling

Use Tailwind CSS classes with the `cn()` utility for conditional styles:

```tsx
import { cn } from "@/lib/cn";

<div className={cn("base-class", condition && "conditional-class")} />
```

### Query Hooks

Always use TanStack Query hooks:

```tsx
const { data, isLoading, error } = useMetrics(service);
```

## Troubleshooting

### API Connection Issues

1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure backend is running
3. Check CORS settings on backend
4. Monitor browser network tab

### Build Errors

1. Clear `.next` directory: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npm run type-check`

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Components should be reusable and well-documented
4. Test locally before submitting changes

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)

## License

See LICENSE file in the root directory.

---

Built with ❤️ for Real-Time Log Analysis
