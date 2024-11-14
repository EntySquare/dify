'use client'
import type { FC } from 'react'
import React from 'react'
import VarReferenceVars from './var-reference-vars'
import type { NodeOutPutVar, ValueSelector, Var } from '../../../../types'

type Props = {
  vars: NodeOutPutVar[]
  onChange: (value: ValueSelector, varDetail: Var) => void
  itemWidth?: number
}
const VarReferencePopup: FC<Props> = ({
  vars,
  onChange,
  itemWidth,
}) => {
  // max-h-[300px] overflow-y-auto todo: use portal to handle long list
  return (
    <div className='p-1 bg-tgai-panel-background rounded-lg border border-gray-200 dark:border-stone-600 shadow-lg dark:shadow-stone-800 space-y-1' style={{
      width: itemWidth || 228,
    }}>
      <VarReferenceVars
        searchBoxClassName='mt-1'
        vars={vars}
        onChange={onChange}
        itemWidth={itemWidth} />
    </div >
  )
}
export default React.memo(VarReferencePopup)
