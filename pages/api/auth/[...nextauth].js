import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByCredentials } from '../../../../lib/db';

export default NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        const user = findUserByCredentials(email, password);
        if (user) {
          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
});
