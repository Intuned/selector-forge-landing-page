import { ForgeElementListInBrowser } from "@/components/magicpath/forge-element-list-in-browser/ForgeElementListInBrowser";
import { StackedDesktopLanding } from "@/components/magicpath/forge-element-list-in-browser/components/StackedDesktopLanding";
import { MobileLanding } from "@/components/magicpath/forge-element-list-in-browser/components/mobile/MobileLanding";

export default function Home() {
  return (
    <>
      {/* Desktop (lg+): the scroll-cinematic two-column experience. */}
      <div className="hidden lg:block">
        <ForgeElementListInBrowser />
      </div>
      {/* Narrow desktop (md–lg): hero on top, cinematic stacked below it,
          played on natural document scroll. */}
      <div className="hidden md:block lg:hidden">
        <StackedDesktopLanding />
      </div>
      {/* Phone (< md): a stacked, normal-scrolling landing. */}
      <div className="md:hidden">
        <MobileLanding />
      </div>
    </>
  );
}
