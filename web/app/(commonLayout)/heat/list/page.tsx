import React from "react";
import { HeatOverview } from "@/app/components/heat/list/heat-overview";

const HeatList = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <HeatOverview />
    </div>
  );
};

export default React.memo(HeatList);
