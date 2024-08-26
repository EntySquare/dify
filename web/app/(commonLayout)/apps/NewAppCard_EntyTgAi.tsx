'use client'

import { useRouter } from 'next/navigation'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useContext, useContextSelector } from 'use-context-selector'
import { getRedirection } from '@/utils/app-redirection'
import AppsContext, { useAppContext } from '@/context/app-context'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { ToastContext } from '@/app/components/base/toast'
import { createAppChatOneV1 } from '@/service/apps'

export type CreateAppCardProps = {
  onSuccess?: () => void
}

// eslint-disable-next-line react/display-name
const CreateAppCardEntyTgAi = forwardRef<HTMLAnchorElement, CreateAppCardProps>(({ onSuccess }, ref) => {
  const { notify } = useContext(ToastContext)
  const { t } = useTranslation()
  const mutateApps = useContextSelector(AppsContext, state => state.mutateApps)
  const { push } = useRouter()
  const { isCurrentWorkspaceEditor } = useAppContext()
  const createInChatOneV1 = async () => {
    try {
      const app = await createAppChatOneV1({
        name: '',
        description: '',
        icon_type: 'emoji',
        icon: '🤖',
        icon_background: '#FFEAD5',
        mode: 'workflow',
      })
      notify({
        type: 'success',
        message: t('app.newApp.appCreated'),
      })
      mutateApps()
      localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, '1')
      getRedirection(isCurrentWorkspaceEditor, app, push)
    }
    catch (e) {
      notify({
        type: 'error',
        message: t('app.newApp.appCreateFailed'),
      })
    }
    // onSave(newContent)
    // setIsEdit(false)
  }

  return (
    <a
      ref={ref}
      className='relative col-span-1 flex flex-col justify-between min-h-[160px] bg-gray-200 rounded-xl border-[0.5px] border-black/5'
    >
      <div className='grow p-2 rounded-t-xl'>
        <div className='px-6 pt-2 pb-1 text-xs font-medium leading-[18px] text-gray-500'>TG AI 工作流</div>
        <div className='flex items-center mb-1 px-6 py-[7px] rounded-lg text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:text-primary-600 hover:bg-white' onClick={createInChatOneV1}>
          {/* <FilePlus01 className='shrink-0 mr-2 w-4 h-4' /> */}
          创建 单聊模版
        </div>
        <div className='flex items-center px-6 py-[7px] rounded-lg text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:text-primary-600 hover:bg-white'>
          {/* <FilePlus02 className='shrink-0 mr-2 w-4 h-4' /> */}
          创建 群聊模版 （待开放）
        </div>
      </div>
      {/* <CreateAppModal */}
      {/*   show={showNewAppModal} */}
      {/*   onClose={() => setShowNewAppModal(false)} */}
      {/*   onSuccess={() => { */}
      {/*     onPlanInfoChanged() */}
      {/*     if (onSuccess) */}
      {/*       onSuccess() */}
      {/*   }} */}
      {/* /> */}
      {/* <CreateAppTemplateDialog */}
      {/*   show={showNewAppTemplateDialog} */}
      {/*   onClose={() => setShowNewAppTemplateDialog(false)} */}
      {/*   onSuccess={() => { */}
      {/*     onPlanInfoChanged() */}
      {/*     if (onSuccess) */}
      {/*       onSuccess() */}
      {/*   }} */}
      {/* /> */}
      {/* <CreateFromDSLModal */}
      {/*   show={showCreateFromDSLModal} */}
      {/*   onClose={() => { */}
      {/*     setShowCreateFromDSLModal(false) */}

      {/*     if (dslUrl) */}
      {/*       replace('/') */}
      {/*   }} */}
      {/*   activeTab={activeTab} */}
      {/*   dslUrl={dslUrl} */}
      {/*   onSuccess={() => { */}
      {/*     onPlanInfoChanged() */}
      {/*     if (onSuccess) */}
      {/*       onSuccess() */}
      {/*   }} */}
      {/* /> */}
    </a>
  )
})

export default CreateAppCardEntyTgAi
