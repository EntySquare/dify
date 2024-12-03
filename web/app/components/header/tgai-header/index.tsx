'use client'

import {EntyServiceType, useTGAIGlobalStore} from '@/context/tgai-global-context'
import cn from '@/utils/classnames'
import {RiInstagramFill, RiTwitterXLine} from '@remixicon/react'
import {useShallow} from 'zustand/react/shallow'
import {HeaderThemeSwitcher} from './header-theme-switcher'
import {HeaderUserProfile} from './header-user-profile'
import TruthSocial from '@/assets/TS-Logomark-BLK.svg'

type TGAIHeaderProps = {
  className?: string
}

export function TGAIHeader({ className }: TGAIHeaderProps) {
  const { serviceType, setServiceType } = useTGAIGlobalStore(useShallow(state => ({ serviceType: state.serviceType, setServiceType: state.setServiceType })))

  return (
    <header
      className={cn(
        'w-full flex items-center justify-between h-[60px] border-b shadow-xs px-8 bg-tgai-panel-background border-b-tgai-panel-border dark:border-b-stone-600',
        className,
      )}
    >
      {/* <TGAILogo */}
      {/*   className={classNames( */}
      {/*     " h-full w-auto py-1 text-tgai-text-1", */}
      {/*   )} */}
      {/* /> */}
      <div className={'flex gap-8'}>
        <RiTwitterXLine className={cn(serviceType === EntyServiceType.X ? 'text-tgai-primary' : 'text-tgai-text-1', 'cursor-pointer size-6')} onClick={() => setServiceType(EntyServiceType.X)} />
        <RiInstagramFill className={cn(serviceType === EntyServiceType.INSTAGRAM ? 'text-tgai-primary' : 'text-tgai-text-1', 'cursor-pointer size-6')} onClick={() => setServiceType(EntyServiceType.INSTAGRAM)} />
        <TruthSocial className={cn(serviceType === EntyServiceType.TRUTH_SOCIAL ? 'text-tgai-primary' : 'text-tgai-text-1', 'cursor-pointer size-6')} onClick={() => setServiceType(EntyServiceType.TRUTH_SOCIAL)} />
      </div>
      <div className="flex flex-row gap-8 items-center">
        {/* <HeaderAccountRestValid /> */}
        <HeaderThemeSwitcher />
        <HeaderUserProfile />
      </div>
    </header>
  )
}
