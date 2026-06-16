import type { Story } from '@ladle/react';
import React from 'react';
import { MobileLanding } from './MobileLanding';
import { MobileHero } from './MobileHero';
import { PickFrame, ElementFrame, ListFrame } from './MobileFrames';
import { MobileShipHero } from './MobileShipHero';

export default { title: 'Mobile / Landing' };

/* Phone-width column so everything is reviewed at real small-screen size. */
const Phone: React.FC<{ children: React.ReactNode; pad?: boolean }> = ({ children, pad }) => (
  <div className="flex w-full justify-center bg-gray-200 py-6">
    <div className="w-[390px] overflow-hidden border-x-2 border-black bg-white" style={pad ? { padding: 16 } : undefined}>
      {children}
    </div>
  </div>
);

export const FullPage: Story = () => (
  <Phone>
    <MobileLanding />
  </Phone>
);

export const Hero: Story = () => (
  <Phone>
    <MobileHero />
  </Phone>
);

export const Frame1Pick: Story = () => (
  <Phone pad>
    <PickFrame />
  </Phone>
);

export const Frame2Element: Story = () => (
  <Phone pad>
    <ElementFrame />
  </Phone>
);

export const Frame3List: Story = () => (
  <Phone pad>
    <ListFrame />
  </Phone>
);

export const ShipHero: Story = () => (
  <Phone>
    <MobileShipHero />
  </Phone>
);
