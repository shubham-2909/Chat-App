import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { FC } from 'react'
import { notFound } from 'next/navigation'
import { fetchRedis } from '@/helpers/redis'
import FriendRequests from '@/components/FriendRequests'
const page: FC = async () => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  // ids of people who sent current user which is logged in a friend requests
  const senderIds = (await fetchRedis(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[]

  // finding email of such people using promise.all
  const incomingFriendRequests = await Promise.all(
    senderIds.map(async (senderId) => {
      const sender = (await fetchRedis('get', `user:${senderId}`)) as string
      const senderParsed = JSON.parse(sender) as User
      return { senderId, senderEmail: senderParsed.email }
    })
  )
  return (
    <main className='pt-8'>
      <h1 className='text-5xl mb-8 font-bold'>Add a friend</h1>
      {/* conponent for showing requests and managing them*/}
      <div className='flex flex-col gap-4'>
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  )
}

export default page
