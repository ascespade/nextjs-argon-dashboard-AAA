import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    global: { headers: { 'x-from': 'server' } },
  });
}

function buildFallbackLibrary() {
  const base = [
    {
      type: 'hero_banner',
      name: 'Hero Banner',
      category: 'hero',
      description: 'Banner with title/subtitle/CTA',
      preview_meta: { thumbnail: '' },
      props_template: {
        title: { ar: 'عنوان رئيسي', en: 'Main Title' },
        subtitle: { ar: 'وصف فرعي', en: 'Subtitle' },
        ctaText: { ar: 'ابدأ', en: 'Start' },
        ctaHref: '/admin/dashboard',
      },
    },
    {
      type: 'hero_gradient',
      name: 'Gradient Hero',
      category: 'hero',
      description: 'Gradient background hero',
      preview_meta: { thumbnail: '' },
      props_template: {
        title: { ar: 'عنوان', en: 'Title' },
        subtitle: { ar: 'وصف', en: 'Description' },
        gradientFrom: '#6366F1',
        gradientTo: '#8B5CF6',
        ctaText: { ar: 'تعرف أكثر', en: 'Learn More' },
      },
    },
  ];
  const cats = [
    'features','cards','testimonials','gallery','stats','cta','headers','footers','forms','faq','pricing','team','contact','badges','banners','counters','image_blocks','sliders','accordions','maps','client_logos'
  ];
  cats.forEach(cat => {
    for (let i = 1; i <= 6; i++) {
      base.push({
        type: `${cat}_${i}`,
        name: `${cat.charAt(0).toUpperCase()+cat.slice(1)} ${i}`,
        category: cat,
        description: `${cat} variant ${i}`,
        preview_meta: { thumbnail: '' },
        props_template: {
          title: { ar: `${cat} ${i}`, en: `${cat} ${i}` },
          description: { ar: `وصف ${cat} ${i}`, en: `Description for ${cat} ${i}` },
          items: [],
        },
      });
    }
  });
  return base;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const supabase = getSupabase();
  try {
    if (!supabase) throw new Error('No Supabase');

    let query = supabase
      .from('components_library')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.warn('Components: falling back to default library:', (error as any)?.message || error);
    let data = buildFallbackLibrary();
    if (category && category !== 'all') data = data.filter(d => d.category === category);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(d => d.name.toLowerCase().includes(q) || (d.description||'').toLowerCase().includes(q));
    }
    return NextResponse.json({ success: true, data });
  }
}
