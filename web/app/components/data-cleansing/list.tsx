'use client'

import React, { useState } from "react"
import DataCleansingFileDownload from "./download-file"
import cn from "@/utils/classnames"
import DataCleansingFilePreviewModal from "./file-preview-modal"

type Props = {
    data: string[]
}

const DataCleansingFileList = React.memo<Props>(({ data }) => {

    const tbodyTdClass = "p-[5px_10px_5px_12px] box-border max-w-[200px]"
    const theadTdClass = "p-[0px_10px_0px_12px] box-border max-w-[200px]"

    const [previewFile, setPreviewFile] = useState<string>()


    return (
        <div className='w-full h-full overflow-x-auto'>
            <table className={`min-w-[700px] max-w-full w-full border-collapse border-0 text-sm mt-3`}>
                <thead className="h-8 leading-8 border-b border-gray-200 dark:border-zinc-600 text-tgai-text-2 font-medium text-xs uppercase">
                    <tr>
                        {/* <td className='w-12'>#</td> */}
                        <td>
                            <div className={cn('flex', theadTdClass)}>
                                文件名
                            </div>
                        </td>
                        <td className={cn('w-20', theadTdClass)}>操作</td>
                    </tr>
                </thead>
                <tbody className="text-tgai-text-1">
                    {data.map((name, index) => {
                        return <tr
                            key={index}
                            className={'border-b border-gray-200 dark:border-zinc-600 h-8 hover:bg-gray-50 dark:hover:bg-stone-700 cursor-pointer'}
                            onClick={() => {
                                setPreviewFile(name)
                            }}>
                            {/* <td className={cn('text-left align-middle text-tgai-text-2 text-xs', tbodyTdClass)}>{index + 1}</td> */}
                            <td className={cn(tbodyTdClass)}>
                                <div className='group flex items-center justify-between'>
                                    <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                        {name}
                                    </span>
                                    {/* <div className='group-hover:flex hidden'>
                                        <TooltipPlus popupContent={t('datasetDocuments.list.table.rename')}>
                                            <div
                                                className='p-1 rounded-md cursor-pointer hover:bg-black/5'
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleShowRenameModal(doc)
                                                }}
                                            >
                                                <Edit03 className='w-4 h-4 text-tgai-text-3' />
                                            </div>
                                        </TooltipPlus>
                                    </div> */}
                                </div>
                            </td>
                            <td className={cn(tbodyTdClass)}>
                                {/* <OperationAction
                                    embeddingAvailable={embeddingAvailable}
                                    datasetId={datasetId}
                                    detail={pick(doc, ['name', 'enabled', 'archived', 'id', 'data_source_type', 'doc_form'])}
                                    onUpdate={onUpdate}
                                /> */}
                                <DataCleansingFileDownload filename={name} className="max-h-5" />
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>

            {/* {isShowRenameModal && currDocument && (
                <RenameModal
                    datasetId={datasetId}
                    documentId={currDocument.id}
                    name={currDocument.name}
                    onClose={setShowRenameModalFalse}
                    onSaved={handleRenamed}
                />
            )
            }) */}
            <DataCleansingFilePreviewModal filename={previewFile} onCancel={() => setPreviewFile(undefined)} />
        </div>
    )
})


DataCleansingFileList.displayName = "DataCleansingFileList"

export default DataCleansingFileList