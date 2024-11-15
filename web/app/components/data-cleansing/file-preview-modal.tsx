'use client'

import Modal from "@/app/components/base/modal"
import { RiCloseLine } from "@remixicon/react"
import React, { useMemo } from "react"
import AutoHeightTextarea from "@/app/components/base/auto-height-textarea/common"
import useSWR from "swr"
import { getDataCleansingFileDownload } from "@/service/tgai"
import Divider from "@/app/components/base/divider"
import DataCleansingFileDownload from "./download-file"
import Loading from "@/app/components/base/loading"

type Props = {
    filename?: string
    onCancel: () => void
}

const DataCleansingFilePreviewModal = React.memo<Props>(({ filename, onCancel }) => {

    const { data, isLoading } = useSWR(filename ? ["/file/download/" + filename] : null, filename ? () => getDataCleansingFileDownload(filename) : null)

    const content = useMemo(() => {

        if (data === undefined || typeof data !== 'string') return ""

        const content = data as any

        return content

    }, [data])

    return (
        <Modal isShow={!!filename} className='!max-w-[640px] dark:!bg-tgai-panel-background-3 dark:border dark:border-stone-600'>
            <div className={'flex flex-col relative'}>
                <div className='flex items-center justify-between h-7'>
                    <div className="text-tgai-text-1 text-xl font-semibold truncate">
                        {filename}
                    </div>
                    <div className='flex justify-center items-center w-6 h-6 cursor-pointer' onClick={onCancel}>
                        <RiCloseLine className='w-4 h-4 text-tgai-text-3' />
                    </div>
                </div>
                <div className="my-4 overflow-y-auto h-96 break-all tgai-custom-scrollbar">

                    {data !== undefined && content.length !== 0 && <AutoHeightTextarea
                        className='leading-6 rounded-xl text-md py-2 px-4 text-tgai-text-1'
                        onChange={() => { }}
                        value={content}
                        disabled={true} />}
                    {isLoading && <div className="size-full flex justify-center items-center">
                        <Loading />
                    </div>}
                    {data !== undefined && content.length === 0 && <div className="size-full flex justify-center items-center text-tgai-text-1">
                        文件内容为空或文件内容无法预览。
                    </div>}
                </div>
                {filename && data !== undefined && content.length > 0 && !isLoading && <>
                    <Divider />
                    <div className="flex flex-wrap flex-row items-center justify-end mt-2">
                        <DataCleansingFileDownload filename={filename} />
                    </div>
                </>
                }

            </div>
        </Modal>
    )
})

DataCleansingFilePreviewModal.displayName = "DataCleansingFilePreviewModal"

export default DataCleansingFilePreviewModal