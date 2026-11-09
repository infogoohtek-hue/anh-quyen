const config = {
  distDir:
    process.env.NODE_ENV === "development" ? ".next-development" : ".next",
  images: { unoptimized: true },
};
export default config;
