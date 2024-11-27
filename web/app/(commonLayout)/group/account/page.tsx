"use client";
import React from "react";
import { HeatOverview } from "@/app/components/group/account/heat-overview";
import { useTheme } from "@/app/context/theme-context";

const HeatList = () => {
  const { theme } = useTheme(); // 获取当前的主题
  return (
    <div
      className="px-5 py-4 h-full overflow-y-auto"
      style={{ background: `var(--color-background-grey)` }}
    >
      <HeatOverview />
    </div>
  );
};

export default React.memo(HeatList);
