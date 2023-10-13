'use client'
import { FC } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { pusherClient } from '@/lib/pusher'
import toast from 'react-hot-toast'
import UnseenChatToast from './UnseenChatToast'
interface SideBarChatListProps {
  friends: User[]
  sessionId: string
}
interface extendedMessage extends Message {
  senderImg: string
  senderName: string
}
const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter()
  const pathName = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))
    const newFriendHandler = () => {
      router.refresh()
    }

    const chatHandler = (message: extendedMessage) => {
      const shouldNotify =
        pathName !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

      if (!shouldNotify) return

      // notify the message to the user
      toast.custom((t) => {
        //component
        return (
          <UnseenChatToast
            t={t}
            senderId={message.senderId}
            senderImg={message.senderImg}
            sessionId={sessionId}
            senderMessage={message.text}
            senderName={message.senderName}
          />
        )
      })

      setUnseenMessages((prev) => [...prev, message])
    }
    pusherClient.bind('new_message', chatHandler)
    pusherClient.bind('new_friend', newFriendHandler)
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
      pusherClient.unbind('new_message', chatHandler)
      pusherClient.unbind('new_friend', newFriendHandler)
    }
  }, [pathName, sessionId, router])
  useEffect(() => {
    if (pathName?.includes('chat')) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathName.includes(msg.senderId))
      })
    }
  }, [pathName])
  return (
    <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            >
              {friend.name}
              {unseenMessagesCount > 0 ? (
                <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SideBarChatList
