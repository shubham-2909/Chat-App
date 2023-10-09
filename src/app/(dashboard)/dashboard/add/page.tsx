import AddFriendButton from '@/components/AddFriendButton'
import { FC } from 'react'

const page: FC = () => {
  return (
    <main className='pt-8'>
      <h1 className='text-5xl mb-8 font-bold'>Add a friend</h1>
      {/* conponent for adding friend*/}
      <AddFriendButton />
    </main>
  )
}

export default page
