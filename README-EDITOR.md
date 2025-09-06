# NextJS Argon Dashboard Editable Website

A complete, production-ready website editor built with Next.js, Supabase, and Preline UI components. Features a visual page builder with drag-and-drop functionality, real-time editing, internationalization (Arabic/English), dark/light theme, and admin user management.

## 🚀 Features

### Core Editor

- **Visual Page Builder**: Drag-and-drop interface with 80+ Preline components
- **Real-time Editing**: Inline text editing with instant preview
- **Zoom & Pan**: Canvas controls with device preview (Desktop/Tablet/Mobile)
- **Undo/Redo**: Full history management with immutable snapshots
- **Save/Publish**: Draft and published versions with version control

### Internationalization

- **Arabic & English**: Full RTL support for Arabic
- **Persistent Settings**: Language preference saved in localStorage
- **Localized Content**: All UI elements and component content translated

### Theme System

- **Dark/Light Mode**: Global theme toggle with persistence
- **Consistent Styling**: Tailwind CSS with Preline UI components
- **Theme Sync**: Editor iframe matches parent theme

### Admin System

- **User Management**: Create, edit, delete users with role-based access
- **Admin Dashboard**: Complete user administration interface
- **Secure Authentication**: Supabase Auth with RLS policies

### Data Management

- **Supabase Backend**: PostgreSQL database with real-time capabilities
- **File Storage**: Image uploads to Supabase Storage
- **Version Control**: Page versions with component history

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Preline UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Drag & Drop**: @dnd-kit/core
- **State Management**: Zustand, Immer
- **Icons**: Lucide React
- **Internationalization**: Custom i18n solution

<<<<<<< Current (Your changes)

- Replace file-based storage with Supabase client calls and ensure secure uploads.
- Improve component library thumbnails and add drag-drop previews.
- # Implement full undo/redo stack persisted server-side.

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### 1. Clone Repository

```bash
git clone <repository-url>
cd nextjs-argon-dashboard
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=public
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret
```

### 4. Database Setup

```bash
# Run the SQL schema in Supabase SQL editor
# Copy contents of supabase/init.sql

# Seed the database with components and admin user
node scripts/seed-supabase.js
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 🎯 Quick Start

### 1. Access Admin Panel

- Check `docs/ADMIN_CREDENTIALS.md` for login details
- Login at `/auth/login`
- Access admin dashboard at `/admin/users`

### 2. Open Editor

- Navigate to `/editor`
- Use the left sidebar to toggle component library
- Drag components from right sidebar to canvas
- Edit text inline by clicking on editable elements

### 3. Customize Page

- Add components by dragging from library
- Edit text content inline
- Use zoom controls to adjust view
- Switch between device previews
- Save drafts or publish changes

### 4. Manage Users

- Go to `/admin/users`
- Create new users with different roles
- Edit user information and roles
- Delete users as needed

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── auth/              # Authentication pages
│   ├── editor/            # Editor interface
│   ├── components/        # React components
│   └── globals.css        # Global styles
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── theme.ts           # Theme management
│   └── i18n.ts            # Internationalization
├── scripts/               # Build and seed scripts
│   └── seed-supabase.js   # Database seeding
├── supabase/              # Database schema
│   └── init.sql           # SQL initialization
├── docs/                  # Documentation
│   ├── DEPLOYMENT.md      # Deployment guide
│   ├── ENVIRONMENT.md     # Environment setup
│   ├── QA_CHECKLIST.md    # Quality assurance
│   └── ADMIN_CREDENTIALS.md # Admin login details
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables

See `docs/ENVIRONMENT.md` for complete environment variable documentation.

### Database Schema

The database includes these main tables:

- `pages`: Page content and metadata
- `page_versions`: Version history for pages
- `components_library`: Available components
- `uploads`: File upload metadata
- `users_profiles`: User information and roles

### Component Library

80+ Preline components organized by category:

- Hero sections
- Feature blocks
- Cards and testimonials
- Galleries and stats
- Forms and CTAs
- Headers and footers
- And many more...

## 🚀 Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Add environment variables
3. Deploy automatically
4. Run seed script post-deployment

### Other Platforms

- **Netlify**: Static site deployment
- **Render**: Full-stack deployment
- **Docker**: Containerized deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

## 🧪 Testing

### Quality Assurance

Run through the complete QA checklist in `docs/QA_CHECKLIST.md`:

1. **Environment Setup**: Verify all configurations
2. **Core Functionality**: Test editor features
3. **Data Persistence**: Verify Supabase integration
4. **User Experience**: Test responsive design
5. **Security**: Verify authentication and data protection

### Manual Testing

1. Login as admin
2. Open editor (`/editor`)
3. Drag components to canvas
4. Edit content inline
5. Save and publish
6. Verify published content
7. Test theme and language toggles

## 🔒 Security

### Authentication

- Supabase Auth with secure session management
- Role-based access control (user, editor, admin)
- Row Level Security (RLS) policies

### Data Protection

- Service role key only used server-side
- User data properly isolated
- File upload validation and sanitization

### Best Practices

- Environment variables for sensitive data
- HTTPS enforcement in production
- Regular security updates

## 🌐 Internationalization

### Supported Languages

- **Arabic (ar)**: Default language with RTL support
- **English (en)**: Secondary language

### Adding New Languages

1. Update `lib/i18n.ts` with new translations
2. Add language toggle in header
3. Update component props to support new locale

### RTL Support

- Automatic `dir="rtl"` for Arabic
- Proper text alignment and layout
- Icon and component mirroring

## 🎨 Theming

### Dark/Light Mode

- Global theme context
- Persistent user preference
- Automatic system preference detection
- Consistent styling across all components

### Customization

- Modify `lib/theme.ts` for theme logic
- Update Tailwind config for custom colors
- Add new theme variants as needed

## 📊 Performance

### Optimization Features

- Next.js App Router for optimal performance
- Image optimization and lazy loading
- Code splitting and bundle optimization
- Supabase CDN for file uploads

### Monitoring

- Supabase dashboard for database metrics
- Vercel analytics for performance data
- Error tracking and logging

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Standards

- TypeScript for type safety
- ESLint and Prettier for code quality
- Component-based architecture
- Comprehensive error handling

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Support

### Documentation

- `docs/DEPLOYMENT.md`: Deployment instructions
- `docs/ENVIRONMENT.md`: Environment setup
- `docs/QA_CHECKLIST.md`: Testing checklist

### Common Issues

1. **Build Failures**: Check Node.js version and dependencies
2. **Database Issues**: Verify Supabase configuration
3. **Editor Problems**: Check browser console for errors
4. **Upload Issues**: Verify storage bucket permissions

### Getting Help

- Check existing issues in repository
- Create new issue with detailed description
- Include error logs and environment details

---

**Ready to build amazing websites? Start with the editor at `/editor` and create your first page!** 🎉

> > > > > > > Incoming (Background Agent changes)
