# QA Checklist

This checklist ensures all features are working correctly before deployment.

## Environment Setup

- [ ] All environment variables configured in `.env.local`
- [ ] Supabase project created and configured
- [ ] Database schema initialized (`supabase/init.sql`)
- [ ] Seed script executed successfully
- [ ] Admin credentials retrieved from `docs/ADMIN_CREDENTIALS.md`

## Core Functionality

### Authentication & Admin

- [ ] Admin login works with generated credentials
- [ ] Admin dashboard accessible at `/admin/users`
- [ ] User management (create, edit, delete users)
- [ ] Role assignment (user, editor, admin) working
- [ ] Password change functionality

### Editor Features

- [ ] Editor loads at `/editor`
- [ ] Left sidebar opens/closes with toggle
- [ ] Right sidebar opens/closes with toggle
- [ ] Components library loads (80+ components)
- [ ] Component search functionality
- [ ] Component category filtering
- [ ] Drag and drop from library to canvas
- [ ] Components render correctly in iframe

### Canvas & Controls

- [ ] Zoom in/out buttons work
- [ ] Zoom percentage displays correctly
- [ ] Reset zoom button works
- [ ] Device preview buttons (Desktop/Tablet/Mobile)
- [ ] Canvas resizes correctly for each device
- [ ] Pan functionality (drag on gray background)

### Editing Features

- [ ] Inline text editing works
- [ ] Component selection highlights correctly
- [ ] Undo/Redo functionality
- [ ] Save draft functionality
- [ ] Publish functionality
- [ ] Navigation prevention in edit mode
- [ ] Toast notifications for disabled navigation

### Theme & Internationalization

- [ ] Dark/Light theme toggle works
- [ ] Theme persists in localStorage
- [ ] Arabic/English language toggle works
- [ ] Language persists in localStorage
- [ ] RTL layout works for Arabic
- [ ] All UI text translates correctly
- [ ] Theme applies to iframe content

## Data Persistence

### Supabase Integration

- [ ] Pages load from database
- [ ] Components save to database
- [ ] Page versions created on save
- [ ] Publish creates new version
- [ ] Image uploads to Supabase storage
- [ ] Public URLs generated for images

### API Endpoints

- [ ] `GET /api/pages/[slug]` works
- [ ] `POST /api/pages/[slug]/save` works
- [ ] `POST /api/pages/[slug]/publish` works
- [ ] `POST /api/upload-image` works
- [ ] `GET /api/components` works
- [ ] `GET /api/admin/users` works
- [ ] `POST /api/admin/users` works
- [ ] `PUT /api/admin/users/[id]` works
- [ ] `DELETE /api/admin/users/[id]` works

## Component Library

### Component Categories

- [ ] Hero components (3 variants)
- [ ] Features components (4 variants)
- [ ] Cards components (4 variants)
- [ ] Testimonials components (4 variants)
- [ ] Gallery components (4 variants)
- [ ] Stats components (4 variants)
- [ ] CTA components (4 variants)
- [ ] Headers components (4 variants)
- [ ] Footers components (4 variants)
- [ ] Forms components (4 variants)
- [ ] FAQ components (4 variants)
- [ ] Pricing components (4 variants)
- [ ] Team components (4 variants)
- [ ] Contact components (4 variants)
- [ ] Badges components (4 variants)
- [ ] Banners components (4 variants)
- [ ] Counters components (4 variants)
- [ ] Image blocks components (4 variants)
- [ ] Sliders components (4 variants)
- [ ] Accordions components (4 variants)
- [ ] Maps components (4 variants)
- [ ] Client logos components (4 variants)

### Component Properties

- [ ] Each component has preview thumbnail
- [ ] Each component has props_template
- [ ] Components support i18n props
- [ ] Components render with default props
- [ ] Components accept custom props

## User Experience

### Responsive Design

- [ ] Desktop layout works (1200px+)
- [ ] Tablet layout works (768px-1199px)
- [ ] Mobile layout works (<768px)
- [ ] Editor toolbar responsive
- [ ] Sidebars collapse on mobile
- [ ] Canvas adapts to screen size

### Performance

- [ ] Page loads quickly (<3 seconds)
- [ ] Editor loads quickly (<2 seconds)
- [ ] Component library loads quickly
- [ ] Image uploads complete quickly
- [ ] Save operations complete quickly
- [ ] No memory leaks in editor

### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators visible
- [ ] Alt text for images

## Browser Compatibility

### Desktop Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers

- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile

## Security

### Authentication

- [ ] Admin routes protected
- [ ] User sessions work correctly
- [ ] Logout functionality works
- [ ] Password requirements enforced

### Data Security

- [ ] RLS policies working
- [ ] Service role key not exposed
- [ ] User data properly isolated
- [ ] File uploads validated

### XSS Prevention

- [ ] User input sanitized
- [ ] No script injection possible
- [ ] Content Security Policy headers

## Error Handling

### User-Friendly Errors

- [ ] Network errors show helpful messages
- [ ] Validation errors show specific feedback
- [ ] 404 pages styled consistently
- [ ] 500 errors don't expose internals

### Error Recovery

- [ ] Failed saves can be retried
- [ ] Network interruptions handled gracefully
- [ ] Editor state preserved on errors
- [ ] Auto-save on network recovery

## Final Verification

### End-to-End Test

1. [ ] Login as admin
2. [ ] Open editor
3. [ ] Drag hero component to canvas
4. [ ] Edit title inline
5. [ ] Add features component
6. [ ] Save draft
7. [ ] Publish page
8. [ ] Verify published content loads on homepage
9. [ ] Toggle theme (dark/light)
10. [ ] Toggle language (AR/EN)
11. [ ] Test zoom/pan functionality
12. [ ] Test device preview buttons

### Performance Test

- [ ] Load homepage < 2 seconds
- [ ] Editor loads < 3 seconds
- [ ] Component library loads < 1 second
- [ ] Save operation < 1 second
- [ ] Image upload < 5 seconds

### Security Test

- [ ] Cannot access admin without login
- [ ] Cannot access editor without login
- [ ] User data properly isolated
- [ ] No sensitive data in client code

## Sign-off

- [ ] All critical features working
- [ ] Performance acceptable
- [ ] Security requirements met
- [ ] Browser compatibility confirmed
- [ ] Ready for production deployment

**QA Tester**: ********\_********  
**Date**: ********\_********  
**Version**: ********\_********
