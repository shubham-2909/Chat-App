import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { FC } from 'react'

const page = async ({}) => {
  const session = await getServerSession(authOptions)
  console.log(session)

  return <div>page</div>
}

export default page
