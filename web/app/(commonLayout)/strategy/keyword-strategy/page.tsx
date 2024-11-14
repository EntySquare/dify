import React from "react";
import { KeywordStrategyCard } from "@/app/components/strategy/keyword-strategy/keyword-strategy-card";

const KeywordStrategy = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <KeywordStrategyCard />
    </div>
  );
};

export default React.memo(KeywordStrategy);
