import type { User, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'

type userId = string

declare module 'next-auth/jwt' {
  interface JWT {
    id: userId
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: userId
    }
  }
}
