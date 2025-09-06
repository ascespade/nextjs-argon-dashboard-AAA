import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
  if (!url || !key) return null;
  return createClient(url, key, { global: { headers: { 'x-from': 'server' } } });
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Disabled in production' }, { status: 403 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    // Build 100+ components across categories
    const baseComponents: any[] = [
      {
        type: 'hero_banner',
        name: 'Hero Banner',
        category: 'hero',
        description: 'Large banner with title, subtitle and CTA button',
        preview_meta: { thumbnail: '' },
        props_template: {
          title: { ar: 'عنوان رئيسي', en: 'Main Title' },
          subtitle: { ar: 'وصف فرعي', en: 'Subtitle description' },
          ctaText: { ar: 'ابدأ الآن', en: 'Get Started' },
          ctaHref: '/admin/dashboard',
        },
      },
      {
        type: 'hero_gradient',
        name: 'Gradient Hero',
        category: 'hero',
        description: 'Hero with gradient background',
        preview_meta: { thumbnail: '' },
        props_template: {
          title: { ar: 'عنوان متدرج', en: 'Gradient Title' },
          subtitle: { ar: 'وصف', en: 'Description' },
          gradientFrom: '#6366F1',
          gradientTo: '#8B5CF6',
          ctaText: { ar: 'تعرف أكثر', en: 'Learn More' },
        },
      },
    ];

    const categories = [
      'features',
      'cards',
      'testimonials',
      'gallery',
      'stats',
      'cta',
      'headers',
      'footers',
      'forms',
      'faq',
      'pricing',
      'team',
      'contact',
      'badges',
      'banners',
      'counters',
      'image_blocks',
      'sliders',
      'accordions',
      'maps',
      'client_logos',
    ];

    const library: any[] = [...baseComponents];
    categories.forEach(cat => {
      for (let i = 1; i <= 6; i++) {
        library.push({
          type: `${cat}_${i}`,
          name: `${cat.charAt(0).toUpperCase() + cat.slice(1)} ${i}`,
          category: cat,
          description: `${cat} component variant ${i}`,
          preview_meta: { thumbnail: '' },
          props_template: {
            title: { ar: `${cat} ${i}`, en: `${cat} ${i}` },
            description: { ar: `وصف ${cat} ${i}`, en: `Description for ${cat} ${i}` },
            items: [],
          },
        });
      }
    });

    // Upsert components into components_library
    const { error: upsertErr } = await supabase.from('components_library').upsert(library, { onConflict: 'type' });
    if (upsertErr) throw upsertErr;

    // Prepare professional homepage using a subset
    const homepageComponents = [
      {
        type: 'hero_gradient',
        props: {
          title: { ar: 'لوحة تحكم احترافية', en: 'Professional Dashboard' },
          subtitle: { ar: 'قوالب جاهزة مع Preline', en: 'Preline-ready templates' },
          gradientFrom: '#4f46e5',
          gradientTo: '#7c3aed',
          ctaText: { ar: 'ابدأ الآن', en: 'Get Started' },
          ctaHref: '/admin/dashboard',
        },
      },
      {
        type: 'features_1',
        props: {
          title: { ar: 'مزايا قوية', en: 'Powerful Features' },
          items: [
            { title: { ar: 'سهولة', en: 'Ease' }, description: { ar: 'واجهة سهلة', en: 'Easy UI' }, icon: 'fas fa-magic' },
            { title: { ar: 'سرعة', en: 'Speed' }, description: { ar: 'أداء عالٍ', en: 'High performance' }, icon: 'fas fa-gauge-high' },
            { title: { ar: 'توفر', en: 'Availability' }, description: { ar: 'جاهز دائماً', en: 'Always ready' }, icon: 'fas fa-cloud' },
          ],
        },
      },
      {
        type: 'stats_1',
        props: {
          items: [
            { label: { ar: 'المستخدمين', en: 'Users' }, value: '12K+' },
            { label: { ar: 'المشاريع', en: 'Projects' }, value: '650+' },
            { label: { ar: 'التقييم', en: 'Rating' }, value: '4.9' },
            { label: { ar: 'الدعم', en: 'Support' }, value: '24/7' },
          ],
        },
      },
    ];

    // Upsert page 'home'
    const { data: existing, error: selErr } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'home')
      .maybeSingle();
    if (selErr) throw selErr;

    if (existing) {
      const newVersion = (existing.version || 0) + 1;
      const { error: updErr } = await supabase
        .from('pages')
        .update({
          components_json: homepageComponents,
          status: 'published',
          version: newVersion,
          updated_by: 'seed-preline',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
      if (updErr) throw updErr;
      await supabase.from('page_versions').insert({
        page_id: existing.id,
        version: newVersion,
        components_json: homepageComponents,
        created_by: 'seed-preline',
      });
    } else {
      const { data: pageIns, error: pageErr } = await supabase
        .from('pages')
        .insert({
          slug: 'home',
          title_json: { ar: 'الرئيسية', en: 'Home' },
          components_json: homepageComponents,
          status: 'published',
          version: 1,
          updated_by: 'seed-preline',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (pageErr) throw pageErr;
      await supabase.from('page_versions').insert({
        page_id: pageIns.id,
        version: 1,
        components_json: homepageComponents,
        created_by: 'seed-preline',
      });
    }

    return NextResponse.json({ success: true, inserted: library.length, homepage: 'updated' });
  } catch (e: any) {
    console.error('Seed error:', e?.message || e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
