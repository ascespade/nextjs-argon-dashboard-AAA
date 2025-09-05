import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { findUserByCredentials } from '../../../lib/db';

const providers = [
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
];

// Email provider will be enabled when SMTP env vars are provided.
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      },
      from: process.env.SMTP_FROM || process.env.SMTP_USER
    })
  );
}

export default NextAuth({
  session: { strategy: 'jwt' },
  providers,
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
});
