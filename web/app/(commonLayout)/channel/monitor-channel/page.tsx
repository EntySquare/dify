import { MonitorChannelListCard } from "@/app/components/tgai-channel/monitor-channel/monitor-channel-list-card";
import React from "react";

const TGAIMonitorChannel = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <MonitorChannelListCard />
    </div>
  );
};

export default React.memo(TGAIMonitorChannel);
