# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**IMPORTANT**: Before running any development server commands (`npm run dev`, `npx convex dev`, etc.), ALWAYS check if there are existing background processes running to avoid port conflicts and duplicate services. Use `lsof -i :3000` for Next.js and `lsof -i :5432` for database services, or check active processes with `ps aux | grep -E '(node|convex)'`. Kill any conflicting processes before starting new ones.

```bash
# Check for existing processes first
lsof -i :3000  # Check if port 3000 is in use
ps aux | grep -E '(node|convex|next)'  # Check for running Node/Convex processes

# Start development server with Turbopack
npm run dev

# Start Convex development server (in separate terminal)
npx convex dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Project Architecture

This is a Next.js 15 application with App Router, designed as a SaaS boilerplate. The project uses:

- **Next.js 15.4.7** with App Router and Turbopack
- **React 19** 
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** for styling
- **Polar** integration for payments (@polar-sh/nextjs)
- **Zod** for schema validation and type-safe parsing
- **Path alias**: `@/*` maps to `./src/*`

## Project Structure

The codebase follows a feature-based architecture as outlined in the README:

- `src/app/` - Next.js App Router pages and layouts
  - `(marketing)/` - Public pages route group
  - `(auth)/` - Authentication flow route group  
  - `(dashboard)/` - Protected app route group
  - `api/` - API routes and webhooks
- `src/features/` - Feature-based modules (auth, dashboard, billing, shared)
- `src/components/` - Reusable components
  - `ui/` - shadcn/ui primitives
  - `common/` - Shared business components
  - `sections/` - Page sections
- `src/lib/` - Utilities and configurations
  - `actions/` - Server Actions
  - `api/` - API client utilities
  - `convex/` - Convex client setup (when configured)
  - `polar/` - Polar SDK setup
  - `utils/` - Helper functions
- `src/hooks/` - Custom React hooks
- `src/stores/` - State management (Zustand)
- `src/types/` - TypeScript type definitions
- `convex/` - Convex backend (when configured)

## Key Integration Points

### Convex Setup
The project is designed to use Convex for real-time backend. Run `npx convex dev` to start the Convex development server after configuring environment variables.

### Zod + Convex Integration

This project uses Zod for schema validation in combination with Convex. The `convex-helpers` package provides utilities for seamless integration:

#### Installation
```bash
npm install zod convex-helpers
```

#### Usage Pattern
```typescript
import { z } from "zod";
import { zCustomQuery, zCustomMutation, zid } from "convex-helpers/server/zod";
import { query, mutation } from "./_generated/server";

// Create Zod-enabled query/mutation wrappers
const zQuery = zCustomQuery(query, NoOp);
const zMutation = zCustomMutation(mutation, NoOp);

// Example with Zod validation
export const createUser = zMutation({
  args: {
    email: z.string().email(),
    name: z.string().min(2).max(100),
    age: z.number().min(18).optional(),
  },
  handler: async (ctx, args) => {
    // args are fully typed and validated
    return await ctx.db.insert("users", args);
  },
});
```

#### Best Practices
1. Use Zod for function argument validation (more refined than Convex's built-in validators)
2. Leverage `zid("tableName")` for validating Convex document IDs
3. Share Zod schemas between frontend and backend for consistency
4. Use convex-helpers' `zodToConvex` for converting Zod schemas to Convex validators when needed

### Polar Payments
Polar integration is included for handling payments and subscriptions. Configure the following environment variables:
- `POLAR_API_KEY`
- `POLAR_ORGANIZATION_ID`
- `POLAR_WEBHOOK_SECRET`

### Environment Variables
Create `.env.local` with required variables for Convex, Polar, Resend (email), and app configuration as specified in the README.

## Development Workflow

1. The project uses Turbopack for faster development builds (`--turbopack` flag in dev script)
2. TypeScript strict mode is enabled - ensure all types are properly defined
3. ESLint is configured with Next.js core-web-vitals and TypeScript rules
4. The project structure supports route groups for organization without affecting URL structure

## Convex Service Architecture Pattern

This project follows a state-of-the-art service layer architecture for organizing Convex backend code:

### Service Layer Pattern

Services encapsulate business logic and orchestrate between repositories, validators, and external APIs:

```typescript
// convex/services/users/index.ts
import { internalMutation, internalQuery } from "../../_generated/server";
import { userSchema } from "./schemas";
import { UserRepository } from "./repository";
import { UserValidator } from "./validator";

export class UserService {
  static createUser = internalMutation({
    args: userSchema.create,
    handler: async (ctx, args) => {
      // Validation layer
      await UserValidator.validateUnique(ctx, args.email);
      
      // Business logic
      const processed = await this.processUserData(args);
      
      // Data access via repository
      return UserRepository.create(ctx, processed);
    }
  });

  private static async processUserData(data: any) {
    // Complex business logic here
    return data;
  }
}
```

### Repository Pattern

Repositories handle data access with consistent CRUD operations:

```typescript
// convex/repositories/base.repository.ts
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";

export abstract class BaseRepository<T extends z.ZodSchema> {
  constructor(
    protected tableName: string,
    protected schema: T
  ) {}

  async findById(ctx: any, id: string) {
    return ctx.db.get(zid(this.tableName).parse(id));
  }

  async create(ctx: any, data: z.infer<T>) {
    const validated = this.schema.parse(data);
    return ctx.db.insert(this.tableName, validated);
  }

  async update(ctx: any, id: string, data: Partial<z.infer<T>>) {
    const validated = this.schema.partial().parse(data);
    return ctx.db.patch(zid(this.tableName).parse(id), validated);
  }

  async delete(ctx: any, id: string) {
    return ctx.db.delete(zid(this.tableName).parse(id));
  }
}
```

### Enhanced Validation with Zod

Use Zod with convex-helpers for advanced validation:

```typescript
// convex/lib/validation/index.ts
import { z } from "zod";
import { zCustomQuery, zCustomMutation } from "convex-helpers/server/zod";
import { query, mutation } from "../_generated/server";
import { customCtx } from "convex-helpers/server/customFunctions";

// Create authenticated wrappers
export const authenticatedQuery = zCustomQuery(
  query,
  customCtx(async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");
    return { user, ...ctx };
  })
);

export const authenticatedMutation = zCustomMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");
    return { user, ...ctx };
  })
);
```

### Function Organization

Organize functions by feature with clear separation:

```typescript
// convex/features/billing/index.ts
// Public API - exposed to client
export { 
  subscribeUser,
  cancelSubscription,
  getSubscriptionStatus 
} from "./mutations";

export { 
  getUserSubscription,
  listInvoices 
} from "./queries";

// convex/features/billing/_internal.ts
// Internal functions - only callable within Convex
import { internalAction, internalMutation } from "../../_generated/server";

export const processPayment = internalAction({...});
export const updateBillingRecord = internalMutation({...});
```

### Action Services for External APIs

Handle external API calls with action services:

```typescript
// convex/services/external/stripe.service.ts
import { action, internal } from "../../_generated/server";
import { v } from "convex/values";

export class StripeService {
  static processPayment = action({
    args: {
      amount: v.number(),
      customerId: v.string(),
    },
    handler: async (ctx, args) => {
      // Call external Stripe API
      const payment = await stripe.paymentIntents.create({
        amount: args.amount,
        customer: args.customerId,
        currency: "usd",
      });
      
      // Update database via internal mutation
      await ctx.runMutation(internal.billing.updateBillingRecord, {
        paymentId: payment.id,
        customerId: args.customerId,
        amount: args.amount,
      });
      
      return payment;
    }
  });
}
```

### Client-Side Service Pattern

Structure client-side services for clean component code:

```typescript
// src/lib/convex/services/user.service.ts
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

export class UserClientService {
  // Hooks for components
  static useCurrentUser() {
    return useQuery(api.users.getCurrentUser);
  }

  static useUpdateProfile() {
    return useMutation(api.users.updateProfile);
  }

  // Complex operations
  static async performBatchOperation(client: ConvexClient, data: any[]) {
    const results = await Promise.all(
      data.map(item => client.mutation(api.users.processItem, item))
    );
    return results;
  }
}
```

### Convex Backend Structure

```
convex/
├── _generated/          # Auto-generated files
├── features/           # Feature-based modules
│   ├── auth/
│   │   ├── index.ts    # Public exports
│   │   ├── mutations.ts # Public mutations
│   │   ├── queries.ts  # Public queries
│   │   ├── actions.ts  # Public actions
│   │   ├── _internal.ts # Internal functions
│   │   ├── schemas.ts  # Zod schemas
│   │   └── validator.ts # Validation logic
│   ├── billing/
│   └── users/
├── services/           # Business logic services
│   ├── base.service.ts
│   └── external/       # External API services
│       ├── stripe.service.ts
│       └── resend.service.ts
├── repositories/       # Data access layer
│   ├── base.repository.ts
│   └── user.repository.ts
├── lib/               # Shared utilities
│   ├── validation/    # Validation helpers
│   ├── auth/         # Auth utilities
│   └── helpers/      # General helpers
└── schema.ts         # Database schema
```

### Best Practices

1. **Separation of Concerns**: 
   - Services handle business logic
   - Repositories handle data access
   - Validators handle input validation
   - Actions handle external API calls

2. **Type Safety**:
   - Use Zod for runtime validation
   - Leverage TypeScript for compile-time safety
   - Use `zid()` for document ID validation

3. **Security**:
   - Use internal functions for sensitive operations
   - Implement auth checks at multiple levels
   - Never expose sensitive logic to public API

4. **Performance**:
   - Use query caching effectively
   - Batch operations where possible
   - Minimize database round trips

5. **Testing**:
   - Structure code for dependency injection
   - Keep business logic pure and testable
   - Mock external services in tests

## Testing

This project uses **Vitest** for unit testing both Next.js components and Convex functions. Vitest offers ~5x faster performance than Jest with zero configuration for TypeScript, JSX, and ES modules.

### Quick Start

```bash
# Run tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Testing Stack

- **Vitest** - Modern, fast test runner with Jest-compatible API
- **React Testing Library** - Component testing focused on user behavior
- **convex-test** - Mock Convex backend for unit testing functions
- **MSW** - API mocking for integration tests

For comprehensive testing documentation, see [Testing Guide](./docs/testing/basics.md).

## Clean Code Principles

When working on this codebase, prioritize **long-term maintainability over short-term wins**. Every architectural decision should be evaluated through the lens of clean code principles and future scalability. Focus on writing **atomic functions** that do one thing well, maintaining strict **separation of concerns** across all layers, and actively **reducing code smells** through continuous refactoring. Each function should have a single, clear responsibility that can be understood without diving into implementation details. When making technical decisions, reason through the longer scope—consider how the code will evolve over months and years, not just the immediate requirement. Ask yourself: "Will this solution scale when we have 10x the features? Will new developers understand this in 6 months? Does this create technical debt we'll regret?" If uncertain about the best approach, **research current best practices online** using WebSearch or WebFetch tools to find proven patterns from the community, especially from official documentation and reputable engineering blogs. Implement solutions that have stood the test of time in production environments rather than clever shortcuts that save a few lines today but create maintenance nightmares tomorrow. Remember: code is read far more often than it's written, so optimize for readability, testability, and maintainability above all else.

## External Library Documentation

**IMPORTANT**: Always fetch and consult the official documentation before working with any external library or service. Use the WebFetch tool to research the latest patterns and APIs. If WebFetch is returning an error, you can use MCP Servers (if available) to fetch the data.

### Core Libraries Documentation

- **Shadcn UI**: https://ui.shadcn.com/docs - Component library and design system
- **Polar**: https://docs.polar.sh/introduction - Payment and subscription management
- **Convex**: https://docs.convex.dev/home - Real-time backend and database
- **Clerk**: https://clerk.com/docs - Authentication and user management
- **Zod**: https://zod.dev/ - TypeScript-first schema validation with static type inference
- **Tailwind CSS v4**: https://tailwindcss.com/docs/styling-with-utility-classes - Utility-first CSS framework
- **Next.js**: https://nextjs.org/docs - React framework for production
- **React**: https://react.dev/reference/react - UI library
- **Zustand**: https://zustand.docs.pmnd.rs/getting-started/introduction - State management
- **React Query (TanStack Query)**: https://tanstack.com/query/latest/docs/framework/react/overview - Data fetching and caching

### Documentation Research Requirements

Before implementing features or working with any external service:
1. Always use WebFetch to consult the latest documentation
2. Check for breaking changes or version-specific features
3. Review best practices and recommended patterns
4. Verify API signatures and configuration options
5. Look for code examples specific to the library version in use

## Component Development Guidelines

### Use Shadcn UI Components

**IMPORTANT**: Always use existing Shadcn UI components instead of creating custom components from scratch.

1. **Check Shadcn first**: Before creating any UI component, check https://ui.shadcn.com/docs/components to see if a suitable component already exists
2. **Install and use**: If a Shadcn component fits the need, install it using the CLI and customize it as needed
3. **Extend, don't recreate**: If you need to modify a Shadcn component, extend or wrap it rather than building from scratch
4. **Consistent design system**: Using Shadcn ensures consistent design patterns and accessibility features across the application

Components should be placed in `src/components/ui/` after installation from Shadcn.