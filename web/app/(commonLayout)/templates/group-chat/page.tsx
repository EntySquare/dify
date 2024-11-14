import React from "react";
import { GroupTemplateCard } from "@/app/components/tgai-template/group-template/group-template-card";

const GroupTemplatePage = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <GroupTemplateCard />
    </div>
  );
};

export default React.memo(GroupTemplatePage);
