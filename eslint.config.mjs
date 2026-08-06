import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Prisma query results are dynamically shaped in a few server components
      // (e.g. admin stat cards) — `any` there is intentional, not a mistake.
      "@typescript-eslint/no-explicit-any": "warn",
      // Small admin-only thumbnail preview — next/image isn't worth the setup here.
      "@next/next/no-img-element": "warn",
      // Fonts are intentionally loaded via a <link> tag in the root layout
      // instead of next/font, so a network hiccup can never crash the whole site.
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default eslintConfig;
