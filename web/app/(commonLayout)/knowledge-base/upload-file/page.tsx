"use client";
import React from "react";
import { KnowledgeBaseUpLoadFileHomeView } from "@/app/components/knowledge-base/upload-file/index";

const KnowledgeBaseUpLoadFileHome = () => {
  return (
    <div
      className="px-5 py-4 h-full overflow-y-auto"
      style={{ background: `var(--color-background-grey)` }}
    >
      <KnowledgeBaseUpLoadFileHomeView />
    </div>
  );
};

export default React.memo(KnowledgeBaseUpLoadFileHome);
