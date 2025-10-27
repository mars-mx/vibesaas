# VibeSaaS ⚡

**Ship your SaaS in 24 hours** - Production-ready boilerplate with everything you need to launch fast.

## 🚀 What's Included

- **Next.js + Vercel** - Instant deployment with the best DX
- **Convex** - Real-time backend that just works
- **Polar** - Payments and subscriptions handled
- **shadcn/ui** - Beautiful, accessible components
- **Claude-native** - Built for AI-assisted development with CLAUDE.md

Stop building auth, payments, and UI from scratch. Start shipping.

## ✨ Features

### Core Stack
- 🎯 **Next.js 14** with App Router
- 🔥 **Convex** for real-time database & backend
- 💳 **Polar** integration for payments via Convex component
- 🎨 **shadcn/ui** component library
- 🔐 **Clerk** for authentication (80+ OAuth providers)
- 📧 **Resend** for transactional emails
- 🎭 **TypeScript** throughout

### Developer Experience
- 🤖 **Claude-native** with custom commands
- 📝 **CLAUDE.md** for AI-powered development
- 🔧 **Pre-configured** ESLint & Prettier
- ✅ **Zod** for schema validation and type safety
- 📦 **pnpm** for fast, efficient package management
- 🚢 **One-click deploy** to Vercel

### Production Ready
- 💪 **Type-safe** from database to frontend
- 🔄 **Real-time updates** out of the box
- 📊 **Analytics ready** with Vercel Analytics
- 🛡️ **Security best practices** built-in
- 📱 **Responsive design** by default

## 🏃‍♂️ Quick Start

```bash
# Clone the repository
git clone https://github.com/mars-mx/vibesaas.git
cd vibesaas

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

## 🔧 Setup Guide

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file with:

```env
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Polar (set via Convex environment)
# npx convex env set POLAR_ORGANIZATION_TOKEN xxxxx

# Resend (Email)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Convex Setup

```bash
npx convex dev
```

### 4. Zod + Convex Integration

This boilerplate includes `convex-helpers` for enhanced type validation:

```typescript
// Example: Using Zod with Convex functions
import { z } from "zod";
import { zCustomMutation } from "convex-helpers/server/zod";

export const createUser = zCustomMutation({
  args: {
    email: z.string().email(),
    name: z.string().min(2),
  },
  handler: async (ctx, args) => {
    // Fully validated and typed arguments
    return await ctx.db.insert("users", args);
  },
});
```

### 5. Polar Integration with Convex

VibeSaaS uses the `@convex-dev/polar` component for deep integration between Polar payments and Convex:

```bash
# Install the Convex Polar component
npm install @convex-dev/polar

# Configure in convex.config.ts
import polar from "@convex-dev/polar/convex.config";
app.use(polar);

# Set your Polar organization token
npx convex env set POLAR_ORGANIZATION_TOKEN xxxxx
```

Key features:
- Automatic subscription synchronization via webhooks
- Built-in subscription tracking per user
- OAuth integration for customer authentication
- Server-side checkout and portal link generation
- Real-time subscription status updates

```typescript
// Example: Get user's subscription
const subscription = await polar.getCurrentSubscription(ctx, {
  userId: user._id
});

// Example: Generate checkout link
const checkoutUrl = await polar.generateCheckoutLink(ctx, {
  productId: "prod_xxxxx",
  userId: user._id
});
```

**Authentication Integration**: VibeSaaS uses Clerk for authentication, which integrates seamlessly with Convex and Polar. See the [Integration Guide](./docs/backend/integration.md) for details on the complete auth-to-payment flow.

### 6. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mars-mx/vibesaas)

## 🤖 Claude-Native Development

VibeSaaS is built to work seamlessly with Claude. Use the included `CLAUDE.md` file for:

- Custom commands for common tasks
- AI-assisted feature development
- Automated code generation
- Smart refactoring suggestions

```bash
# Example Claude commands
claude add-feature "user dashboard"
claude setup-payment-plan "pro"
claude generate-api-endpoint "webhooks"
```

## 📁 Project Structure

```
vibesaas/
├── src/
│   ├── app/                    # Next.js 14+ App Router
│   │   ├── (marketing)/       # Public pages (route group)
│   │   │   ├── page.tsx      # Landing page
│   │   │   ├── pricing/      # Pricing page
│   │   │   └── layout.tsx    # Marketing layout
│   │   ├── (auth)/           # Authentication flow (route group)
│   │   │   ├── login/        # Login page
│   │   │   ├── signup/       # Signup page
│   │   │   └── layout.tsx    # Auth layout
│   │   ├── (dashboard)/      # Protected app (route group)
│   │   │   ├── overview/     # Dashboard home
│   │   │   ├── settings/     # User settings
│   │   │   └── layout.tsx    # Dashboard layout
│   │   ├── api/              # API routes
│   │   │   ├── webhooks/     # Webhook handlers
│   │   │   └── trpc/         # tRPC endpoints (optional)
│   │   └── globals.css       # Global styles
│   ├── features/             # Feature-based modules
│   │   ├── auth/            # Authentication feature
│   │   ├── dashboard/       # Dashboard features
│   │   ├── billing/         # Polar integration
│   │   └── shared/          # Shared features
│   ├── components/          # Global components
│   │   ├── ui/             # shadcn/ui primitives
│   │   ├── common/         # Shared business components
│   │   └── sections/       # Page sections
│   ├── lib/                # Utilities & configs
│   │   ├── actions/        # Server Actions
│   │   ├── api/           # API client utilities
│   │   ├── convex/        # Convex client setup
│   │   ├── polar/         # Polar SDK setup
│   │   └── utils/         # Helper functions
│   ├── hooks/             # Global React hooks
│   ├── stores/            # State management (Zustand)
│   └── types/             # TypeScript definitions
├── convex/                # Convex backend
│   ├── _generated/       # Auto-generated files
│   ├── schema.ts        # Database schema
│   ├── auth.config.ts   # Auth configuration
│   └── functions/       # Server functions
├── public/              # Static assets
├── tests/              # Test files
└── CLAUDE.md          # AI development guide
```

## 🎯 Use Cases

Perfect for building:
- SaaS products
- AI applications
- Marketplaces
- Subscription services
- Developer tools
- Content platforms

## 🏗️ Convex Service Architecture

### Service Layer Pattern
VibeSaaS implements a state-of-the-art service layer architecture for Convex:

```typescript
// convex/services/users/index.ts
export class UserService {
  static createUser = internalMutation({
    args: userSchema.create,
    handler: async (ctx, args) => {
      // Business logic layer
      await UserValidator.validateUnique(ctx, args.email);
      const processed = await this.processUserData(args);
      return UserRepository.create(ctx, processed);
    }
  });
}
```

### Repository Pattern
Data access is abstracted through repositories:

```typescript
// convex/repositories/base.repository.ts
export abstract class BaseRepository<T> {
  async findById(ctx, id) { /* ... */ }
  async create(ctx, data) { /* ... */ }
  async update(ctx, id, data) { /* ... */ }
  async delete(ctx, id) { /* ... */ }
}
```

### Function Organization
- **Public API**: Exposed to client via `index.ts`
- **Internal Functions**: Protected business logic in `_internal.ts`
- **Actions**: External API calls in separate service classes
- **Validation**: Zod schemas with `convex-helpers` integration

### Convex Project Structure
```
convex/
├── features/           # Feature-based modules
│   ├── auth/
│   │   ├── index.ts    # Public exports
│   │   ├── mutations.ts
│   │   ├── queries.ts
│   │   ├── actions.ts
│   │   ├── _internal.ts # Internal functions
│   │   └── schemas.ts
│   └── billing/
├── services/           # Business logic services
├── repositories/       # Data access layer
└── lib/               # Shared utilities
```

## 🛠️ Tech Stack Details

### Frontend
- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Zod for validation

### Backend
- Convex for database & real-time
- Server functions with TypeScript
- Built-in auth system
- File storage support
- Zod + Convex integration via convex-helpers
- Service layer architecture with repositories

### Payments
- Polar integration via Convex component
- Subscription management
- Usage-based billing support
- Webhook handling
- OAuth customer authentication
- Customer portal generation

### Deployment
- Optimized for Vercel
- Edge-ready
- Automatic CI/CD
- Preview deployments

## 🧪 Testing

VibeSaaS uses **Vitest** for lightning-fast unit testing with zero configuration. Test both Next.js components and Convex functions with a unified testing strategy.

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

**Testing Stack:**
- **Vitest** - ~5x faster than Jest with native TypeScript/JSX support
- **React Testing Library** - User-focused component testing
- **convex-test** - Mock Convex backend for unit tests
- **MSW** - API mocking for integration tests

See the [Testing Guide](./docs/testing/basics.md) for comprehensive documentation on writing and running tests.

## 🎨 Frontend Best Practices

VibeSaaS follows modern web development standards for 2025:

### Design System
- **Accessibility-First**: WCAG 2.2 Level AA compliant
- **Performance Optimized**: Core Web Vitals targets met
- **Mobile-First**: Responsive from 375px up
- **Component-Driven**: shadcn/ui with CVA patterns

### Quick Links
- [Accessibility Guide](./docs/design/accessibility.md) - WCAG compliance & testing
- [Performance Guide](./docs/design/performance.md) - Core Web Vitals optimization
- [Responsive Design](./docs/design/responsive.md) - Mobile-first patterns
- [Component Patterns](./docs/design/components.md) - shadcn/ui architecture
- [Theme Configuration](./docs/design/theme-config.md) - CSS custom properties

## 📚 Documentation

- [Setup Guide](./docs/setup.md)
- [Clerk + Convex + Polar Integration](./docs/backend/integration.md)
- [Testing Guide](./docs/testing/basics.md)
- [Claude Commands](./CLAUDE.md)
- [API Reference](./docs/api.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is fully **free and open source** under the MIT License.

## 💜 Support

If you find VibeSaaS helpful, I'd appreciate an **[𝕏 follow](https://x.com/marsc_hb)** - that way you won't miss any updates!

---

Built with ❤️ for developers who ship fast.

**Stop configuring. Start shipping.** 🚀