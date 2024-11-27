"use client";
import React from "react";
import { DeclareHomeView } from "@/app/components/declare/home/index";

const DeclareHome = () => {
  return (
    <div
      className="px-5 py-4 h-full overflow-y-auto"
      style={{ background: `var(--color-background-grey)` }}
    >
      <DeclareHomeView />
    </div>
  );
};

export default React.memo(DeclareHome);
