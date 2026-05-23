import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FilmLog",
    short_name: "FilmLog",
    description: "Analog film photography log",
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#E5A100",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
