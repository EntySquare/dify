'use client'
import type { FC } from 'react'
import React from 'react'
import cn from '@/utils/classnames'

type Props = {
  className?: string
  title: string
  children: JSX.Element
}

const Field: FC<Props> = ({
  className,
  title,
  children,
}) => {
  return (
    <div>
      <div className='leading-8 text-[13px] system-sm-semibold text-tgai-text-2'>{title}</div>
      <div>{children}</div>
    </div>
  )
}
export default React.memo(Field)
