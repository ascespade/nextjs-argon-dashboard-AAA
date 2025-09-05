import { NextRequest, NextResponse } from 'next/server';
import { publishPage } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const body = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // First save the current draft
    if (body.components_json) {
      const { writePage } = await import('@/lib/supabase');
      await writePage(slug, {
        slug,
        title_json: body.title_json || null,
        components_json: body.components_json,
        status: 'draft',
        updated_by: body.updated_by || 'anonymous'
      });
    }

    // Then publish it
    const result = await publishPage(slug);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error publishing page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}