'use client'

import Button from "@/app/components/base/button"
import { getDataCleansingFileDownload } from "@/service/tgai"
import React, { useCallback, useState } from "react"
import Toast from "@/app/components/base/toast"
import cn from "@/utils/classnames"

type Props = {
    filename: string
    className?: string
}

const DataCleansingFileDownload = React.memo<Props>(({ filename, className }) => {

    const [isLoading, setIsLoading] = useState(false)

    const getDownloadFile = useCallback(async () => {
        if (isLoading) return

        try {
            setIsLoading(true)
            const res = await getDataCleansingFileDownload(filename) as any

            if (typeof res !== 'string') return
            const blob = new Blob([res], { type: "text/plain;charset=utf-8" });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = filename; // Filename will appear correctly, even if it contains Chinese
            document.body.appendChild(a);

            // Trigger the download
            a.click();

            // Clean up the link
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            Toast.notify({
                type: "success",
                message: "文件下载成功！"
            })
        } catch {
        } finally {
            setIsLoading(false)
        }
    }, [filename, isLoading])

    return (
        <Button variant={'primary'} className={cn("", className)} onClick={getDownloadFile} loading={isLoading} disabled={isLoading}>下载</Button>
    )
})

export default DataCleansingFileDownload