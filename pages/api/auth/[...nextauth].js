import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByCredentials } from '../../../lib/db';

const providers = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      try {
        const { email, password } = credentials || {};
        const user = findUserByCredentials(email, password);
        if (user) {
          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
      } catch (e) {
        console.error('Authorize error', e);
        return null;
      }
    }
  })
];

// Email provider intentionally disabled. Credentials-only authentication is used.

export default NextAuth({
  session: { strategy: 'jwt' },
  providers,
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error(code, ...rest) {
      console.error('[next-auth][error]', code, ...rest);
    },
    warn(code, ...rest) {
      console.warn('[next-auth][warn]', code, ...rest);
    },
    debug(code, ...rest) {
      console.debug('[next-auth][debug]', code, ...rest);
    }
  }
});
