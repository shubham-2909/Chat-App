import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
export async function POST(req: Request) {
  try {
    const { chatId }: { chatId: string } = await req.json()
    const session = await getServerSession(authOptions)
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const [userId1, userId2] = chatId.split('--')
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response('Unauthorized', { status: 401 })
    }

    const userId = session.user.id === userId2 ? userId2 : userId1
    await pusherServer.trigger(
      toPusherKey(`friend:${userId}:typing`),
      'friend_typing',
      {
        id: session.user.id,
      }
    )
    return new Response('OK')
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}
