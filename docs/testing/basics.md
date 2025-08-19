# Testing Guide for Next.js + Convex Applications (2025)

## Overview

This guide covers modern testing practices for Next.js applications with Convex backend integration, focusing on unit testing with Vitest and the convex-test library.

## Why Vitest Over Jest in 2025

For new Next.js projects, **Vitest** is the recommended testing framework:

- **Performance**: ~5x faster than Jest (3.8s vs 15.5s for comparable test suites)
- **Zero Configuration**: ES modules, TypeScript, and JSX support out-of-the-box
- **Modern Tooling**: Better integration with Vite and modern JavaScript ecosystem
- **Compatibility**: Nearly identical API to Jest, making migration straightforward

**Note**: Vitest currently doesn't support async Server Components. Use E2E tests for those scenarios.

## Next.js Testing Setup

### Installation

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
```

### Configuration

Create `vitest.config.mts` in your project root:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.ts",
  },
});
```

### Project Structure

```
all-tests/
├── vitest-unit-tests/
│   ├── components/
│   ├── features/
│   └── hooks/
├── e2e/
└── integration/
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Convex Testing Setup

### Installation

```bash
npm install --save-dev convex-test vitest @edge-runtime/vm
```

### Configuration

Update `vitest.config.mts` for Convex testing:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: { 
      deps: { 
        inline: ["convex-test"] 
      } 
    },
  },
});
```

### Testing Strategies

Convex offers three testing approaches:

1. **Mock Backend (convex-test)**
   - Fast, isolated unit tests
   - No network calls
   - Ideal for CI/CD pipelines

2. **Local Backend Testing**
   - Tests against real Convex runtime
   - Enforces size and time limits
   - Better for integration testing

3. **Preview Deployments**
   - Team collaboration on features
   - Real environment testing

## Writing Tests

### Component Testing Example

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Convex Function Testing Example

```typescript
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("user creation and retrieval", async () => {
  const t = convexTest(schema);
  
  // Test mutation
  const userId = await t.mutation(api.users.create, {
    name: "John Doe",
    email: "john@example.com"
  });
  
  // Test query
  const user = await t.query(api.users.getById, { id: userId });
  expect(user).toMatchObject({
    name: "John Doe",
    email: "john@example.com"
  });
});

test("authentication required", async () => {
  const t = convexTest(schema);
  
  // Test without auth - should fail
  await expect(
    t.mutation(api.users.updateProfile, { name: "New Name" })
  ).rejects.toThrowError("Unauthorized");
  
  // Test with auth - should succeed
  await t.withIdentity({ subject: "user123" }).mutation(
    api.users.updateProfile, 
    { name: "New Name" }
  );
});
```

### Testing Scheduled Functions

```typescript
import { convexTest } from "convex-test";
import { expect, test, vi } from "vitest";

test("scheduled function execution", async () => {
  const t = convexTest(schema);
  vi.useFakeTimers();
  
  // Schedule a function
  await t.mutation(api.tasks.scheduleReminder, {
    message: "Don't forget!",
    delayMs: 60000 // 1 minute
  });
  
  // Advance time and execute scheduled functions
  await vi.advanceTimersByTimeAsync(60000);
  await t.finishInProgressScheduledFunctions();
  
  // Verify execution
  const notifications = await t.query(api.notifications.list);
  expect(notifications).toContainEqual(
    expect.objectContaining({ message: "Don't forget!" })
  );
  
  vi.useRealTimers();
});
```

### Testing HTTP Actions

```typescript
test("HTTP action endpoint", async () => {
  const t = convexTest(schema);
  
  const response = await t.fetch("/api/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "user.created" })
  });
  
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data).toEqual({ success: true });
});
```

## Best Practices

### General Testing Principles

1. **Focus on User Behavior**: Test what users do, not implementation details
2. **Isolate Tests**: Each test should be independent and not affect others
3. **Use Descriptive Names**: Test names should clearly state what they verify
4. **Test Happy and Error Paths**: Cover both success and failure scenarios
5. **Keep Tests Simple**: One assertion per test when possible

### Next.js Specific

- Mock next/navigation for routing tests
- Use MSW for API mocking
- Test both client and server components separately
- Verify SSR/SSG behavior with appropriate test environments

### Convex Specific

- Use `toMatchObject()` for flexible database assertions
- Test error handling with `.rejects.toThrowError()`
- Mock external fetch calls with `vi.stubGlobal()`
- Test authentication flows with `t.withIdentity()`
- Verify scheduled functions with fake timers

### Performance Tips

- Run tests in parallel (Vitest default)
- Use `test.concurrent` for independent tests
- Implement test data factories for consistent setup
- Clear test data between runs with `beforeEach`/`afterEach`

## Limitations and Workarounds

### Vitest Limitations

- **Async Server Components**: Not yet supported, use E2E tests instead
- **Module Mocking**: Some Next.js internal modules require special handling

### Convex-test Limitations

- **No size/time limits**: Mock doesn't enforce Convex runtime limits
- **No fetch mocking**: Can't mock fetch within Convex functions
- **No env variables**: Can't set environment variables from tests
- **ID formats**: Don't depend on specific document/storage ID formats

**Workaround**: Use local backend testing for scenarios requiring real runtime behavior.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Migration from Jest

If migrating from Jest to Vitest:

1. Install Vitest alongside Jest initially
2. Update import statements: `jest` → `vitest`
3. Replace `jest.config.js` with `vitest.config.mts`
4. Update test scripts in package.json
5. Run both test suites during migration
6. Gradually migrate test files
7. Remove Jest once migration is complete

Most Jest tests work with minimal changes due to compatible APIs.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Next.js Testing Guide](https://nextjs.org/docs/app/guides/testing)
- [Convex Testing Documentation](https://docs.convex.dev/testing)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)