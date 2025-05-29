export default {
  providers: [
    {
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.CLERK_FRONTEND_API_URL
          : process.env.CLERK_FRONTEND_API_URL_DEV,
      applicationID: "convex",
    },
  ],
};
