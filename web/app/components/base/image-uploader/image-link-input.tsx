import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../button'
import type { ImageFile } from '../../../../types/app'
import { TransferMethod } from '../../../../types/app'

type ImageLinkInputProps = {
  onUpload: (imageFile: ImageFile) => void
  disabled?: boolean
}
const regex = /^(https?|ftp):\/\//
const ImageLinkInput: FC<ImageLinkInputProps> = ({
  onUpload,
  disabled,
}) => {
  const { t } = useTranslation()
  const [imageLink, setImageLink] = useState('')

  const handleClick = () => {
    if (disabled)
      return

    const imageFile = {
      type: TransferMethod.remote_url,
      _id: `${Date.now()}`,
      fileId: '',
      progress: regex.test(imageLink) ? 0 : -1,
      url: imageLink,
    }

    onUpload(imageFile)
  }

  return (
    <div className='flex items-center pl-1.5 pr-1 h-8 border border-gray-200 dark:border-zinc-600 bg-white dark:bg-tgai-input-background shadow-xs rounded-lg text-tgai-text-1'>
      <input
        type="text"
        className='grow mr-0.5 px-1 h-[18px] text-[13px] outline-none appearance-non dark:bg-tgai-input-background'
        value={imageLink}
        onChange={e => setImageLink(e.target.value)}
        placeholder={t('common.imageUploader.pasteImageLinkInputPlaceholder') || ''}
      />
      <Button
        variant='primary'
        size='small'
        disabled={!imageLink || disabled}
        onClick={handleClick}
      >
        {t('common.operation.ok')}
      </Button>
    </div>
  )
}

export default ImageLinkInput
