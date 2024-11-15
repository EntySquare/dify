import type { FC } from 'react'
import React from 'react'
import { Pagination } from 'react-headless-pagination'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import s from './style.module.css'

type Props = {
  current: number
  onChange: (cur: number) => void
  total: number
  limit?: number
}

const CustomizedPagination: FC<Props> = ({ current, onChange, total, limit = 10 }) => {
  const { t } = useTranslation()
  const totalPages = Math.ceil(total / limit)
  return (
    <Pagination
      className="flex items-center w-full h-10 text-sm select-none mt-8"
      currentPage={current}
      edgePageCount={2}
      middlePagesSiblingCount={1}
      setCurrentPage={onChange}
      totalPages={totalPages}
      truncatableClassName="w-8 px-0.5 text-center text-tgai-text-3"
      truncatableText="..."
    >
      <Pagination.PrevButton
        disabled={current === 0}
        className={`flex items-center mr-2 text-tgai-text-3  focus:outline-none ${current === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-tgai-text-2'}`} >
        <ArrowLeftIcon className="mr-3 h-3 w-3" />
        {t('appLog.table.pagination.previous')}
      </Pagination.PrevButton>
      <div className={`flex items-center justify-center flex-grow ${s.pagination}`}>
        <Pagination.PageButton
          activeClassName="bg-primary-50 dark:bg-zinc-600 text-tgai-primary"
          className="flex items-center justify-center h-8 w-8 rounded-lg cursor-pointer"
          inactiveClassName="text-tgai-text-3"
        />
      </div>
      <Pagination.NextButton
        disabled={current === totalPages - 1}
        className={`flex items-center mr-2 text-tgai-text-3 focus:outline-none ${current === totalPages - 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-tgai-text-2'}`} >
        {t('appLog.table.pagination.next')}
        <ArrowRightIcon className="ml-3 h-3 w-3" />
      </Pagination.NextButton>
    </Pagination>
  )
}

export default CustomizedPagination
