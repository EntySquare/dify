'use client'

import { Card, Select } from "@arco-design/web-react";
import React, { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import listCss from "../list/list.module.css";
import { CallbackDataParams } from "echarts/types/dist/shared";
import ReactECharts from 'echarts-for-react'
import exp from "constants";
import { HeatChannelChat } from "@/models/tgai-heat";
import { getThemeColors } from "@/utils/theme-colors";


const CHART_X_AXIS = [
    "0时",
    "1时",
    "2时",
    "3时",
    "4时",
    "5时",
    "6时",
    "7时",
    "8时",
    "9时",
    "10时",
    "11时",
    "12时",
    "13时",
    "14时",
    "15时",
    "16时",
    "17时",
    "18时",
    "19时",
    "20时",
    "21时",
    "22时",
    "23时",
]

type ChannelChatsChartsProps = {
    selectedSet: number | undefined,
    setOptions: {
        value: number
        label: string
    }[] | undefined,
    chartData: HeatChannelChat[]
    setSelector: (set_id: number) => void
    isLoading: boolean
}

interface ToolTipFormatterParams extends CallbackDataParams {
    axisDim: string;
    axisIndex: number;
    axisType: string;
    axisId: string;
    axisValue: string;
    axisValueLabel: string;
}

const ChannelChatsCharts = React.memo(({ selectedSet, setOptions, chartData, setSelector, isLoading }: ChannelChatsChartsProps) => {


    const { primaryColor } = getThemeColors()


    const tooltipItemsHtmlString = useCallback((items: ToolTipFormatterParams[]) => {
        return items
            .map(
                (el) => `<div class="${listCss.contentPanel}">
        <p>
          <span style="background-color: ${el.color
                    }" class="tooltip-item-icon"></span>
          <span>
          ${el.seriesName}
          </span>
        </p>
        <span class="tooltip-value">
          ${Number(el.value).toLocaleString()}
        </span>
      </div>`
            )
            .join("");
    }, [])

    const seriesData = chartData.map(data => data.chat_num)

    return <Card className={"px-4 flex-1"} loading={isLoading}>
        <div className="flex items-center justify-between mb-16">
            <div className="text-base font-bold">群组热点统计</div>
            <Select
                value={selectedSet}
                placeholder="选择群组"
                className={'max-w-[150px]'}
                options={setOptions}
                onChange={setSelector}
            >
            </Select>
        </div>
        <ReactECharts
            style={{ height: "350px" }}
            option={{
                grid: {
                    left: "6.5%",
                    right: 0,
                    top: "20",
                    bottom: "60",
                },
                legend: {
                    bottom: 0,
                    icon: "circle",
                    textStyle: {
                        color: "#4E5969",
                    },
                },
                xAxis: {
                    type: "category",
                    data: CHART_X_AXIS,
                    axisLine: {
                        lineStyle: {
                            color: "#A9AEB8",
                        },
                    },
                    axisTick: {
                        show: true,
                        alignWithLabel: true,
                        lineStyle: {
                            color: "#86909C",
                        },
                    },
                    axisLabel: {
                        color: "#86909C",
                    },
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        color: "#86909C",
                        formatter(value: number, idx: number) {
                            if (idx === 0) return `${value}`;
                            return value;
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: "#E5E6EB",
                        },
                    },
                },
                tooltip: {
                    show: true,
                    trigger: "axis",
                    formatter: (params: any) => {
                        const [firstElement] = params as ToolTipFormatterParams[];
                        return `<div>
                            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
                            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
                        </div>`;
                    },
                    className: "echarts-tooltip-diy",
                },
                series: [
                    {
                        name: "聊天次数",
                        data: seriesData,
                        stack: "one",
                        type: "bar",
                        barWidth: 16,
                        color: primaryColor,
                    },
                ],
            }}
            notMerge={true}
        />
    </Card>
})

ChannelChatsCharts.displayName = 'ChannelChatsCharts'

export { ChannelChatsCharts }