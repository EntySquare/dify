'use client'

import { useTranslation } from 'react-i18next'
import { RiCloseLine } from '@remixicon/react'
import s from './style.module.css'
import cn from '../../../../../utils/classnames'
import Button from '../../../base/button'
import Modal from '../../../base/modal'
import { AlertTriangle } from '../../../base/icons/src/vender/solid/alertsAndFeedback'

type ConfirmModalProps = {
  show: boolean
  onConfirm?: () => void
  onClose: () => void
}

const ConfirmModal = ({ show, onConfirm, onClose }: ConfirmModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal
      className={cn('p-8 max-w-[600px] w-[600px]', s.bg, "dark:!bg-tgai-panel-background-3")}
      isShow={show}
      onClose={() => { }}
    >
      <div className='absolute right-4 top-4 p-2 cursor-pointer' onClick={onClose}>
        <RiCloseLine className='w-4 h-4 text-tgai-text-3' />
      </div>
      <div className='w-12 h-12 p-3 bg-white dark:bg-tgai-panel-background-4 rounded-xl border-[0.5px] border-gray-100 dark:border-stone-600 shadow-xl dark:shadow-stone-800'>
        <AlertTriangle className='w-6 h-6 text-[rgb(247,144,9)]' />
      </div>
      <div className='relative mt-3 text-xl font-semibold leading-[30px] text-tgai-text-1'>{t('tools.createTool.confirmTitle')}</div>
      <div className='my-1 text-tgai-text-3 text-sm leading-5'>
        {t('tools.createTool.confirmTip')}
      </div>
      <div className='pt-6 flex justify-end items-center'>
        <div className='flex items-center'>
          <Button className='mr-2' onClick={onClose}>{t('common.operation.cancel')}</Button>
          <Button className='border-red-700' variant="warning" onClick={onConfirm}>{t('common.operation.confirm')}</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmModal
