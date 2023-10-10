'use client'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { FC } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
}) => {
  const router = useRouter()
  const [friendRequests, setfriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  )

  const acceptFriend = async (senderId: string) => {
    await axios.post('/api/friends/accept', {
      id: senderId,
    })

    setfriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    )

    router.refresh()
  }
  const denyFriend = async (senderId: string) => {
    await axios.post('/api/friends/deny', {
      id: senderId,
    })

    setfriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    )

    router.refresh()
  }
  return (
    <>
      {friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => {
          return (
            <div key={request.senderId} className='flex gap-4 items-center'>
              <UserPlus className='text-black w-6 h-6' />
              <p className='font-medium text-md'>{request.senderEmail}</p>
              <button
                aria-label='accept friend'
                className='w-6 h-6 bg-indigo-600 transition hover:bg-indigo-700 grid place-items-center rounded-full hover:shadow-md'
                onClick={() => acceptFriend(request.senderId)}
              >
                <Check className='w-3/4 h-3/4 font-semibold text-white' />
              </button>
              <button
                aria-label='deny friend'
                className='w-6 h-6 bg-red-600 transition hover:bg-red-700 grid place-items-center rounded-full hover:shadow-md'
                onClick={() => denyFriend(request.senderId)}
              >
                <X className='w-3/4 h-3/4 font-semibold text-white' />
              </button>
            </div>
          )
        })
      )}
    </>
  )
}

export default FriendRequests
