"use client";
import React from "react";
import { KnowledgeBaseUpLoadTextHomeView } from "@/app/components/knowledge-base/upload-text/index";

const KnowledgeBaseUpLoadTextHome = () => {
  return (
    <div
      className="px-5 py-4 h-full overflow-y-auto"
      style={{ background: `var(--color-background-grey)` }}
    >
      <KnowledgeBaseUpLoadTextHomeView />
    </div>
  );
};

export default React.memo(KnowledgeBaseUpLoadTextHome);
