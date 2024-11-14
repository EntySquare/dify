import {
  memo,
  useCallback,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import BlockIcon from '../block-icon'
import { BlockEnum } from '../types'
import type { ToolWithProvider } from '../types'
import IndexBar, { groupItems } from './index-bar'
import type { ToolDefaultValue } from './types'
import Tooltip from '../../base/tooltip'
import Empty from '../../tools/add-tool-modal/empty'
import { useGetLanguage } from '../../../../context/i18n'

type ToolsProps = {
  showWorkflowEmpty: boolean
  onSelect: (type: BlockEnum, tool?: ToolDefaultValue) => void
  tools: ToolWithProvider[]
}
const Blocks = ({
  showWorkflowEmpty,
  onSelect,
  tools,
}: ToolsProps) => {
  const { t } = useTranslation()
  const language = useGetLanguage()

  const { letters, groups: groupedTools } = groupItems(tools, tool => tool.label[language][0])
  const toolRefs = useRef({})

  const renderGroup = useCallback((toolWithProvider: ToolWithProvider) => {
    const list = toolWithProvider.tools

    return (
      <div
        key={toolWithProvider.id}
        className='mb-1 last-of-type:mb-0'
      >
        <div className='flex items-start px-3 h-[22px] text-xs font-medium text-tgai-text-2'>
          {toolWithProvider.label[language]}
        </div>
        {
          list.map(tool => (
            <Tooltip
              key={tool.name}
              selector={`workflow-block-tool-${tool.name}`}
              position='right'
              className='!p-0 !px-3 !py-2.5 !w-[200px] !leading-[18px] !text-xs !text-tgai-text-2 !border-[0.5px] !border-black/5 dark:!border-stone-600 !rounded-xl !shadow-lg dark:!shadow-stone-800'
              htmlContent={(
                <div>
                  <BlockIcon
                    size='md'
                    className='mb-2'
                    type={BlockEnum.Tool}
                    toolIcon={toolWithProvider.icon}
                  />
                  <div className='mb-1 text-sm leading-5 text-tgai-text-1'>{tool.label[language]}</div>
                  <div className='text-xs text-tgai-text-2 leading-[18px]'>{tool.description[language]}</div>
                </div>
              )}
              noArrow
            >
              <div
                className='flex items-center px-3 w-full h-8 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-600 cursor-pointer'
                onClick={() => onSelect(BlockEnum.Tool, {
                  provider_id: toolWithProvider.id,
                  provider_type: toolWithProvider.type,
                  provider_name: toolWithProvider.name,
                  tool_name: tool.name,
                  tool_label: tool.label[language],
                  title: tool.label[language],
                })}
              >
                <BlockIcon
                  className='mr-2 shrink-0'
                  type={BlockEnum.Tool}
                  toolIcon={toolWithProvider.icon}
                />
                <div className='text-sm text-tgai-text-1 truncate'>{tool.label[language]}</div>
              </div>
            </Tooltip>
          ))
        }
      </div>
    )
  }, [onSelect, language])

  const renderLetterGroup = (letter) => {
    const tools = groupedTools[letter]
    return (
      <div
        key={letter}
        ref={el => (toolRefs.current[letter] = el)}
      >
        {tools.map(renderGroup)}
      </div>
    )
  }

  return (
    <div className='p-1 max-w-[320px] max-h-[464px] overflow-y-auto tgai-custom-scrollbar'>
      {
        !tools.length && !showWorkflowEmpty && (
          <div className='flex items-center px-3 h-[22px] text-xs font-medium text-tgai-text-2'>{t('workflow.tabs.noResult')}</div>
        )
      }
      {!tools.length && showWorkflowEmpty && (
        <div className='py-10'>
          <Empty />
        </div>
      )}
      {!!tools.length && letters.map(renderLetterGroup)}
      {tools.length > 10 && <IndexBar letters={letters} itemRefs={toolRefs} />}
    </div>
  )
}

export default memo(Blocks)
