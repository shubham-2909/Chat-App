'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect } from 'react'
import { useState } from 'react'
interface FriendRequestsSideBarOptionProps {
  sessionId: string
  initialUnseenRequestCount: number
}

const FriendRequestsSideBarOption: FC<FriendRequestsSideBarOptionProps> = ({
  initialUnseenRequestCount,
  sessionId,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  )

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))
    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1)
    }
    const addedFriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1)
    }
    const rejectfriendHandler = () => {
      setUnseenRequestCount((prev) => prev - 1)
    }
    pusherClient.bind('incoming_friend_requests', friendRequestHandler)
    pusherClient.bind('new_friend', addedFriendHandler)
    pusherClient.bind('friend_deny', rejectfriendHandler)
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
      pusherClient.unbind('new_friend', addedFriendHandler)
    }
  }, [sessionId])
  return (
    <Link
      href={`/dashboard/requests`}
      className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
    >
      <div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border text-[0.625rem]'>
        <User className='h-4 w-4' />
      </div>
      <p className='truncate'>Friend Requests</p>
      {unseenRequestCount > 0 ? (
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
          {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  )
}

export default FriendRequestsSideBarOption
