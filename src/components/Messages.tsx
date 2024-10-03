'use client'
import { cn, toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/validations/message'
import { FC, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import { pusherClient } from '@/lib/pusher'
interface MessagesProps {
  initialMessages: Message[]
  sessionId: string
  sessionImg: string | null | undefined
  chatPartner: User
  chatId: string
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  sessionImg,
  chatPartner,
  chatId,
}) => {
  const [userId1, userId2] = chatId.split('--')
  const friendId = sessionId === userId1 ? userId2 : userId1
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [typing, setTyping] = useState<boolean>(false)

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`))
    pusherClient.subscribe(toPusherKey(`friend:${friendId}:typing`))
    const incomingMessageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev])
    }
    const inComingTypingHandler = (friendId: string) => {
      setTyping(true)

      setTimeout(() => {
        setTyping(false)
      }, 1700)
    }
    pusherClient.bind('incoming-message', incomingMessageHandler)
    pusherClient.bind('friend_typing', inComingTypingHandler)
    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
      pusherClient.unsubscribe(toPusherKey(`friend:${sessionId}:typing`))
      pusherClient.unbind('incoming-message', incomingMessageHandler)
      pusherClient.unbind('friend_typing', inComingTypingHandler)
    }
  }, [chatId, sessionId])
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  const formatTimeStamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm')
  }
  return (
    <>
      <div
        id='messages'
        className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
      >
        <div ref={scrollDownRef} />

        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === sessionId

          const hasNextMessageFromSameUser =
            messages[index - 1]?.senderId === messages[index].senderId

          return (
            <div
              className='chat-message'
              key={`${message.id}-${message.timestamp}`}
            >
              <div
                className={cn('flex items-end', {
                  'justify-end': isCurrentUser,
                })}
              >
                <div
                  className={cn(
                    'flex flex-col space-y-2 text-base max-w-xs mx-2',
                    {
                      'order-1 items-end': isCurrentUser,
                      'order-2 items-start': !isCurrentUser,
                    }
                  )}
                >
                  <span
                    className={cn('px-4 py-2 rounded-lg inline-block', {
                      'bg-indigo-600 text-white': isCurrentUser,
                      'bg-gray-200 text-gray-900': !isCurrentUser,
                      'rounded-br-none':
                        !hasNextMessageFromSameUser && isCurrentUser,
                      'rounded-bl-none':
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    })}
                  >
                    {message.text}{' '}
                    <span className='ml-2 text-xs text-gray-400'>
                      {formatTimeStamp(message.timestamp)}
                    </span>
                  </span>
                </div>

                <div
                  className={cn('relative w-6 h-6', {
                    'order-2': isCurrentUser,
                    'order-1': !isCurrentUser,
                    invisible: hasNextMessageFromSameUser,
                  })}
                >
                  <Image
                    fill
                    src={
                      isCurrentUser ? (sessionImg as string) : chatPartner.image
                    }
                    alt='Profile picture'
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {typing && (
        <div className='chat-message'>
          <div className='flex items-end'>
            <div className='flex flex-col space-y-2 text-base max-w-xs mx-2 order-2 items-start'>
              <span className='px-4 py-2 rounded-lg inline-block bg-gray-200 text-gray-900rounded-bl-none '>
                typing...
              </span>
            </div>

            <div className='relative w-6 h-6 order-1 '>
              <Image
                fill
                src={chatPartner.image}
                alt='Profile picture'
                referrerPolicy='no-referrer'
                className='rounded-full'
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Messages
