import React from "react";
import { SingleTemplateCard } from "@/app/components/tgai-template/single-template/single-template-card";

const SingleTemplatePage = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <SingleTemplateCard />
    </div>
  );
};

export default React.memo(SingleTemplatePage);
