import { SingleTemplateDetailCard } from "@/app/components/tgai-template/single-template/template-detail/single-template-detail-card";
import React from "react";

const SingleTemplateDetailPage = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <SingleTemplateDetailCard />
    </div>
  );
};

export default React.memo(SingleTemplateDetailPage);
