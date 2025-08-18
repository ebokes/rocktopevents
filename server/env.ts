export function getConfig() {
  return {
    isProduction: process.env.NODE_ENV === "production",
    port: parseInt(process.env.PORT || "5000", 10),
    allowedOrigins: (process.env.ALLOWED_ORIGIN || "")
      .split(",")
      .filter(Boolean),
    hostFrontend: process.env.HOST_FRONTEND === "true",
  };
}
