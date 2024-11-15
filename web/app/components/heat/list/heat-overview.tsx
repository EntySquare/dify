"use client";

import useSWR from "swr";
import { getTGAIChannelSets, getTGAIHeatData } from "@/service/tgai";
import { useCallback, useMemo, useState } from "react";
import React from "react";


import { ChannelChatsCharts } from "./heat-overview-channel-chats-chart";
import { PrivateChartsTable } from "./heat-overview-private-chats-table";
import { HeatStatisticsPanel } from "./heat-overview-statistics-panel";




export const HeatOverview = () => {

  const [selectedSet, setSelectedSet] = useState<number>()

  const { data: allSetsData } = useSWR(['/channel/getAllSet'], getTGAIChannelSets, {
    onSuccess: (data) => {
      if (data.data.channel_sets.length > 0 && selectedSet === undefined) setSelectedSet(data.data.channel_sets[0].id)
    }
  })


  //getTGAIHeatChatRank
  const { data: overviewData, isLoading } = useSWR([`/heat/view/${selectedSet}`], () => getTGAIHeatData(selectedSet))

  const setsOptions = useMemo(() => (allSetsData && allSetsData.data.channel_sets.length > 0) ? allSetsData.data.channel_sets.map(set => ({
    label: set.set_name,
    value: set.id
  })) : undefined, [allSetsData])

  const channelChatsChartData = useMemo(() => overviewData ? overviewData.data.channel_chats : [], [overviewData])

  const onSetSelectHandler = useCallback((set_id: number) =>
    setSelectedSet(set_id)
    , [])

  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
      <HeatStatisticsPanel data={overviewData ? overviewData.data : undefined} isLoading={isLoading}/>
      <ChannelChatsCharts setOptions={setsOptions} chartData={channelChatsChartData} setSelector={onSetSelectHandler} selectedSet={selectedSet} isLoading={isLoading}/>
      <PrivateChartsTable />
    </div>
  );
};
