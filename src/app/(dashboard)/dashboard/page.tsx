import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
const dashboard = async () => {
  const session = await getServerSession(authOptions)
  return <pre>{JSON.stringify(session)}</pre>
}

export default dashboard
