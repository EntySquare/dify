'use client'

import { FC, useCallback, useEffect, useMemo, useState } from "react"
import Input from "@/app/components/base/input"
import Pagination from '@/app/components/base/pagination'
import useSWR from "swr"
import { fetchDataCleansingFileList } from "@/service/tgai"
import DataCleansingFileList from "./list"

const PAGE_LIMIT = 15
const DataCleansingContainer: FC = () => {

    const [searchValue, setSearchValue] = useState("")
    const [currPage, setCurrPage] = useState(0)

    const { data } = useSWR(['/api/file/list'], fetchDataCleansingFileList)

    const filteredFileList = useMemo(() => {
        return data ? data.data.filter(name => name.includes(searchValue)) : undefined
    }, [data, searchValue])

    const filteredTotal = filteredFileList ? filteredFileList.length : 0
    const filteredTotalPages = Math.ceil(filteredTotal / PAGE_LIMIT)

    const paginationFileList = useMemo(() => {
        if (!filteredFileList) return undefined

        else if (filteredFileList.length <= PAGE_LIMIT) return filteredFileList

        else {

            const start = currPage * PAGE_LIMIT

            return currPage === filteredTotalPages ? filteredFileList.slice(start) : filteredFileList.slice(start, (currPage + 1) * PAGE_LIMIT)

        }

    }, [filteredFileList, filteredTotal, currPage, filteredTotalPages])

    const handlePageChange = useCallback((page: number) => {
        if (page > filteredTotalPages || page < 0) return
        setCurrPage(page)
    }, [filteredTotalPages])

    return (
        <div className="bg-tgai-panel-background grow overflow-hidden">
            <div className="flex flex-col h-full overflow-y-auto tgai-custom-scrollbar px-12">
                <div className="pt-4 flex flex-col justify-center gap-1">
                    <h1 className="text-tgai-text-1 text-xl font-medium">数据集散中心</h1>
                </div>
                <div className='flex flex-col py-4 flex-1'>
                    <div className='flex items-center justify-between flex-wrap'>
                        <Input
                            showPrefix
                            wrapperClassName='!w-[200px]'
                            className='!h-8 !text-[13px]'
                            onChange={(v) => {
                                setCurrPage(0)
                                setSearchValue(v)
                            }}
                            value={searchValue}
                        />
                    </div>
                    {paginationFileList && <DataCleansingFileList data={paginationFileList} />}
                    {filteredTotal > PAGE_LIMIT && <Pagination current={currPage} onChange={handlePageChange} total={filteredTotal} limit={PAGE_LIMIT} />}
                </div>
            </div>
        </div>
    )
}

export default DataCleansingContainer