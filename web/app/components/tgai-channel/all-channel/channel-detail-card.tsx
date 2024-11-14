'use client'

import { Button, Card, Link, Statistic } from '@arco-design/web-react'
import { IconClose, IconEdit, IconHeart, IconLeft, IconUser } from '@arco-design/web-react/icon'
import { useShallow } from 'zustand/react/shallow'
import useSWR from 'swr'
import React, { useMemo } from 'react'
import type { LineSeriesOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useAllChannelStore } from './store'
import type { TGAIActiveHeatRes, TGAIHeatPeak } from '@/service/tgai'
import { getTGAIChannelActiveHeat, getTGAIChannelDetail, getTGAIChannelHeatPeak } from '@/service/tgai'
import { getThemeColors } from '@/utils/theme-colors'

type ChannelStatisticsPanelProps = {
  data: {
    participants_count: number
    admin_count: number
    bot_count: number
  }
}

const ChannelStatisticsPanel = React.memo((props: ChannelStatisticsPanelProps) => {
  return <div className='flex flex-row justify-between items-center'>
    <Statistic title={<span className='font-extrabold text-tgai-text-1'>总人数</span>} groupSeparator value={props.data.participants_count}
      renderFormat={(_value, value) => <div className='flex items-center gap-2'>
        <span className='flex justify-center items-center size-8 bg-[rgb(255,_228,_186)] rounded-md'>
          <IconEdit className='text-[16px] !text-[rgb(247,_114,_52)]' />
        </span>{value}
      </div>}
    />
    <Statistic title={<span className='font-extrabold text-tgai-text-1'>管理员人数</span>} groupSeparator value={props.data.admin_count}
      renderFormat={(_value, value) => <div className='flex items-center gap-2'>
        <span className='flex justify-center items-center size-8 bg-[rgb(232,_243,_255)] rounded-md'>
          <IconHeart className='text-[16px] !text-[rgb(22,_93,_255)]' />
        </span>{value}
      </div>}
    />
    <Statistic title={<span className='font-extrabold text-tgai-text-1'>机器人人数</span>} groupSeparator value={props.data.bot_count}
      renderFormat={(_value, value) => <div className='flex items-center gap-2'>
        <span className='flex justify-center items-center size-8 bg-[rgb(232,_243,_255)] rounded-md'>
          <IconUser className='text-[16px] !text-[rgb(22,_93,_255)]' />
        </span>{value}
      </div>}
    />
  </div>
})

ChannelStatisticsPanel.displayName = 'ChannelStatisticsPanel'

type ChannelActiveHeatChartProps = {
  data: TGAIActiveHeatRes
}

const ChannelActiveHeatChart = React.memo(({ data }: ChannelActiveHeatChartProps) => {
  const generateSeries = (
    name: string,
    lineColor: string,
    itemBorderColor: string,
    data: number[],
  ): LineSeriesOption => {
    return {
      name,
      data,
      type: 'line',
      smooth: true,
      symbolSize: 5,
      emphasis: {
        focus: 'series',
        itemStyle: {
          color: lineColor,
          borderWidth: 2,
          borderColor: itemBorderColor,
        },
      },
      endLabel: {
        show: true,
        formatter: '{a}',
        distance: 20,
      },
      lineStyle: {
        width: 4,
        color: lineColor,
      },
    }
  }

  const chartOptions = useMemo(() => ({
    tooltip: {
      trigger: 'item',
    },
    grid: {
      left: '0',
      right: '4',
      top: '40',
      bottom: '40',
      containLabel: true,
    },
    legend: {
      show: true,
      bottom: '0',
      itemGap: 20,
      textStyle: {
        color: '#4E5969',
      },
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false,
      },
      axisLabel: {
        margin: 30,
        fontSize: 16,
      },
      boundaryGap: false,
      data: new Array(Math.max(data.data_30_days.length, data.data_7_days.length, data.data_yesterday.length)).fill(0).map((_item, index) => `${index}时`),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter(value: number, idx: number) {
          if (idx === 0)
            return String(value)
          return `${value / 1000}k`
        },
      },
      min: 1,
    },
    series: [
      // generateSeries(
      //   '今日',
      //   '#3469FF',
      //   '#E8F3FF',
      //   activeUsersData.value
      // ),
      generateSeries(
        '昨日',
        '#33D1C9',
        '#E8FFFB',
        data.data_yesterday,
      ),
      generateSeries(
        '7天',
        '#F77234',
        '#FFE4BA',
        data.data_7_days,
      ),
      generateSeries(
        '30天',
        '#722ED1',
        '#F5E8FF',
        data.data_30_days,
      ),
    ],
  }), [data])
  //   xAxis.value = new Array(24).fill(0).map((_item, index) => {
  //     return `${index}时`;
  //   });

  // activeUsersData.value = res.data.data_today;
  // contentExposureData.value = res.data.data_yesterday;
  // contentClickData.value = res.data.data_7_days;
  // contentProductionData.value = res.data.data_30_days;
  return <ReactECharts
    className='min-h-[600px]'
    option={chartOptions}
  />
})

ChannelActiveHeatChart.displayName = 'ChannelActiveHeatChart'

type ChannelPeakHeatChartProps = {
  data: TGAIHeatPeak[]
}

const ChannelPeakHeatChart = React.memo(({ data }: ChannelPeakHeatChartProps) => {
  const { primaryColor } = getThemeColors()

  const chartOptions = useMemo(() => ({
    grid: {
      left: 44,
      right: 20,
      top: 0,
      bottom: 20,
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        show: true,
        formatter(value: number, idx: number) {
          if (idx === 0)
            return String(value)
          return value
        },
      },
      splitLine: {
        lineStyle: {
          color: '#E5E8EF',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: data.length > 3
        ? [
          data[2].peak_time.substring(0, data[2].peak_time.indexOf(':') + 3),
          data[1].peak_time.substring(0, data[1].peak_time.indexOf(':') + 3),
          data[0].peak_time.substring(0, data[0].peak_time.indexOf(':') + 3),

        ]
        : [],
      axisLabel: {
        show: true,
        color: '#4E5969',
      },
      axisTick: {
        show: true,
        length: 2,
        lineStyle: {
          color: '#A9AEB8',
        },
        alignWithLabel: true,
      },
      axisLine: {
        lineStyle: {
          color: '#A9AEB8',
        },
      },
    },
    tooltip: {
      show: true,
      trigger: 'axis',
    },
    series: [
      {
        data: data.length > 3
          ? [
            data[2].peak_data,
            data[1].peak_data,
            data[0].peak_data,
          ]
          : [],
        type: 'bar',
        barWidth: 7,
        itemStyle: {
          color: '#ff0777',
          borderRadius: 4,
        },
      },
    ],
  }), [data])

  // yAxisData.value = [
  //     res.data[2]!.peak_time.substring(0, res.data[2]!.peak_time.indexOf(':') + 3),
  //     res.data[1]!.peak_time.substring(0, res.data[2]!.peak_time.indexOf(':') + 3),
  //     res.data[0]!.peak_time.substring(0, res.data[2]!.peak_time.indexOf(':') + 3),
  //   ]
  //   seriesData.value = [
  //     res.data[2]!.peak_data,
  //     res.data[1]!.peak_data,
  //     res.data[0]!.peak_data
  //   ]

  return <ReactECharts option={chartOptions} className='!h-[125px]' />
})

ChannelPeakHeatChart.displayName = 'ChannelPeakHeatChart'

export const ChannelDetailCard = () => {
  const { channelDetailId, setChannelDetailId } = useAllChannelStore(useShallow(state => ({
    channelDetailId: state.channelDetailId,
    setChannelDetailId: state.setChannelDetailId,
  })))

  const { data: channelDetailData, isLoading: isDetailLoading } = useSWR(channelDetailId ? [`/channel/detail/${channelDetailId}`] : null, channelDetailId ? () => getTGAIChannelDetail(channelDetailId) : null)
  const { data: heatPeakData, isLoading: isHeatPeakLoading } = useSWR(channelDetailId ? [`/heat/channelPeak/${channelDetailId}`] : null, channelDetailId ? () => getTGAIChannelHeatPeak(channelDetailId) : null)
  const { data: activeHeatData, isLoading: isActiveHeatLoading } = useSWR(channelDetailId ? [`/heat/channelActive/${channelDetailId}`] : null, channelDetailId ? () => getTGAIChannelActiveHeat(channelDetailId) : null)

  const statisticsData = useMemo(() => {
    return channelDetailData
      ? {
        participants_count: channelDetailData.data.participants_count,
        admin_count: channelDetailData.data.admin_count,
        bot_count: channelDetailData.data.bot_count,
      }
      : undefined
  }, [channelDetailData])
  const onCloseClick = () => setChannelDetailId()

  return <div className="h-full w-full grid gap-4">
    <div className="flex justify-between items-center">
      <Button onClick={onCloseClick}><IconLeft /> 返回</Button>
      <IconClose onClick={onCloseClick} className='text-[20px] cursor-pointer' />
    </div>
    <div className='grid grid-cols-3 gap-4'>
      <Card className={'col-span-3 xl:col-span-2'} title={`群名 ${channelDetailData ? channelDetailData.data.name : ''}`} loading={isDetailLoading || isActiveHeatLoading}>
        <div className='flex flex-col gap-4'>
          {statisticsData && <ChannelStatisticsPanel data={statisticsData} />}
          {activeHeatData && <ChannelActiveHeatChart data={activeHeatData.data} />}
        </div>
      </Card>
      <div className='col-span-3 xl:col-span-1 flex flex-col gap-4'>
        <Card title={'聊天峰值统计（7天平均）'} loading={isHeatPeakLoading}>
          {heatPeakData && <ChannelPeakHeatChart data={heatPeakData.data} />}
        </Card>
        <Card title={'群详情'} loading={isDetailLoading}>
          {channelDetailData && <div className='grid grid-cols-[auto_1fr] gap-3'>
            <span>群链接</span><Link>{channelDetailData.data.link}</Link>
            <span>群名字</span><span>{channelDetailData.data.name}</span>
            <span>群 ID</span><span>{channelDetailData.data.channel_id}</span>
            <span>群简介</span><span>{channelDetailData.data.domain}</span>
          </div>}
        </Card>

      </div>

    </div>
  </div>
}
