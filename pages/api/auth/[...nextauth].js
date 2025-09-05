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

// Email provider will only be enabled when explicitly enabled via ENABLE_EMAIL_PROVIDER
// and an adapter is configured. By default we keep Credentials provider only to avoid
// requiring a database adapter for email verification tokens.
if (process.env.ENABLE_EMAIL_PROVIDER === 'true') {
  if (!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)) {
    console.warn('ENABLE_EMAIL_PROVIDER is true but SMTP_* ENV vars are missing; email provider will not be added');
  } else if (!process.env.ENABLE_EMAIL_PROVIDER_ADAPTER) {
    // Require explicit adapter flag to avoid runtime MissingAdapterError
    console.warn('ENABLE_EMAIL_PROVIDER is true but ENABLE_EMAIL_PROVIDER_ADAPTER is not set. Please configure an adapter to use EmailProvider.');
  } else {
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
}

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
