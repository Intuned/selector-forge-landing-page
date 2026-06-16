import { ForgeElementListInBrowser } from "@/components/magicpath/forge-element-list-in-browser/ForgeElementListInBrowser";
import { MobileLanding } from "@/components/magicpath/forge-element-list-in-browser/components/mobile/MobileLanding";

export default function Home() {
  return (
    <>
      {/* Desktop (lg+): the scroll-cinematic two-column experience. */}
      <div className="hidden lg:block">
        <ForgeElementListInBrowser />
      </div>
      {/* Mobile (< lg): a stacked, normal-scrolling landing. */}
      <div className="lg:hidden">
        <MobileLanding />
      </div>
    </>
  );
}
