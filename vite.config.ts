import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeHighlight from "rehype-highlight";

export default defineConfig({
	plugins: [
		mdx({
			remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
			rehypePlugins: [rehypeHighlight],
		}),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
	],
});
