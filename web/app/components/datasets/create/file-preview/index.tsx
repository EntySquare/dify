'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { XMarkIcon } from '@heroicons/react/20/solid'
import s from './index.module.css'
import cn from '../../../../../utils/classnames'
import type { CustomFile as File } from '../../../../../models/datasets'
import { fetchFilePreview } from '../../../../../service/common'
import { useTGAIGlobalStore } from '@/context/tgai-global-context'
import { Theme } from '@/types/app'

type IProps = {
  file?: File
  hidePreview: () => void
}

const FilePreview = ({
  file,
  hidePreview,
}: IProps) => {
  const { t } = useTranslation()
  const [previewContent, setPreviewContent] = useState('')
  const [loading, setLoading] = useState(true)

  const getPreviewContent = async (fileID: string) => {
    try {
      const res = await fetchFilePreview({ fileID })
      setPreviewContent(res.content)
      setLoading(false)
    }
    catch { }
  }

  const getFileName = (currentFile?: File) => {
    if (!currentFile)
      return ''
    const arr = currentFile.name.split('.')
    return arr.slice(0, -1).join()
  }

  useEffect(() => {
    if (file?.id) {
      setLoading(true)
      getPreviewContent(file.id)
    }
  }, [file])

  const theme = useTGAIGlobalStore(state=>state.theme)

  return (
    <div className={cn(s.filePreview, "dark:!bg-tgai-panel-background-3 dark:!border-stone-600")}>
      <div className={cn(s.previewHeader, "dark:!border-stone-600")}>
        <div className={cn(s.title)}>
          <span>{t('datasetCreation.stepOne.filePreview')}</span>
          <div className='flex items-center justify-center w-6 h-6 cursor-pointer' onClick={hidePreview}>
            <XMarkIcon className='h-4 w-4 text-tgai-text-3'></XMarkIcon>
          </div>
        </div>
        <div className={cn(s.fileName)}>
          <span>{getFileName(file)}</span><span className={cn(s.filetype)}>.{file?.extension}</span>
        </div>
      </div>
      <div className={cn(s.previewContent, "tgai-custom-scrollbar")}>
        {loading && <div className={cn(theme === Theme.light ? s.loading : s['loading-dark'])} />}
        {!loading && (
          <div className={cn(s.fileContent)}>{previewContent}</div>
        )}
      </div>
    </div>
  )
}

export default FilePreview
