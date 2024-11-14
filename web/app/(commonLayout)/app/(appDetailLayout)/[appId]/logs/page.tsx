import React from 'react'
import Main from '../../../../../components/app/log-annotation'
import { PageType } from '../../../../../components/app/configuration/toolbox/annotation/type'

const Logs = async () => {
  return (
    <Main pageType={PageType.log} />
  )
}

export default Logs
