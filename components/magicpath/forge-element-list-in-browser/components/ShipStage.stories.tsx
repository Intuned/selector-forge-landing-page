import type { ReactNode } from "react";
import type { Story } from "@ladle/react";
import { ShipStage } from "./ShipStage";

// ShipStage is the closing beat. On the landing page the browser mock fades out
// and ShipStage fades in around p >= SHIP_A (0.87): the "Every selector,
// judged." headline, the Playwright/Scraper use-case cards, the CTAs and the
// CLI-coming-soon email capture. It only renders content past ~0.87, so the
// default p is 0.95. The email field is interactive (try submitting).
export default { title: "Forge/Components" };

const Stage = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen w-full items-center justify-center bg-white px-8">
    {children}
  </div>
);

export const Ending: Story<{ p: number }> = ({ p }) => (
  <Stage>
    <ShipStage p={p} />
  </Stage>
);
Ending.args = { p: 0.95 };
Ending.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
