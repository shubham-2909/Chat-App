import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
const dashboard = async () => {
  const session = await getServerSession(authOptions)
  return <h1>Dashboard</h1>
}

export default dashboard
