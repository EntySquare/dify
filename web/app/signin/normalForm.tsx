'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { RiDoorLockLine } from '@remixicon/react'
import Loading from '../components/base/loading'
import MailAndCodeAuth from './components/mail-and-code-auth'
import MailAndPasswordAuth from './components/mail-and-password-auth'
import SocialAuth from './components/social-auth'
import SSOAuth from './components/sso-auth'
import cn from '@/utils/classnames'
import { getSystemFeatures, invitationCheck } from '@/service/common'
import { defaultSystemFeatures } from '@/types/feature'
import Toast from '@/app/components/base/toast'
import { IS_CE_EDITION } from '@/config'
import { TGAIPost } from '@/service/http'


const NormalForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const consoleToken = decodeURIComponent(searchParams.get('access_token') || '')
  const refreshToken = decodeURIComponent(searchParams.get('refresh_token') || '')
  const message = decodeURIComponent(searchParams.get('message') || '')
  const invite_token = decodeURIComponent(searchParams.get('invite_token') || '')
  const [isLoading, setIsLoading] = useState(true)
  const [systemFeatures, setSystemFeatures] = useState(defaultSystemFeatures)
  const [authType, updateAuthType] = useState<'code' | 'password'>('password')
  const [showORLine, setShowORLine] = useState(false)
  const [allMethodsAreDisabled, setAllMethodsAreDisabled] = useState(false)
  const [workspaceName, setWorkSpaceName] = useState('')

  const isInviteLink = Boolean(invite_token && invite_token !== 'null')

  const init = useCallback(async () => {
    try {
      if (consoleToken && refreshToken) {
        localStorage.setItem('console_token', consoleToken)
        localStorage.setItem('refresh_token', refreshToken)
        router.replace('/apps')
        return
      }

      if (message) {
        Toast.notify({
          type: 'error',
          message,
        })
      }
      const features = await getSystemFeatures()
      const allFeatures = { ...defaultSystemFeatures, ...features }
      setSystemFeatures(allFeatures)
      setAllMethodsAreDisabled(!allFeatures.enable_social_oauth_login && !allFeatures.enable_email_code_login && !allFeatures.enable_email_password_login && !allFeatures.sso_enforced_for_signin)
      setShowORLine((allFeatures.enable_social_oauth_login || allFeatures.sso_enforced_for_signin) && (allFeatures.enable_email_code_login || allFeatures.enable_email_password_login))
      updateAuthType(allFeatures.enable_email_password_login ? 'password' : 'code')
      if (isInviteLink) {
        const checkRes = await invitationCheck({
          url: '/activate/check',
          params: {
            token: invite_token,
          },
        })
        setWorkSpaceName(checkRes?.data?.workspace_name || '')
      }
    }
    catch (error) {
      console.error(error)
      setAllMethodsAreDisabled(true)
      setSystemFeatures(defaultSystemFeatures)
    }
    finally { setIsLoading(false) }
  }, [consoleToken, refreshToken, message, router, invite_token, isInviteLink])
  useEffect(() => {
    init()
  }, [init])
  if (isLoading || consoleToken) {
    return <div className={
      cn(
        'flex flex-col items-center w-full grow justify-center',
        'px-6',
        'md:px-[108px]',
      )
    }>
      <Loading type='area' />
    </div>
  }

  return (
    <>
      <div className="w-full mx-auto mt-8">
        {isInviteLink
          ? <div className="w-full mx-auto">
            <h2 className="title-4xl-semi-bold text-text-primary">{t('login.join')}{workspaceName}</h2>
            <p className='mt-2 body-md-regular text-text-tertiary'>{t('login.joinTipStart')}{workspaceName}{t('login.joinTipEnd')}</p>
          </div>
          : <div className="w-full mx-auto">
            <h2 className="title-4xl-semi-bold text-text-primary">{t('login.pageTitle')}</h2>
            <p className='mt-2 body-md-regular text-text-tertiary'>{t('login.welcome')}</p>
          </div>}
        <div className="bg-white">
          <div className="flex flex-col gap-3 mt-6">
            {systemFeatures.enable_social_oauth_login && <SocialAuth />}
            {systemFeatures.sso_enforced_for_signin && <div className='w-full'>
              <SSOAuth protocol={systemFeatures.sso_enforced_for_signin_protocol} />
            </div>}
          </div>

          {showORLine && <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className='bg-gradient-to-r from-background-gradient-mask-transparent via-divider-regular to-background-gradient-mask-transparent h-px w-full'></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 text-text-tertiary system-xs-medium-uppercase bg-white">{t('login.or')}</span>
            </div>
          </div>}
          {
            (systemFeatures.enable_email_code_login || systemFeatures.enable_email_password_login) && <>
              {systemFeatures.enable_email_code_login && authType === 'code' && <>
                <MailAndCodeAuth isInvite={isInviteLink} />
                {systemFeatures.enable_email_password_login && <div className='cursor-pointer py-1 text-center' onClick={() => { updateAuthType('password') }}>
                  <span className='system-xs-medium text-components-button-secondary-accent-text'>{t('login.usePassword')}</span>
                </div>}
              </>}
              {systemFeatures.enable_email_password_login && authType === 'password' && <>
                <MailAndPasswordAuth isInvite={isInviteLink} allowRegistration={systemFeatures.is_allow_register} />
                {systemFeatures.enable_email_code_login && <div className='cursor-pointer py-1 text-center' onClick={() => { updateAuthType('code') }}>
                  <span className='system-xs-medium text-components-button-secondary-accent-text'>{t('login.useVerificationCode')}</span>
                </div>}
              </>}
            </>
          }
          {allMethodsAreDisabled && <>
            <div className="p-4 rounded-lg bg-gradient-to-r from-workflow-workflow-progress-bg-1 to-workflow-workflow-progress-bg-2">
              <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-components-card-bg shadow shadows-shadow-lg mb-2'>
                <RiDoorLockLine className='w-5 h-5' />
              </div>
              <p className='system-sm-medium text-text-primary'>{t('login.noLoginMethod')}</p>
              <p className='system-xs-regular text-text-tertiary mt-1'>{t('login.noLoginMethodTip')}</p>
            </div>
            <div className="relative my-2 py-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className='bg-gradient-to-r from-background-gradient-mask-transparent via-divider-regular to-background-gradient-mask-transparent h-px w-full'></div>
              </div>
            </div>
          </>}
          {/*<div className="w-full block mt-2 system-xs-regular text-text-tertiary">*/}
          {/*  {t('login.tosDesc')}*/}
          {/*  &nbsp;*/}
          {/*  <Link*/}
          {/*    className='system-xs-medium text-text-secondary hover:underline'*/}
          {/*    target='_blank' rel='noopener noreferrer'*/}
          {/*    href='https://dify.ai/terms'*/}
          {/*  >{t('login.tos')}</Link>*/}
          {/*  &nbsp;&&nbsp;*/}
          {/*  <Link*/}
          {/*    className='system-xs-medium text-text-secondary hover:underline'*/}
          {/*    target='_blank' rel='noopener noreferrer'*/}
          {/*    href='https://dify.ai/privacy'*/}
          {/*  >{t('login.pp')}</Link>*/}
          {/*</div>*/}
          {/*{IS_CE_EDITION && <div className="w-hull block mt-2 system-xs-regular text-text-tertiary">*/}
          {/*  {t('login.goToInit')}*/}
          {/*  &nbsp;*/}
          {/*  <Link*/}
          {/*    className='system-xs-medium text-text-secondary hover:underline'*/}
          {/*    href='/install'*/}
          {/*  >{t('login.setAdminAccount')}</Link>*/}
          {/*</div>}*/}

        </div>
      </div>
    </>
  )
}

export default NormalForm

// TODO: IMPL NEW AUTH METHOD
// const handleEmailPasswordLogin = async () => {
//   if (email === '') {
//     Toast.notify({
//       type: 'error',
//       message: t('login.error.emailInValid'),
//     })
//     return
//   }
//   if (password === '') {
//     Toast.notify({
//       type: 'error',
//       message: t('login.error.passwordEmpty'),
//     })
//     return
//   }
//
//   try {
//     setIsLoading(true)
//     const TGAILoginRes = await TGAIPost<{ token: string, userInfo: any }>('/manage/login',
//       {
//         username: email,
//         password,
//         googleCode: ""
//       },
//     )
//
//     const res = await login({
//       url: 'login-admin',
//       body: {
//         email,
//         password,
//         remember_me: true,
//       },
//     })
//     if (res.result === 'success' && TGAILoginRes.data.token) {
//       localStorage.setItem('console_token', res.data)
//       localStorage.setItem('tgai_token', TGAILoginRes.data.token)
//       localStorage.setItem('tgai_user_info', JSON.stringify(TGAILoginRes.data.userInfo))
//
//       router.replace('/heat/list')
//     }
//     else {
//       Toast.notify({
//         type: 'error',
//         message: res.data,
//       })
//     }
//   }
//   finally {
//     setIsLoading(false)
//   }
// }

// <>
// <div className="w-full mx-auto">
//   <h2 className="text-[32px] font-bold text-tgai-text-1">{t('login.pageTitle')}</h2>
// <p className='mt-1 text-sm text-tgai-text-1 opacity-80'>{t('login.welcome')}</p>
// </div>
//
// <div className="w-full mx-auto mt-8">
//   <div className="">
//     {!useEmailLogin && (
//       <div className="flex flex-col gap-3 mt-6">
//         <div className='w-full'>
//           <a href={getPurifyHref(`${apiPrefix}/oauth/login/github`)}>
//             <Button
//               disabled={isLoading}
//               className='w-full hover:!bg-gray-50'
//             >
//               <>
//                       <span className={
//                         classNames(
//                           style.githubIcon,
//                           'w-5 h-5 mr-2',
//                         )
//                       } />
//                 <span className="truncate text-gray-800">{t('login.withGitHub')}</span>
//               </>
//             </Button>
//           </a>
//         </div>
//         <div className='w-full'>
//           <a href={getPurifyHref(`${apiPrefix}/oauth/login/google`)}>
//             <Button
//               disabled={isLoading}
//               className='w-full hover:!bg-gray-50'
//             >
//               <>
//                       <span className={
//                         classNames(
//                           style.googleIcon,
//                           'w-5 h-5 mr-2',
//                         )
//                       } />
//                 <span className="truncate text-gray-800">{t('login.withGoogle')}</span>
//               </>
//             </Button>
//           </a>
//         </div>
//       </div>
//     )}
//
//     {
//       useEmailLogin && <>
//         <form onSubmit={() => { }}>
//           <div className='mb-5'>
//             <label htmlFor="email" className="my-2 block text-sm font-medium text-tgai-text-1">
//               {t('login.email')}
//             </label>
//             <div className="mt-1">
//               <input
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 id="email"
//                 type="email"
//                 autoComplete="email"
//                 placeholder={t('login.emailPlaceholder') || ''}
//                 className={'text-tgai-text-1 appearance-none block w-full rounded-lg pl-[14px] px-3 py-2 border dark:bg-tgai-input-background border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 hover:shadow-sm dark:hover:shadow-stone-800 focus:outline-none focus:ring-primary-500 dark:focus:ring-tgai-primary-7 focus:border-primary-500 dark:focus:border-tgai-primary-7 placeholder-gray-400 caret-primary-600 dark:caret-tgai-primary sm:text-sm'}
//               />
//             </div>
//           </div>
//
//           <div className='mb-4'>
//             <label htmlFor="password" className="my-2 flex items-center justify-between text-sm font-medium text-tgai-text-1">
//               <span>{t('login.password')}</span>
//             </label>
//             <div className="relative mt-1">
//               <input
//                 id="password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter')
//                     handleEmailPasswordLogin()
//                 }}
//                 type={showPassword ? 'text' : 'password'}
//                 autoComplete="current-password"
//                 placeholder={t('login.passwordPlaceholder') || ''}
//                 className={'text-tgai-text-1 appearance-none block w-full rounded-lg pl-[14px] px-3 py-2 border dark:bg-tgai-input-background border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 hover:shadow-sm dark:hover:shadow-stone-800 focus:outline-none focus:ring-primary-500 dark:focus:ring-tgai-primary-7 focus:border-primary-500 dark:focus:border-tgai-primary-7 placeholder-gray-400 caret-primary-600 dark:caret-tgai-primary sm:text-sm pr-10'}
//               />
//               <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
//                 >
//                   {showPassword ? '👀' : '😝'}
//                 </button>
//               </div>
//             </div>
//           </div>
//
//           <div className='mb-2'>
//             <Button
//               tabIndex={0}
//               variant='primary'
//               onClick={handleEmailPasswordLogin}
//               disabled={isLoading}
//               className="w-full bg-tgai-primary"
//             >{t('login.signBtn')}</Button>
//           </div>
//         </form>
//       </>
//     }
//     {/* agree to our Terms and Privacy Policy. */}
//     {/* <div className="w-hull text-center block mt-2 text-xs text-gray-600">
//             {t('login.tosDesc')}
//             &nbsp;
//             <Link
//               className='text-primary-600'
//               target='_blank' rel='noopener noreferrer'
//               href='https://dify.ai/terms'
//             >{t('login.tos')}</Link>
//             &nbsp;&&nbsp;
//             <Link
//               className='text-primary-600'
//               target='_blank' rel='noopener noreferrer'
//               href='https://dify.ai/privacy'
//             >{t('login.pp')}</Link>
//           </div> */}
//
//     {/* {IS_CE_EDITION && <div className="w-hull text-center block mt-2 text-xs text-gray-600">
//             {t('login.goToInit')}
//             &nbsp;
//             <Link
//               className='text-primary-600'
//               href='/install'
//             >{t('login.setAdminAccount')}</Link>
//           </div>} */}
//
//   </div>
// </div>
// </>
