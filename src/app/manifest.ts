import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Smash House",
    short_name: "Smash House",
    description: "Smash burgers artesanais — peça online.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0806",
    theme_color: "#0a0806",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
