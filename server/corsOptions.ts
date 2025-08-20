import { getConfig } from "./env";

export const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const { allowedOrigins } = getConfig();

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is explicitly allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In production, check for matching domain patterns
      if (process.env.NODE_ENV === "production") {
        // Extract domain from origin
        const originDomain = new URL(origin).hostname;

        // Check if any allowed origin matches this domain
        const isDomainAllowed = allowedOrigins.some((allowedOrigin) => {
          try {
            const allowedDomain = new URL(allowedOrigin).hostname;
            return originDomain === allowedDomain;
          } catch {
            return false;
          }
        });

        if (isDomainAllowed) {
          return callback(null, true);
        }
      }
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};
