import { defineConfig } from "vitepress";
export default defineConfig({
  title: "Messty",
  description: "Just playing around.",
  themeConfig: {
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/getting-started/introduction" },
          { text: ".messty DSL", link: "/getting-started/dsl" },
        ],
      },
      {
        text: "Providers",
        link: "/provider",
        items: [{ text: "Kafka", link: "/provider/kafka" }],
      },
      {
        text: "Clients",
        link: "/client",
        items: [{ text: "Typescript", link: "/client/typescript" }],
      },
    ],
  },
});
