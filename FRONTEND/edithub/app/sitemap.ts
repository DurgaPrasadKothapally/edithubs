import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://edithubs.vercel.app",
      lastModified: new Date(),
    },
  ];
}