import React from 'react'
import type { ReactNode } from 'react'
import SwrInitor from '../components/swr-initor'
import { AppContextProvider } from '../../context/app-context'
import GA, { GaType } from '../components/base/ga'
import HeaderWrapper from '../components/header/header-wrapper'
import Header from '../components/header'
import { EventEmitterContextProvider } from '../../context/event-emitter'
import { ProviderContextProvider } from '../../context/provider-context'
import { ModalContextProvider } from '../../context/modal-context'
import SiderMenu from '../components/menu/sider-menu'
import { TGAIHeader } from '@/app/components/header/tgai-header'
import { TGAIWebSocketProvider } from '@/app/components/http/tgai-ws-provider'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <GA gaType={GaType.admin} />
      <SwrInitor>
        <AppContextProvider>
          <EventEmitterContextProvider>
            <ProviderContextProvider>
              <ModalContextProvider >
                <TGAIWebSocketProvider>
                  <TGAIHeader />
                  <div className='flex overflow-hidden h-full w-full flex-row'>
                    <SiderMenu />
                    <main className='flex-1 h-full overflow-y-auto flex flex-col w-full bg-tgai-section-background tgai-custom-scrollbar border-l-tgai-panel-border dark:border-l-stone-600 border-l'>

                      <div className='flex flex-col h-full'>
                        <HeaderWrapper>
                          <Header />
                        </HeaderWrapper>
                        {children}

                      </div>
                    </main>
                  </div>
                </TGAIWebSocketProvider>
              </ModalContextProvider>

            </ProviderContextProvider>
          </EventEmitterContextProvider>
        </AppContextProvider>
      </SwrInitor>
    </>
  )
}

export const metadata = {
  title: 'TGAI',
}

export default Layout
