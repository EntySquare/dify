import React from "react";
import { ClearHistoryCard } from "@/app/components/instrument/clear-history/clear-history-card";

const ClearHistory = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <ClearHistoryCard />
    </div>
  );
};

export default React.memo(ClearHistory);
