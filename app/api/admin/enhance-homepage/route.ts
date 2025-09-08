import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key, {
        global: { headers: { 'x-from': 'server' } },
    });
}

export async function POST(request: NextRequest) {
    try {
        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Supabase not configured' },
                { status: 500 }
            );
        }

        // Enhanced homepage components
        const enhancedComponents = [
            {
                type: 'hero_banner',
                props: {
                    title: { ar: 'لوحة تحكم احترافية', en: 'Professional Dashboard' },
                    subtitle: { ar: 'قوالب جاهزة مع Preline', en: 'Preline-ready templates' },
                    ctaText: { ar: 'ابدأ الآن', en: 'Get Started' },
                    ctaHref: '/admin/dashboard'
                }
            },
            {
                type: 'features_1',
                props: {
                    title: { ar: 'ميزات قوية', en: 'Powerful Features' },
                    items: [
                        {
                            title: { ar: 'سهولة', en: 'Ease' },
                            description: { ar: 'واجهة سهلة', en: 'Easy UI' },
                            icon: 'fas fa-magic'
                        },
                        {
                            title: { ar: 'سرعة', en: 'Speed' },
                            description: { ar: 'أداء عالي', en: 'High performance' },
                            icon: 'fas fa-gauge-high'
                        },
                        {
                            title: { ar: 'توفر', en: 'Availability' },
                            description: { ar: 'جاهز دائماً', en: 'Always ready' },
                            icon: 'fas fa-cloud'
                        }
                    ]
                }
            },
            {
                type: 'stats_1',
                props: {
                    items: [
                        { value: '12K+', label: { ar: 'مستخدم', en: 'Users' } },
                        { value: '650+', label: { ar: 'مشروع', en: 'Projects' } },
                        { value: '4.9', label: { ar: 'تقييم', en: 'Rating' } },
                        { value: '24/7', label: { ar: 'دعم', en: 'Support' } }
                    ]
                }
            },
            {
                type: 'cards_1',
                props: {
                    title: { ar: 'خدماتنا', en: 'Our Services' },
                    items: [
                        {
                            title: { ar: 'تصميم المواقع', en: 'Web Design' },
                            description: { ar: 'تصاميم حديثة ومتجاوبة', en: 'Modern responsive designs' },
                            link: '/services/web-design'
                        },
                        {
                            title: { ar: 'تطوير التطبيقات', en: 'App Development' },
                            description: { ar: 'تطبيقات سريعة وآمنة', en: 'Fast and secure applications' },
                            link: '/services/development'
                        },
                        {
                            title: { ar: 'التسويق الرقمي', en: 'Digital Marketing' },
                            description: { ar: 'استراتيجيات تسويقية فعالة', en: 'Effective marketing strategies' },
                            link: '/services/marketing'
                        }
                    ]
                }
            },
            {
                type: 'testimonials_1',
                props: {
                    title: { ar: 'ماذا يقول عملاؤنا', en: 'What Our Clients Say' },
                    items: [
                        {
                            name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
                            role: { ar: 'رئيس تنفيذي، شركة التقنية', en: 'CEO, Tech Company' },
                            content: { ar: 'خدمة ممتازة وتصميم رائع!', en: 'Excellent service and amazing design!' }
                        },
                        {
                            name: { ar: 'فاطمة علي', en: 'Fatima Ali' },
                            role: { ar: 'مدير تسويق، شركة التجارة', en: 'Marketing Manager, Trade Company' },
                            content: { ar: 'زادت مبيعاتنا بنسبة 300%!', en: 'Our sales increased by 300%!' }
                        }
                    ]
                }
            },
            {
                type: 'cta_1',
                props: {
                    title: { ar: 'مستعد للبدء؟', en: 'Ready to Get Started?' },
                    description: { ar: 'انضم لآلاف العملاء الراضين', en: 'Join thousands of satisfied customers' },
                    ctaText: { ar: 'ابدأ الآن', en: 'Get Started Now' },
                    ctaHref: '/contact'
                }
            },
            {
                type: 'footers_1',
                props: {
                    title: { ar: 'شركة التقنية المتقدمة', en: 'Advanced Tech Company' },
                    description: { ar: 'نحن نقدم أفضل الحلول التقنية', en: 'We provide the best tech solutions' }
                }
            }
        ];

        // Update the homepage
        const { error } = await supabase
            .from('pages')
            .update({
                components_json: enhancedComponents,
                updated_at: new Date().toISOString()
            })
            .eq('slug', 'home');

        if (error) {
            console.error('Error updating homepage:', error);
            return NextResponse.json(
                { error: 'Failed to update homepage', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Homepage enhanced successfully',
            components: enhancedComponents.length
        });

    } catch (e: any) {
        console.error('Error enhancing homepage:', e);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: e?.message || e,
                code: e?.code || 'UNKNOWN'
            },
            { status: 500 }
        );
    }
}
