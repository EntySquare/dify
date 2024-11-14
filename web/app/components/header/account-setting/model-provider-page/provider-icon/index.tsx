import type { FC } from 'react'
import type { ModelProvider } from '../declarations'
import { useLanguage } from '../hooks'

type ProviderIconProps = {
  provider: ModelProvider
  className?: string
  background?: boolean
}
const ProviderIcon: FC<ProviderIconProps> = ({
  provider,
  className,
  background
}) => {
  const language = useLanguage()

  if (provider.icon_large) {
    return (
      <div className={background ? 'dark:bg-white px-4 py-3' : ""}>
        <img
          alt='provider-icon'
          src={`${provider.icon_large[language] || provider.icon_large.en_US}?_token=${localStorage.getItem('console_token')}`}
          className={`w-auto h-6 ${className}`}
        />
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className='text-xs font-semibold text-black'>
        {provider.label[language] || provider.label.en_US}
      </div>
    </div>
  )
}

export default ProviderIcon
