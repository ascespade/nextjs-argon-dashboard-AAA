// Template system for the editor
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  components: any[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Default template categories
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'business',
    name: 'Business',
    description: 'Professional business websites',
    icon: 'briefcase',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Online stores and shopping sites',
    icon: 'shopping-cart',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Personal and professional portfolios',
    icon: 'user',
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Blog and content websites',
    icon: 'book-open',
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Single page marketing sites',
    icon: 'target',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Large corporate websites',
    icon: 'building',
  },
];

// Sample templates
export const SAMPLE_TEMPLATES: Template[] = [
  {
    id: 'business-basic',
    name: 'Basic Business',
    description: 'Clean and professional business website',
    category: 'business',
    thumbnail: '/templates/business-basic.jpg',
    components: [
      {
        id: 'hero-1',
        type: 'hero',
        props: {
          title: 'Welcome to Our Business',
          subtitle: 'We provide excellent services',
          buttonText: 'Get Started',
          backgroundImage: '/images/hero-bg.jpg',
        },
      },
      {
        id: 'features-1',
        type: 'features',
        props: {
          title: 'Our Services',
          features: [
            { title: 'Service 1', description: 'Description 1', icon: 'star' },
            { title: 'Service 2', description: 'Description 2', icon: 'heart' },
            {
              title: 'Service 3',
              description: 'Description 3',
              icon: 'shield',
            },
          ],
        },
      },
    ],
    tags: ['business', 'professional', 'clean'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ecommerce-basic',
    name: 'E-commerce Store',
    description: 'Modern online store template',
    category: 'ecommerce',
    thumbnail: '/templates/ecommerce-basic.jpg',
    components: [
      {
        id: 'hero-2',
        type: 'hero',
        props: {
          title: 'Shop Now',
          subtitle: 'Discover our amazing products',
          buttonText: 'Browse Products',
          backgroundImage: '/images/shop-bg.jpg',
        },
      },
      {
        id: 'products-1',
        type: 'product-grid',
        props: {
          title: 'Featured Products',
          products: [
            { name: 'Product 1', price: '$99', image: '/images/product1.jpg' },
            { name: 'Product 2', price: '$149', image: '/images/product2.jpg' },
            { name: 'Product 3', price: '$199', image: '/images/product3.jpg' },
          ],
        },
      },
    ],
    tags: ['ecommerce', 'shop', 'products'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'Showcase your creative work',
    category: 'portfolio',
    thumbnail: '/templates/portfolio-creative.jpg',
    components: [
      {
        id: 'hero-3',
        type: 'hero',
        props: {
          title: 'Creative Portfolio',
          subtitle: 'Showcasing amazing work',
          buttonText: 'View Work',
          backgroundImage: '/images/portfolio-bg.jpg',
        },
      },
      {
        id: 'gallery-1',
        type: 'image-gallery',
        props: {
          title: 'My Work',
          images: [
            { src: '/images/work1.jpg', alt: 'Work 1' },
            { src: '/images/work2.jpg', alt: 'Work 2' },
            { src: '/images/work3.jpg', alt: 'Work 3' },
          ],
        },
      },
    ],
    tags: ['portfolio', 'creative', 'gallery'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class TemplateManager {
  private templates: Template[] = SAMPLE_TEMPLATES;

  // Get all templates
  getAllTemplates(): Template[] {
    return [...this.templates];
  }

  // Get templates by category
  getTemplatesByCategory(category: string): Template[] {
    return this.templates.filter(template => template.category === category);
  }

  // Get template by ID
  getTemplateById(id: string): Template | null {
    return this.templates.find(template => template.id === id) || null;
  }

  // Search templates
  searchTemplates(query: string): Template[] {
    const lowercaseQuery = query.toLowerCase();
    return this.templates.filter(
      template =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Add new template
  addTemplate(
    template: Omit<Template, 'id' | 'created_at' | 'updated_at'>
  ): Template {
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  // Update template
  updateTemplate(id: string, updates: Partial<Template>): Template | null {
    const index = this.templates.findIndex(template => template.id === id);
    if (index === -1) return null;

    this.templates[index] = {
      ...this.templates[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return this.templates[index];
  }

  // Delete template
  deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex(template => template.id === id);
    if (index === -1) return false;

    this.templates.splice(index, 1);
    return true;
  }

  // Get template categories
  getCategories(): TemplateCategory[] {
    return [...TEMPLATE_CATEGORIES];
  }

  // Export template
  exportTemplate(id: string): string | null {
    const template = this.getTemplateById(id);
    if (!template) return null;

    return JSON.stringify(template, null, 2);
  }

  // Import template
  importTemplate(templateJson: string): Template | null {
    try {
      const template = JSON.parse(templateJson) as Template;

      // Validate template structure
      if (!template.name || !template.components) {
        throw new Error('Invalid template structure');
      }

      return this.addTemplate(template);
    } catch (error) {
      console.error('Error importing template:', error);
      return null;
    }
  }
}
