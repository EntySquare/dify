'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useBoolean } from 'ahooks'
import {
  RiDatabase2Line,
  RiFileExcel2Line,
  RiGitCommitLine,
  RiNewspaperLine,
  RiPresentationLine,
  RiRoadMapLine,
  RiTerminalBoxLine,
  RiTranslate,
  RiUser2Line,
} from '@remixicon/react'
import cn from 'classnames'
import s from './style.module.css'
import Modal from '../../../../base/modal'
import Button from '../../../../base/button'
import Toast from '../../../../base/toast'
import { generateRule } from '../../../../../../service/debug'
import ConfigPrompt from '../../config-prompt'
import type { Model } from '../../../../../../types/app'
import { AppType } from '../../../../../../types/app'
import ConfigVar from '../../config-var'
import OpeningStatement from '../../features/chat-group/opening-statement'
import GroupName from '../../base/group-name'
import Loading from '../../../../base/loading'
import Confirm from '../../../../base/confirm'

// type
import type { AutomaticRes } from '../../../../../../service/debug'
import { Generator } from '../../../../base/icons/src/vender/other'

export type IGetAutomaticResProps = {
  mode: AppType
  model: Model
  isShow: boolean
  onClose: () => void
  onFinished: (res: AutomaticRes) => void
  isInLLMNode?: boolean
}

const TryLabel: FC<{
  Icon: any
  text: string
  onClick: () => void
}> = ({ Icon, text, onClick }) => {
  return (
    <div
      className='mt-2 mr-1 shrink-0 flex h-7 items-center px-2 bg-gray-100 dark:bg-neutral-700 rounded-lg cursor-pointer'
      onClick={onClick}
    >
      <Icon className='w-4 h-4 text-tgai-text-3'></Icon>
      <div className='ml-1 text-xs font-medium text-tgai-text-2'>{text}</div>
    </div>
  )
}

const GetAutomaticRes: FC<IGetAutomaticResProps> = ({
  mode,
  model,
  isShow,
  onClose,
  isInLLMNode,
  onFinished,
}) => {
  const { t } = useTranslation()

  const tryList = [
    {
      icon: RiTerminalBoxLine,
      key: 'pythonDebugger',
    },
    {
      icon: RiTranslate,
      key: 'translation',
    },
    {
      icon: RiPresentationLine,
      key: 'meetingTakeaways',
    },
    {
      icon: RiNewspaperLine,
      key: 'writingsPolisher',
    },
    {
      icon: RiUser2Line,
      key: 'professionalAnalyst',
    },
    {
      icon: RiFileExcel2Line,
      key: 'excelFormulaExpert',
    },
    {
      icon: RiRoadMapLine,
      key: 'travelPlanning',
    },
    {
      icon: RiDatabase2Line,
      key: 'SQLSorcerer',
    },
    {
      icon: RiGitCommitLine,
      key: 'GitGud',
    },
  ]

  const [instruction, setInstruction] = React.useState<string>('')
  const handleChooseTemplate = useCallback((key: string) => {
    return () => {
      const template = t(`appDebug.generate.template.${key}.instruction`)
      setInstruction(template)
    }
  }, [t])
  const isValid = () => {
    if (instruction.trim() === '') {
      Toast.notify({
        type: 'error',
        message: t('common.errorMsg.fieldRequired', {
          field: t('appDebug.generate.instruction'),
        }),
      })
      return false
    }
    return true
  }
  const [isLoading, { setTrue: setLoadingTrue, setFalse: setLoadingFalse }] = useBoolean(false)
  const [res, setRes] = React.useState<AutomaticRes | null>(null)

  const renderLoading = (
    <div className='w-0 grow flex flex-col items-center justify-center h-full space-y-3'>
      <Loading />
      <div className='text-[13px] text-tgai-text-3'>{t('appDebug.generate.loading')}</div>
    </div>
  )

  const renderNoData = (
    <div className='w-0 grow flex flex-col items-center px-8 justify-center h-full space-y-3'>
      <Generator className='w-14 h-14 text-tgai-text-3' />
      <div className='leading-5 text-center text-[13px] font-normal text-tgai-text-3'>
        <div>{t('appDebug.generate.noDataLine1')}</div>
        <div>{t('appDebug.generate.noDataLine2')}</div>
      </div>
    </div>
  )

  const onGenerate = async () => {
    if (!isValid())
      return
    if (isLoading)
      return
    setLoadingTrue()
    try {
      const { error, ...res } = await generateRule({
        instruction,
        model_config: model,
        no_variable: !!isInLLMNode,
      })
      setRes(res)
      if (error) {
        Toast.notify({
          type: 'error',
          message: error,
        })
      }
    }
    finally {
      setLoadingFalse()
    }
  }

  const [showConfirmOverwrite, setShowConfirmOverwrite] = React.useState(false)

  const isShowAutoPromptResPlaceholder = () => {
    return !isLoading && !res
  }

  return (
    <Modal
      isShow={isShow}
      onClose={onClose}
      className='!p-0 min-w-[1140px] dark:!bg-tgai-panel-background dark:!border-stone-600 dark:!border'
      closable
    >
      <div className='flex h-[680px] flex-wrap'>
        <div className='w-[570px] shrink-0 p-6 h-full overflow-y-auto tgai-custom-scrollbar border-r border-gray-100 dark:border-stone-700'>
          <div className='mb-8'>
            <div className={`leading-[28px] text-lg font-bold ${s.textGradient}`}>{t('appDebug.generate.title')}</div>
            <div className='mt-1 text-[13px] font-normal text-tgai-text-3'>{t('appDebug.generate.description')}</div>
          </div>
          <div >
            <div className='flex items-center'>
              <div className='mr-3 shrink-0 leading-[18px] text-xs font-semibold text-tgai-text-3 uppercase'>{t('appDebug.generate.tryIt')}</div>
              <div className='grow h-px bg-gradient-to-r from-[rgba(243,_244,_246,_1) to-[rgba(243,_244,_246,_0)] dark:from-zinc-600 dark:to-zinc-600/0'></div>
            </div>
            <div className='flex flex-wrap'>
              {tryList.map(item => (
                <TryLabel
                  key={item.key}
                  Icon={item.icon}
                  text={t(`appDebug.generate.template.${item.key}.name`)}
                  onClick={handleChooseTemplate(item.key)}
                />
              ))}
            </div>
          </div>
          {/* inputs */}
          <div className='mt-6'>
            <div className='text-[0px]'>
              <div className='mb-2 leading-5 text-sm font-medium text-tgai-text-1'>{t('appDebug.generate.instruction')}</div>
              <textarea className="w-full h-[200px] overflow-y-auto tgai-custom-scrollbar px-3 py-2 text-sm bg-gray-50 dark:bg-tgai-input-background text-tgai-text-1 rounded-lg" placeholder={t('appDebug.generate.instructionPlaceHolder') as string} value={instruction} onChange={e => setInstruction(e.target.value)} />
            </div>

            <div className='mt-5 flex justify-end'>
              <Button
                className='flex space-x-1'
                variant='primary'
                onClick={onGenerate}
                disabled={isLoading}
              >
                <Generator className='w-4 h-4 text-white' />
                <span className='text-xs font-semibold text-white'>{t('appDebug.generate.generate')}</span>
              </Button>
            </div>
          </div>
        </div>

        {(!isLoading && res) && (
          <div className='w-0 grow p-6 pb-0 h-full'>
            <div className='shrink-0 mb-3 leading-[160%] text-base font-semibold text-tgai-text-1'>{t('appDebug.generate.resTitle')}</div>
            <div className={cn('max-h-[555px] overflow-y-auto tgai-custom-scrollbar', !isInLLMNode && 'pb-2')}>
              <ConfigPrompt
                mode={mode}
                promptTemplate={res?.prompt || ''}
                promptVariables={[]}
                readonly
                noTitle={isInLLMNode}
                gradientBorder
                editorHeight={isInLLMNode ? 524 : 0}
                noResize={isInLLMNode}
              />
              {!isInLLMNode && (
                <>
                  {(res?.variables?.length && res?.variables?.length > 0)
                    ? (
                      <ConfigVar
                        promptVariables={res?.variables.map(key => ({ key, name: key, type: 'string', required: true })) || []}
                        readonly
                      />
                    )
                    : ''}

                  {(mode !== AppType.completion && res?.opening_statement) && (
                    <div className='mt-7'>
                      <GroupName name={t('appDebug.feature.groupChat.title')} />
                      <OpeningStatement
                        value={res?.opening_statement || ''}
                        readonly
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className='flex justify-end py-4 bg-white dark:bg-tgai-panel-background'>
              <Button onClick={onClose}>{t('common.operation.cancel')}</Button>
              <Button variant='primary' className='ml-2' onClick={() => {
                setShowConfirmOverwrite(true)
              }}>{t('appDebug.generate.apply')}</Button>
            </div>
          </div>
        )}
        {isLoading && renderLoading}
        {isShowAutoPromptResPlaceholder() && renderNoData}
        {showConfirmOverwrite && (
          <Confirm
            title={t('appDebug.generate.overwriteTitle')}
            content={t('appDebug.generate.overwriteMessage')}
            isShow={showConfirmOverwrite}
            onConfirm={() => {
              setShowConfirmOverwrite(false)
              onFinished(res!)
            }}
            onCancel={() => setShowConfirmOverwrite(false)}
          />
        )}
      </div>
    </Modal>
  )
}
export default React.memo(GetAutomaticRes)
