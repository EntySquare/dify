import React from "react";
import { GroupStrategyCard } from "@/app/components/strategy/group-strategy/group-strategy-card";

const GroupStrategy = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <GroupStrategyCard />
    </div>
  );
};

export default React.memo(GroupStrategy);
