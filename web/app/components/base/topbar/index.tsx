'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

const Topbar = () => {
  return (
    <>
      <ProgressBar
        height='2px'
        color="#ff0077"
        options={{ showSpinner: false }}
        shallowRouting />
    </>)
}

export default Topbar
