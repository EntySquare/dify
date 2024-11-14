import React from 'react'
import Main from '../../../../../components/app/log-annotation'
import { PageType } from '../../../../../components/app/configuration/toolbox/annotation/type'

export type IProps = {
  params: { appId: string }
}

const Logs = async () => {
  return (
    <Main pageType={PageType.annotation} />
  )
}

export default Logs
