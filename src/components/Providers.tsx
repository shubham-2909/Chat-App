'use client'
import { FunctionComponent, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
interface ProviderProps {
  children: ReactNode
}

const Provider: FunctionComponent<ProviderProps> = ({ children }) => {
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      {children}
    </>
  )
}

export default Provider
