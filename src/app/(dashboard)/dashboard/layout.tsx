import { FC, ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
interface layoutProps {
  children: ReactNode
}

const layout: FC<layoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  return <div className='w-full h-screen flex'>{children}</div>
}

export default layout
