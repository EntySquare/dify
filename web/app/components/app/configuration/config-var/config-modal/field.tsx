'use client'
import type { FC } from 'react'
import React from 'react'

type Props = {
  title: string
  children: JSX.Element
}

const Field: FC<Props> = ({
  title,
  children,
}) => {
  return (
    <div>
      <div className='leading-8 text-[13px] font-medium text-tgai-text-2'>{title}</div>
      <div>{children}</div>
    </div>
  )
}
export default React.memo(Field)
