if (process.env.NODE_ENV !== "test") {
  void import("server-only");
}
