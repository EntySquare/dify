import React from "react";
import { SingleStrategyCard } from "@/app/components/strategy/single-strategy/single-strategy-card";

const SingleStrategy = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <SingleStrategyCard />
    </div>
  );
};

export default React.memo(SingleStrategy);
