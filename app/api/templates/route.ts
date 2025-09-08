import { NextRequest, NextResponse } from 'next/server';

// Predefined templates
const templates = [
    {
        id: 'business-basic',
        name: 'Business Basic',
        description: 'Professional business landing page',
        thumbnail: '/templates/business-basic.jpg',
        components: [
            {
                type: 'hero_banner',
                props: {
                    title: { en: 'Professional Business Solutions', ar: 'حلول أعمال احترافية' },
                    subtitle: { en: 'Transform your business with our innovative solutions', ar: 'حول عملك بحلولنا المبتكرة' },
                    ctaText: { en: 'Get Started', ar: 'ابدأ الآن' },
                    ctaHref: '/contact'
                }
            },
            {
                type: 'features_1',
                props: {
                    title: { en: 'Why Choose Us', ar: 'لماذا تختارنا' },
                    items: [
                        {
                            title: { en: 'Expert Team', ar: 'فريق خبير' },
                            description: { en: 'Professional expertise', ar: 'خبرة مهنية' },
                            icon: 'fas fa-users'
                        },
                        {
                            title: { en: '24/7 Support', ar: 'دعم 24/7' },
                            description: { en: 'Always here to help', ar: 'نحن هنا للمساعدة' },
                            icon: 'fas fa-headset'
                        },
                        {
                            title: { en: 'Fast Delivery', ar: 'تسليم سريع' },
                            description: { en: 'Quick turnaround', ar: 'تسليم سريع' },
                            icon: 'fas fa-rocket'
                        }
                    ]
                }
            },
            {
                type: 'stats_1',
                props: {
                    items: [
                        { value: '500+', label: { en: 'Happy Clients', ar: 'عميل سعيد' } },
                        { value: '1000+', label: { en: 'Projects Done', ar: 'مشروع مكتمل' } },
                        { value: '99%', label: { en: 'Success Rate', ar: 'معدل النجاح' } },
                        { value: '24/7', label: { en: 'Support', ar: 'دعم' } }
                    ]
                }
            },
            {
                type: 'cta_1',
                props: {
                    title: { en: 'Ready to Get Started?', ar: 'مستعد للبدء؟' },
                    description: { en: 'Contact us today for a free consultation', ar: 'اتصل بنا اليوم للحصول على استشارة مجانية' },
                    ctaText: { en: 'Contact Us', ar: 'اتصل بنا' },
                    ctaHref: '/contact'
                }
            }
        ]
    },
    {
        id: 'portfolio-creative',
        name: 'Creative Portfolio',
        description: 'Showcase your creative work',
        thumbnail: '/templates/portfolio-creative.jpg',
        components: [
            {
                type: 'hero_gradient',
                props: {
                    title: { en: 'Creative Portfolio', ar: 'معرض إبداعي' },
                    subtitle: { en: 'Showcasing amazing creative work', ar: 'عرض أعمال إبداعية مذهلة' },
                    gradientFrom: '#667eea',
                    gradientTo: '#764ba2',
                    ctaText: { en: 'View Work', ar: 'شاهد الأعمال' }
                }
            },
            {
                type: 'gallery_1',
                props: {
                    title: { en: 'Featured Work', ar: 'أعمال مميزة' },
                    items: [
                        { title: { en: 'Project 1', ar: 'مشروع 1' }, image: '/images/project1.jpg' },
                        { title: { en: 'Project 2', ar: 'مشروع 2' }, image: '/images/project2.jpg' },
                        { title: { en: 'Project 3', ar: 'مشروع 3' }, image: '/images/project3.jpg' }
                    ]
                }
            },
            {
                type: 'testimonials_1',
                props: {
                    title: { en: 'What Clients Say', ar: 'ماذا يقول العملاء' },
                    items: [
                        {
                            name: { en: 'John Doe', ar: 'أحمد محمد' },
                            role: { en: 'CEO, Company', ar: 'رئيس تنفيذي، شركة' },
                            content: { en: 'Amazing work!', ar: 'عمل رائع!' },
                            avatar: '/images/avatar1.jpg'
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 'ecommerce-basic',
        name: 'E-commerce Store',
        description: 'Online store template',
        thumbnail: '/templates/ecommerce-basic.jpg',
        components: [
            {
                type: 'hero_banner',
                props: {
                    title: { en: 'Shop the Latest Trends', ar: 'تسوق أحدث الصيحات' },
                    subtitle: { en: 'Discover amazing products at great prices', ar: 'اكتشف منتجات رائعة بأسعار ممتازة' },
                    ctaText: { en: 'Shop Now', ar: 'تسوق الآن' },
                    ctaHref: '/products'
                }
            },
            {
                type: 'features_1',
                props: {
                    title: { en: 'Why Shop With Us', ar: 'لماذا تتسوق معنا' },
                    items: [
                        {
                            title: { en: 'Free Shipping', ar: 'شحن مجاني' },
                            description: { en: 'On orders over $50', ar: 'للطلبات أكثر من 50$' },
                            icon: 'fas fa-shipping-fast'
                        },
                        {
                            title: { en: 'Easy Returns', ar: 'إرجاع سهل' },
                            description: { en: '30-day return policy', ar: 'سياسة إرجاع 30 يوم' },
                            icon: 'fas fa-undo'
                        },
                        {
                            title: { en: 'Secure Payment', ar: 'دفع آمن' },
                            description: { en: 'SSL encrypted', ar: 'مشفر SSL' },
                            icon: 'fas fa-shield-alt'
                        }
                    ]
                }
            },
            {
                type: 'pricing_1',
                props: {
                    title: { en: 'Choose Your Plan', ar: 'اختر خطتك' },
                    items: [
                        {
                            name: { en: 'Basic', ar: 'أساسي' },
                            price: '$29',
                            features: [
                                { en: '5 Products', ar: '5 منتجات' },
                                { en: 'Basic Support', ar: 'دعم أساسي' }
                            ]
                        },
                        {
                            name: { en: 'Pro', ar: 'احترافي' },
                            price: '$59',
                            features: [
                                { en: 'Unlimited Products', ar: 'منتجات غير محدودة' },
                                { en: 'Priority Support', ar: 'دعم أولوية' }
                            ]
                        }
                    ]
                }
            }
        ]
    },
    {
        id: 'landing-page',
        name: 'Landing Page',
        description: 'High-converting landing page',
        thumbnail: '/templates/landing-page.jpg',
        components: [
            {
                type: 'hero_gradient',
                props: {
                    title: { en: 'Convert More Visitors', ar: 'حول المزيد من الزوار' },
                    subtitle: { en: 'Increase your conversion rate with our proven strategies', ar: 'زود معدل التحويل باستراتيجياتنا المجربة' },
                    gradientFrom: '#f093fb',
                    gradientTo: '#f5576c',
                    ctaText: { en: 'Start Free Trial', ar: 'ابدأ التجربة المجانية' }
                }
            },
            {
                type: 'stats_1',
                props: {
                    items: [
                        { value: '300%', label: { en: 'Increase in Conversions', ar: 'زيادة في التحويلات' } },
                        { value: '50%', label: { en: 'Reduced Bounce Rate', ar: 'تقليل معدل الارتداد' } },
                        { value: '2x', label: { en: 'More Revenue', ar: 'إيرادات أكثر' } },
                        { value: '24h', label: { en: 'Setup Time', ar: 'وقت الإعداد' } }
                    ]
                }
            },
            {
                type: 'cta_1',
                props: {
                    title: { en: 'Ready to Boost Your Conversions?', ar: 'مستعد لتعزيز تحويلاتك؟' },
                    description: { en: 'Join thousands of satisfied customers', ar: 'انضم لآلاف العملاء الراضين' },
                    ctaText: { en: 'Get Started Now', ar: 'ابدأ الآن' }
                }
            }
        ]
    },
    {
        id: 'agency-pro',
        name: 'Agency Pro',
        description: 'Professional agency website',
        thumbnail: '/templates/agency-pro.jpg',
        components: [
            {
                type: 'hero_banner',
                props: {
                    title: { en: 'Digital Agency Excellence', ar: 'تميز الوكالة الرقمية' },
                    subtitle: { en: 'We create digital experiences that drive results', ar: 'نصنع تجارب رقمية تحقق النتائج' },
                    ctaText: { en: 'View Our Work', ar: 'شاهد أعمالنا' },
                    ctaHref: '/portfolio'
                }
            },
            {
                type: 'features_1',
                props: {
                    title: { en: 'Our Services', ar: 'خدماتنا' },
                    items: [
                        {
                            title: { en: 'Web Design', ar: 'تصميم المواقع' },
                            description: { en: 'Beautiful, responsive designs', ar: 'تصاميم جميلة ومتجاوبة' },
                            icon: 'fas fa-paint-brush'
                        },
                        {
                            title: { en: 'Development', ar: 'التطوير' },
                            description: { en: 'Fast, secure applications', ar: 'تطبيقات سريعة وآمنة' },
                            icon: 'fas fa-code'
                        },
                        {
                            title: { en: 'Marketing', ar: 'التسويق' },
                            description: { en: 'Data-driven strategies', ar: 'استراتيجيات مدفوعة بالبيانات' },
                            icon: 'fas fa-chart-line'
                        }
                    ]
                }
            },
            {
                type: 'team_1',
                props: {
                    title: { en: 'Meet Our Team', ar: 'تعرف على فريقنا' },
                    items: [
                        {
                            name: { en: 'Sarah Johnson', ar: 'سارة أحمد' },
                            role: { en: 'Creative Director', ar: 'مدير إبداعي' },
                            avatar: '/images/team1.jpg'
                        },
                        {
                            name: { en: 'Mike Chen', ar: 'محمد علي' },
                            role: { en: 'Lead Developer', ar: 'مطور رئيسي' },
                            avatar: '/images/team2.jpg'
                        }
                    ]
                }
            }
        ]
    }
];

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({
            success: true,
            data: templates
        });
    } catch (error) {
        console.error('Error loading templates:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to load templates'
            },
            { status: 500 }
        );
    }
}
