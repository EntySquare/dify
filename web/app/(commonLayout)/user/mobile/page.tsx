import React from "react";
import { AccountCard } from '@/app/components/tgai-user/mobile/mobile-card';
const HeatList = () => {
  return <div className="px-5 py-4 h-full overflow-y-auto bg-tgai-section-background"><AccountCard /></div>;
};

export default React.memo(HeatList);
