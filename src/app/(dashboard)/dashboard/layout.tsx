import { FC, ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Icon, Icons } from '@/components/Icons'
import Image from 'next/image'
import SignOutButton from '@/components/SignOutButton'
import FriendRequestsSideBarOption from '@/components/FriendRequestsSideBarOption'
import { fetchRedis } from '@/helpers/redis'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import SideBarChatList from '@/components/SideBarChatList'
interface layoutProps {
  children: ReactNode
}

interface SideBarOption {
  id: number
  name: string
  href: string
  Icon: Icon
}

const sideBarOptions: SideBarOption[] = [
  {
    id: 1,
    name: 'Add Friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
]

const layout: FC<layoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  const friends = await getFriendsByUserId(session.user.id)
  const unseenRequestsCount = (
    (await fetchRedis(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`
    )) as string[]
  ).length
  return (
    <div className='w-full h-screen flex'>
      <div className='w-full h-full max-w-xs flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
        <Link href={`/dashboard`} className='flex h-16 shrink items-center'>
          <Icons.Logo className='w-auto h-8 text-indigo-600' />
        </Link>
        {friends.length > 0 ? (
          <div className='font-semibold text-xs text-gray-400 leading-6'>
            Your Chats
          </div>
        ) : null}
        <nav className='flex flex-1 flex-col'>
          <ul role='list' className='flex flex-1 flex-col gap-y-7'>
            <li>
              <SideBarChatList sessionId={session.user.id} friends={friends} />
            </li>
            <li>
              <div className='text-xs font-semibold leading-6 text-gray-400'>
                Overview
              </div>
              <ul role='list' className='-mx-2 mt-2 space-y-1'>
                {sideBarOptions.map((option) => {
                  const Icon = Icons[option.Icon]
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6'
                      >
                        <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                          <Icon className='h-4 w-4' />
                        </span>
                        <span className='truncate'>{option.name}</span>
                      </Link>
                    </li>
                  )
                })}
                <li>
                  <FriendRequestsSideBarOption
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestsCount}
                  />
                </li>
              </ul>
            </li>

            <li className='-mx-6 mt-auto flex items-center'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                <div className='relative w-8 h-8 bg-gray-50'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={session.user.image || ''}
                    alt='Your Profile Picture'
                  />
                </div>
                <span className='sr-only'>Your Profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{session.user.name}</span>
                  <span className='text-xs text-zinc-400' aria-hidden='true'>
                    {session.user.email}
                  </span>
                </div>
              </div>
              <SignOutButton className='h-full aspect-square' />
            </li>
          </ul>
        </nav>
      </div>
      <aside className='max-h-screen container py-16 md:py-12 w-full'>
        {children}
      </aside>
    </div>
  )
}

export default layout
