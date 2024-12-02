import type {
  FC,
  ReactNode,
} from 'react'
import {
  memo,
  useEffect, useMemo, useRef, useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import type {
  ChatConfig,
  ChatItem,
} from '../../types'
import { ChatResponseTypes } from '../../types'
import Operation from './operation'
import AgentContent from './agent-content'
import BasicContent from './basic-content'
import SuggestedQuestions from './suggested-questions'
import More from './more'
import WorkflowProcess from './workflow-process'
import TaskMessageContent from '@/app/components/enty-chat/chat/answer/task-content/task-message-content'
import LoadingAnim from '@/app/components/base/chat/chat/loading-anim'
import Citation from '@/app/components/base/chat/chat/citation'
import { EditTitle } from '@/app/components/app/annotation/edit-annotation-modal/edit-item'
import type { AppData } from '@/models/share'
import AnswerIcon from '@/app/components/base/answer-icon'
import { ChevronRight } from '@/app/components/base/icons/src/vender/line/arrows'
import cn from '@/utils/classnames'
import { FileList } from '@/app/components/base/file-uploader'
import TaskTweetsContent from '@/app/components/enty-chat/chat/answer/task-content/task-tweets-content'
import TaskCommentContent from '@/app/components/enty-chat/chat/answer/task-content/task-comment-content'

type AnswerProps = {
  item: ChatItem
  question: string
  index: number
  config?: ChatConfig
  answerIcon?: ReactNode
  responding?: boolean
  showPromptLog?: boolean
  chatAnswerContainerInner?: string
  hideProcessDetail?: boolean
  appData?: AppData
  noChatInput?: boolean
  switchSibling?: (siblingMessageId: string) => void
}
const Answer: FC<AnswerProps> = ({
  item,
  question,
  index,
  config,
  answerIcon,
  responding,
  showPromptLog,
  chatAnswerContainerInner,
  hideProcessDetail,
  appData,
  noChatInput,
  switchSibling,
}) => {
  const { t } = useTranslation()
  const {
    content,
    citation,
    agent_thoughts,
    more,
    annotation,
    workflowProcess,
    allFiles,
    message_files,
  } = item
  const hasAgentThoughts = !!agent_thoughts?.length

  const [containerWidth, setContainerWidth] = useState(0)
  const [contentWidth, setContentWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const replyType = useMemo<ChatResponseTypes>(() => {
    try {
      const parsedContent = JSON.parse(content)
      if (typeof parsedContent === 'object' && !Array.isArray(parsedContent))
        return ChatResponseTypes.TWEETS_GENERATION
      else return ChatResponseTypes.PLAIN_TEXT
    }
    catch (err) {
      return ChatResponseTypes.PLAIN_TEXT
    }
  }, [content])

  console.log(replyType, content)

  const getContainerWidth = () => {
    if (containerRef.current)
      setContainerWidth(containerRef.current?.clientWidth + 16)
  }
  useEffect(() => {
    getContainerWidth()
  }, [])

  const getContentWidth = () => {
    if (contentRef.current)
      setContentWidth(contentRef.current?.clientWidth)
  }

  useEffect(() => {
    if (!responding)
      getContentWidth()
  }, [responding])

  // Recalculate contentWidth when content changes (e.g., SVG preview/source toggle)
  useEffect(() => {
    if (!containerRef.current)
      return
    const resizeObserver = new ResizeObserver(() => {
      getContentWidth()
    })
    resizeObserver.observe(containerRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className='flex mb-2 last:mb-0'>
      <div className='shrink-0 relative w-10 h-10'>
        {answerIcon || <AnswerIcon />}
        {responding && (
          <div className='absolute -top-[3px] -left-[3px] pl-[6px] flex items-center w-4 h-4 bg-white rounded-full shadow-xs border-[0.5px] border-gray-50'>
            <LoadingAnim type='avatar' />
          </div>
        )}
      </div>
      <div className='chat-answer-container group grow w-0 ml-4' ref={containerRef}>
        <div className={cn('group relative pr-10', chatAnswerContainerInner)}>
          <div
            ref={contentRef}
            className={cn('relative inline-block px-4 py-3 max-w-full bg-gray-100 dark:bg-tgai-input-background rounded-2xl text-sm text-tgai-text-1', workflowProcess && 'w-full')}
          >
            {
              !responding && (
                <Operation
                  hasWorkflowProcess={!!workflowProcess}
                  maxSize={containerWidth - contentWidth - 4}
                  contentWidth={contentWidth}
                  item={item}
                  question={question}
                  index={index}
                  showPromptLog={showPromptLog}
                  noChatInput={noChatInput}
                />
              )
            }
            {/** Render the normal steps */}
            {
              workflowProcess && !hideProcessDetail && (
                <WorkflowProcess
                  data={workflowProcess}
                  item={item}
                  hideProcessDetail={hideProcessDetail}
                />
              )
            }
            {/** Hide workflow steps by it's settings in siteInfo */}
            {
              workflowProcess && hideProcessDetail && appData && appData.site.show_workflow_steps && (
                <WorkflowProcess
                  data={workflowProcess}
                  item={item}
                  hideProcessDetail={hideProcessDetail}
                />
              )
            }
            {
              responding && !content && !hasAgentThoughts && (
                <div className='flex items-center justify-center w-6 h-5'>
                  <LoadingAnim type='text' />
                </div>
              )
            }
            {
              !responding && content && !hasAgentThoughts && (
                <>
                  {!content.includes('生成推文') && !content.includes('生成推文评论') && <BasicContent item={item} />}
                  {content.includes('生成推文') && !content.includes('推文评论') && <TaskTweetsContent content={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis congue dolor, id pellentesque leo. Ut luctus mattis neque eu consequat. Maecenas sapien diam, semper eu quam eu, efficitur facilisis massa. Praesent aliquet quis odio in dignissim. Mauris ac arcu eget eros tristique accumsan non ac eros. Etiam fringilla pretium imperdiet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam eget mi quis neque ultricies faucibus. Integer faucibus orci nec felis commodo porta. Etiam ut turpis sit amet leo commodo congue id id ipsum. Suspendisse sit amet neque vitae justo convallis sodales eu id nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus.'}/> }
                  {content.includes('生成推文评论') && content !== '生成推文' && <TaskCommentContent content={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis congue dolor, id pellentesque leo. Ut luctus mattis neque eu consequat. Maecenas sapien diam, semper eu quam eu, efficitur facilisis massa. Praesent aliquet quis odio in dignissim. Mauris ac arcu eget eros tristique accumsan non ac eros. Etiam fringilla pretium imperdiet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam eget mi quis neque ultricies faucibus. Integer faucibus orci nec felis commodo porta. Etiam ut turpis sit amet leo commodo congue id id ipsum. Suspendisse sit amet neque vitae justo convallis sodales eu id nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus.'} /> }
                  {content.includes('生成私信回复') && <TaskMessageContent content={'Hi! What\'s up! How\'s everything with utilitynet? Really interested in the latest progress!'} /> }
                </>
              )
            }
            {
              hasAgentThoughts && (
                <AgentContent
                  item={item}
                  responding={responding}
                />
              )
            }
            {
              !!allFiles?.length && (
                <FileList
                  className='my-1'
                  files={allFiles}
                  showDeleteAction={false}
                  showDownloadAction
                  canPreview
                />
              )
            }
            {
              !!message_files?.length && (
                <FileList
                  className='my-1'
                  files={message_files}
                  showDeleteAction={false}
                  showDownloadAction
                  canPreview
                />
              )
            }
            {
              annotation?.id && annotation.authorName && (
                <EditTitle
                  className='mt-1'
                  title={t('appAnnotation.editBy', { author: annotation.authorName })}
                />
              )
            }
            <SuggestedQuestions item={item} />
            {
              !!citation?.length && !responding && (
                <Citation data={citation} showHitInfo={config?.supportCitationHitInfo} />
              )
            }
            {item.siblingCount && item.siblingCount > 1 && item.siblingIndex !== undefined && <div className="pt-3.5 flex justify-center items-center text-sm">
              <button
                className={`${item.prevSibling ? 'opacity-100' : 'opacity-65'}`}
                disabled={!item.prevSibling}
                onClick={() => item.prevSibling && switchSibling?.(item.prevSibling)}
              >
                <ChevronRight className="w-[14px] h-[14px] rotate-180 text-gray-500" />
              </button>
              <span className="px-2 text-xs text-gray-700">{item.siblingIndex + 1} / {item.siblingCount}</span>
              <button
                className={`${item.nextSibling ? 'opacity-100' : 'opacity-65'}`}
                disabled={!item.nextSibling}
                onClick={() => item.nextSibling && switchSibling?.(item.nextSibling)}
              >
                <ChevronRight className="w-[14px] h-[14px] text-gray-500" />
              </button>
            </div>}
          </div>
        </div>
        <More more={more} />
      </div>
    </div>
  )
}

export default memo(Answer)
