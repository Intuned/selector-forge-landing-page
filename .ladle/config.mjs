/** @type {import('@ladle/react').UserConfig} */
export default {
  // This repo has no `src/` dir (Ladle's default glob is `src/**`). Components
  // live under `components/`, with `app/` reserved for future page-level stories.
  stories: "{app,components}/**/*.stories.{js,jsx,ts,tsx,mdx}",
  port: 61000,
};
