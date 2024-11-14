import React from 'react'
import ChartView from './chartView'
import CardView from './cardView'
import TracingPanel from './tracing/panel'
import ApikeyInfoPanel from '../../../../../components/app/overview/apikey-info-panel'

export type IDevelopProps = {
  params: { appId: string }
}

const Overview = async ({
  params: { appId },
}: IDevelopProps) => {
  return (
    <div className="h-full px-4 sm:px-16 py-6 overflow-auto tgai-custom-scrollbar">
      <ApikeyInfoPanel />
      <TracingPanel />
      <CardView appId={appId} />
      <ChartView appId={appId} />
    </div>
  )
}

export default Overview
