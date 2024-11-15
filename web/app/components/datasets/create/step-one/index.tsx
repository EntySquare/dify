'use client'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FilePreview from '../file-preview'
import FileUploader from '../file-uploader'
import NotionPagePreview from '../notion-page-preview'
import EmptyDatasetCreationModal from '../empty-dataset-creation-modal'
import Website from '../website'
import WebsitePreview from '../website/preview'
import s from './index.module.css'
import cn from '@/utils/classnames'
import type { CrawlOptions, CrawlResultItem, FileItem } from '@/models/datasets'
import type { DataSourceProvider, NotionPage } from '@/models/common'
import { DataSourceType } from '@/models/datasets'
import Button from '@/app/components/base/button'
import { NotionPageSelector } from '@/app/components/base/notion-page-selector'
import { useDatasetDetailContext } from '@/context/dataset-detail'
import { useProviderContext } from '@/context/provider-context'
import VectorSpaceFull from '@/app/components/billing/vector-space-full'

type IStepOneProps = {
  datasetId?: string
  dataSourceType?: DataSourceType
  dataSourceTypeDisable: Boolean
  hasConnection: boolean
  onSetting: () => void
  files: FileItem[]
  updateFileList: (files: FileItem[]) => void
  updateFile: (fileItem: FileItem, progress: number, list: FileItem[]) => void
  notionPages?: NotionPage[]
  updateNotionPages: (value: NotionPage[]) => void
  onStepChange: () => void
  changeType: (type: DataSourceType) => void
  websitePages?: CrawlResultItem[]
  updateWebsitePages: (value: CrawlResultItem[]) => void
  onWebsiteCrawlProviderChange: (provider: DataSourceProvider) => void
  onWebsiteCrawlJobIdChange: (jobId: string) => void
  crawlOptions: CrawlOptions
  onCrawlOptionsChange: (payload: CrawlOptions) => void
}

type NotionConnectorProps = {
  onSetting: () => void
}
export const NotionConnector = ({ onSetting }: NotionConnectorProps) => {
  const { t } = useTranslation()

  return (
    <div className={cn(s.notionConnectionTip, "dark:!bg-tgai-panel-background-3")}>
      <span className={cn(s.notionIcon, "dark:!bg-tgai-panel-background-4 dark:!border-stone-600 dark:!shadow-lg dark:!shadow-stone-700")} />
      <div className={s.title}>{t('datasetCreation.stepOne.notionSyncTitle')}</div>
      <div className={s.tip}>{t('datasetCreation.stepOne.notionSyncTip')}</div>
      <Button className='h-8' variant='primary' onClick={onSetting}>{t('datasetCreation.stepOne.connect')}</Button>
    </div>
  )
}

const StepOne = ({
  datasetId,
  dataSourceType: inCreatePageDataSourceType,
  dataSourceTypeDisable,
  changeType,
  hasConnection,
  onSetting,
  onStepChange,
  files,
  updateFileList,
  updateFile,
  notionPages = [],
  updateNotionPages,
  websitePages = [],
  updateWebsitePages,
  onWebsiteCrawlProviderChange,
  onWebsiteCrawlJobIdChange,
  crawlOptions,
  onCrawlOptionsChange,
}: IStepOneProps) => {
  const { dataset } = useDatasetDetailContext()
  const [showModal, setShowModal] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | undefined>()
  const [currentNotionPage, setCurrentNotionPage] = useState<NotionPage | undefined>()
  const [currentWebsite, setCurrentWebsite] = useState<CrawlResultItem | undefined>()
  const { t } = useTranslation()

  const modalShowHandle = () => setShowModal(true)
  const modalCloseHandle = () => setShowModal(false)

  const updateCurrentFile = (file: File) => {
    setCurrentFile(file)
  }
  const hideFilePreview = () => {
    setCurrentFile(undefined)
  }

  const updateCurrentPage = (page: NotionPage) => {
    setCurrentNotionPage(page)
  }

  const hideNotionPagePreview = () => {
    setCurrentNotionPage(undefined)
  }

  const hideWebsitePreview = () => {
    setCurrentWebsite(undefined)
  }

  const shouldShowDataSourceTypeList = !datasetId || (datasetId && !dataset?.data_source_type)
  const isInCreatePage = shouldShowDataSourceTypeList
  const dataSourceType = isInCreatePage ? inCreatePageDataSourceType : dataset?.data_source_type
  const { plan, enableBilling } = useProviderContext()
  const allFileLoaded = (files.length > 0 && files.every(file => file.file.id))
  const hasNotin = notionPages.length > 0
  const isVectorSpaceFull = plan.usage.vectorSpace >= plan.total.vectorSpace
  const isShowVectorSpaceFull = (allFileLoaded || hasNotin) && isVectorSpaceFull && enableBilling
  const notSupportBatchUpload = enableBilling && plan.type === 'sandbox'
  const nextDisabled = useMemo(() => {
    if (!files.length)
      return true
    if (files.some(file => !file.file.id))
      return true
    if (isShowVectorSpaceFull)
      return true

    return false
  }, [files])

  const dataSourceItemClass = "dark:!border-stone-600 dark:!shadow-stone-700 dark:!shadow-sm dark:hover:!shadow-lg dark:hover:!shadow-stone-700 dark:hover:!bg-zinc-700 dark:hover:!border-tgai-primary-7"
  const dataSourceItemActiveClass = "dark:!bg-zinc-700 dark:hover:!shadow-sm dark:hover:!bg-zinc-700 dark:!border-tgai-primary dark:hover:!border-tgai-primary"
  const dataSourceItemDisabledClass = "dark:!bg-zinc-800 dark:!border-stone-700 dark:hover:!border-stone-700 dark:hover:!bg-zinc-700 dark:hover:!shadow-sm dark:!text-tgai-text-3"

  return (
    <div className='flex w-full h-full'>
      <div className='grow overflow-y-auto tgai-custom-scrollbar relative tgai-custom-scrollbar'>
        {
          shouldShowDataSourceTypeList && (
            <div className={cn(s.stepHeader)}>{t('datasetCreation.steps.one')}</div>
          )
        }
        <div className={cn(s.form, "dark:!bg-tgai-panel-background")}>
          {
            shouldShowDataSourceTypeList && (
              <div className='flex items-center mb-8 flex-wrap gap-y-4'>
                <div
                  className={cn(
                    s.dataSourceItem,
                    dataSourceItemClass,
                    dataSourceType === DataSourceType.FILE && s.active,
                    dataSourceType === DataSourceType.FILE && dataSourceItemActiveClass,
                    dataSourceTypeDisable && dataSourceType !== DataSourceType.FILE && s.disabled,
                    dataSourceTypeDisable && dataSourceType !== DataSourceType.FILE && dataSourceItemDisabledClass,
                  )}
                  onClick={() => {
                    if (dataSourceTypeDisable)
                      return
                    changeType(DataSourceType.FILE)
                    hideFilePreview()
                    hideNotionPagePreview()
                  }}
                >
                  <span className={cn(s.datasetIcon)} />
                  {t('datasetCreation.stepOne.dataSourceType.file')}
                </div>
                <div
                  className={cn(
                    s.dataSourceItem,
                    dataSourceItemClass,
                    dataSourceType === DataSourceType.NOTION && s.active,
                    dataSourceType === DataSourceType.NOTION && dataSourceItemActiveClass,
                    dataSourceTypeDisable && dataSourceType !== DataSourceType.NOTION && s.disabled,
                    dataSourceTypeDisable && dataSourceType !== DataSourceType.NOTION && dataSourceItemDisabledClass,
                  )}
                  onClick={() => {
                    if (dataSourceTypeDisable)
                      return
                    changeType(DataSourceType.NOTION)
                    hideFilePreview()
                    hideNotionPagePreview()
                  }}
                >
                  <span className={cn(s.datasetIcon, s.notion)} />
                  {t('datasetCreation.stepOne.dataSourceType.notion')}
                </div>
                <div
                  className={cn(
                    s.dataSourceItem,
                    dataSourceItemClass,
                    dataSourceType === DataSourceType.WEB && s.active,
                    dataSourceType === DataSourceType.WEB && dataSourceItemActiveClass,
                    dataSourceTypeDisable && dataSourceType !== DataSourceType.WEB && s.disabled,
                    dataSourceTypeDisable && dataSourceType !== DataSourceType.WEB && dataSourceItemDisabledClass
                  )}
                  onClick={() => changeType(DataSourceType.WEB)}
                >
                  <span className={cn(s.datasetIcon, s.web)} />
                  {t('datasetCreation.stepOne.dataSourceType.web')}
                </div>
              </div>
            )
          }
          {dataSourceType === DataSourceType.FILE && (
            <>
              <FileUploader
                fileList={files}
                titleClassName={!shouldShowDataSourceTypeList ? 'mt-[30px] !mb-[44px] !text-lg !font-semibold !text-tgai-text-1' : undefined}
                prepareFileList={updateFileList}
                onFileListUpdate={updateFileList}
                onFileUpdate={updateFile}
                onPreview={updateCurrentFile}
                notSupportBatchUpload={notSupportBatchUpload}
              />
              {isShowVectorSpaceFull && (
                <div className='max-w-[640px] mb-4'>
                  <VectorSpaceFull />
                </div>
              )}
              <Button disabled={nextDisabled} className={s.submitButton} variant='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
            </>
          )}
          {dataSourceType === DataSourceType.NOTION && (
            <>
              {!hasConnection && <NotionConnector onSetting={onSetting} />}
              {hasConnection && (
                <>
                  <div className='mb-8 w-[640px]'>
                    <NotionPageSelector
                      value={notionPages.map(page => page.page_id)}
                      onSelect={updateNotionPages}
                      onPreview={updateCurrentPage}
                    />
                  </div>
                  {isShowVectorSpaceFull && (
                    <div className='max-w-[640px] mb-4'>
                      <VectorSpaceFull />
                    </div>
                  )}
                  <Button disabled={isShowVectorSpaceFull || !notionPages.length} className={s.submitButton} variant='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
                </>
              )}
            </>
          )}
          {dataSourceType === DataSourceType.WEB && (
            <>
              <div className={cn('mb-8 w-[640px]', !shouldShowDataSourceTypeList && 'mt-12')}>
                <Website
                  onPreview={setCurrentWebsite}
                  checkedCrawlResult={websitePages}
                  onCheckedCrawlResultChange={updateWebsitePages}
                  onCrawlProviderChange={onWebsiteCrawlProviderChange}
                  onJobIdChange={onWebsiteCrawlJobIdChange}
                  crawlOptions={crawlOptions}
                  onCrawlOptionsChange={onCrawlOptionsChange}
                />
              </div>
              {isShowVectorSpaceFull && (
                <div className='max-w-[640px] mb-4'>
                  <VectorSpaceFull />
                </div>
              )}
              <Button disabled={isShowVectorSpaceFull || !websitePages.length} className={s.submitButton} variant='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
            </>
          )}
          {!datasetId && (
            <>
              <div className={cn(s.dividerLine, "dark:!bg-stone-600")} />
              <div onClick={modalShowHandle} className={s.OtherCreationOption}>{t('datasetCreation.stepOne.emptyDatasetCreation')}</div>
            </>
          )}
        </div>
        <EmptyDatasetCreationModal show={showModal} onHide={modalCloseHandle} />
      </div>
      {currentFile && <FilePreview file={currentFile} hidePreview={hideFilePreview} />}
      {currentNotionPage && <NotionPagePreview currentPage={currentNotionPage} hidePreview={hideNotionPagePreview} />}
      {currentWebsite && <WebsitePreview payload={currentWebsite} hidePreview={hideWebsitePreview} />}
    </div>
  )
}

export default StepOne
