import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { FC } from 'react'

const page = async ({}) => {
  const session = await getServerSession(authOptions)

  return <div>page</div>
}

export default page
