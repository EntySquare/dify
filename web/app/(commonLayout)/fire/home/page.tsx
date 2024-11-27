"use client";
import React from "react";
import { FireHomeView } from "@/app/components/fire/home/index";

const FireHome = () => {
  return (
    <div
      className="px-5 py-4 h-full overflow-y-auto"
      style={{ background: `var(--color-background-grey)` }}
    >
      <FireHomeView />
    </div>
  );
};

export default React.memo(FireHome);
