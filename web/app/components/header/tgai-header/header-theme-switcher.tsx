'use client'

import { useTGAIGlobalStore } from "@/context/tgai-global-context"
import { Theme } from "@/types/app"
import classNames from "@/utils/classnames"
import { Button } from "@arco-design/web-react"
import { IconSunFill, IconMoonFill } from "@arco-design/web-react/icon"
import React from "react"
import { useShallow } from "zustand/react/shallow"

type HeaderThemeSwitcherProps = {
    className?: string
}

const HeaderThemeSwitcher = React.memo(({ className }: HeaderThemeSwitcherProps) => {

    const { theme, setTheme } = useTGAIGlobalStore(useShallow(state => ({
        theme: state.theme,
        setTheme: state.setTheme
    })))

    return (
        <Button
            shape='circle'
            size="large"
            className={classNames('!flex justify-center items-center !text-base', className)}
            onClick={() => {
                setTheme(theme === Theme.dark ? Theme.light : Theme.dark)
            }}
            icon={theme === Theme.dark ? <IconMoonFill /> : <IconSunFill />}
        />
    )
})

HeaderThemeSwitcher.displayName = 'HeaderThemeSwitcher'

export { HeaderThemeSwitcher }
