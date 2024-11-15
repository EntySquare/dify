// GENERATE BY script
// DON NOT EDIT IT MANUALLY

import * as React from 'react'
import data from './LangsmithIconBig.json'
import dataDark from './LangsmithIconBigDark.json'
import IconBase from '../../../IconBase'
import type { IconBaseProps, IconData } from '../../../IconBase'
import { useTGAIGlobalStore } from '@/context/tgai-global-context'
import { Theme } from '@/types/app'

const Icon = React.forwardRef<React.MutableRefObject<SVGElement>, Omit<IconBaseProps, 'data'>>((
  props,
  ref,
) => {
  const theme = useTGAIGlobalStore(state => state.theme)

  return <IconBase {...props} ref={ref} data={theme === Theme.light ? data as IconData : dataDark as IconData} />
})

Icon.displayName = 'LangsmithIconBig'

export default Icon
