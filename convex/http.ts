import { httpRouter } from "convex/server";

const http = httpRouter();

// The @convex-dev/polar component automatically registers webhook routes at /polar/events
// No manual webhook handling needed!

export default http;