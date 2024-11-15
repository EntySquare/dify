import React from "react";

import { GroupTemplateDetailCard } from "@/app/components/tgai-template/group-template/template-detail/group-template-detail-card";

const GroupTemplateDetailPage = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <GroupTemplateDetailCard />
    </div>
  );
};

export default React.memo(GroupTemplateDetailPage);
