// SEO tools for the editor
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  sitemap?: boolean;
}

export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  field: string;
}

export interface SEOSuggestion {
  type: 'improvement' | 'optimization';
  message: string;
  field: string;
  priority: 'high' | 'medium' | 'low';
}

export class SEOTools {
  // Analyze SEO data
  static analyzeSEO(seoData: SEOData, content: string): SEOAnalysis {
    const issues: SEOIssue[] = [];
    const suggestions: SEOSuggestion[] = [];
    let score = 100;

    // Title analysis
    if (!seoData.title) {
      issues.push({
        type: 'error',
        message: 'Page title is missing',
        field: 'title',
      });
      score -= 20;
    } else if (seoData.title.length < 30) {
      issues.push({
        type: 'warning',
        message: 'Title is too short (recommended: 30-60 characters)',
        field: 'title',
      });
      score -= 10;
    } else if (seoData.title.length > 60) {
      issues.push({
        type: 'warning',
        message: 'Title is too long (recommended: 30-60 characters)',
        field: 'title',
      });
      score -= 5;
    }

    // Description analysis
    if (!seoData.description) {
      issues.push({
        type: 'error',
        message: 'Meta description is missing',
        field: 'description',
      });
      score -= 20;
    } else if (seoData.description.length < 120) {
      issues.push({
        type: 'warning',
        message: 'Description is too short (recommended: 120-160 characters)',
        field: 'description',
      });
      score -= 10;
    } else if (seoData.description.length > 160) {
      issues.push({
        type: 'warning',
        message: 'Description is too long (recommended: 120-160 characters)',
        field: 'description',
      });
      score -= 5;
    }

    // Keywords analysis
    if (!seoData.keywords || seoData.keywords.length === 0) {
      issues.push({
        type: 'warning',
        message: 'No keywords specified',
        field: 'keywords',
      });
      score -= 10;
    } else if (seoData.keywords.length > 10) {
      issues.push({
        type: 'warning',
        message: 'Too many keywords (recommended: 3-10 keywords)',
        field: 'keywords',
      });
      score -= 5;
    }

    // Open Graph analysis
    if (!seoData.ogTitle) {
      suggestions.push({
        type: 'improvement',
        message: 'Add Open Graph title for better social sharing',
        field: 'ogTitle',
        priority: 'medium',
      });
      score -= 5;
    }

    if (!seoData.ogDescription) {
      suggestions.push({
        type: 'improvement',
        message: 'Add Open Graph description for better social sharing',
        field: 'ogDescription',
        priority: 'medium',
      });
      score -= 5;
    }

    if (!seoData.ogImage) {
      suggestions.push({
        type: 'improvement',
        message: 'Add Open Graph image for better social sharing',
        field: 'ogImage',
        priority: 'high',
      });
      score -= 10;
    }

    // Content analysis
    if (content.length < 300) {
      issues.push({
        type: 'warning',
        message: 'Content is too short (recommended: at least 300 words)',
        field: 'content',
      });
      score -= 15;
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    return {
      score,
      issues,
      suggestions,
    };
  }

  // Generate meta tags HTML
  static generateMetaTags(seoData: SEOData): string {
    const tags: string[] = [];

    // Basic meta tags
    if (seoData.title) {
      tags.push(`<title>${this.escapeHtml(seoData.title)}</title>`);
    }

    if (seoData.description) {
      tags.push(
        `<meta name="description" content="${this.escapeHtml(seoData.description)}">`
      );
    }

    if (seoData.keywords && seoData.keywords.length > 0) {
      tags.push(
        `<meta name="keywords" content="${this.escapeHtml(seoData.keywords.join(', '))}">`
      );
    }

    if (seoData.robots) {
      tags.push(
        `<meta name="robots" content="${this.escapeHtml(seoData.robots)}">`
      );
    }

    // Open Graph tags
    if (seoData.ogTitle) {
      tags.push(
        `<meta property="og:title" content="${this.escapeHtml(seoData.ogTitle)}">`
      );
    }

    if (seoData.ogDescription) {
      tags.push(
        `<meta property="og:description" content="${this.escapeHtml(seoData.ogDescription)}">`
      );
    }

    if (seoData.ogImage) {
      tags.push(
        `<meta property="og:image" content="${this.escapeHtml(seoData.ogImage)}">`
      );
    }

    // Twitter Card tags
    if (seoData.twitterCard) {
      tags.push(
        `<meta name="twitter:card" content="${this.escapeHtml(seoData.twitterCard)}">`
      );
    }

    if (seoData.twitterTitle) {
      tags.push(
        `<meta name="twitter:title" content="${this.escapeHtml(seoData.twitterTitle)}">`
      );
    }

    if (seoData.twitterDescription) {
      tags.push(
        `<meta name="twitter:description" content="${this.escapeHtml(seoData.twitterDescription)}">`
      );
    }

    if (seoData.twitterImage) {
      tags.push(
        `<meta name="twitter:image" content="${this.escapeHtml(seoData.twitterImage)}">`
      );
    }

    // Canonical URL
    if (seoData.canonicalUrl) {
      tags.push(
        `<link rel="canonical" href="${this.escapeHtml(seoData.canonicalUrl)}">`
      );
    }

    return tags.join('\n');
  }

  // Generate sitemap entry
  static generateSitemapEntry(
    url: string,
    lastmod?: string,
    changefreq?: string,
    priority?: number
  ): string {
    const lastmodDate = lastmod || new Date().toISOString().split('T')[0];
    const changeFreq = changefreq || 'weekly';
    const priorityValue = priority || 0.5;

    return `
  <url>
    <loc>${this.escapeHtml(url)}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priorityValue}</priority>
  </url>`;
  }

  // Generate robots.txt content
  static generateRobotsTxt(
    allowAll: boolean = true,
    disallowPaths: string[] = [],
    sitemapUrl?: string
  ): string {
    const lines: string[] = [];

    if (allowAll) {
      lines.push('User-agent: *');
      lines.push('Allow: /');
    } else {
      lines.push('User-agent: *');
      lines.push('Disallow: /');
    }

    disallowPaths.forEach(path => {
      lines.push(`Disallow: ${path}`);
    });

    if (sitemapUrl) {
      lines.push(`Sitemap: ${sitemapUrl}`);
    }

    return lines.join('\n');
  }

  // Extract text content from HTML
  static extractTextContent(html: string): string {
    // Simple HTML tag removal (for basic use cases)
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Count words in text
  static countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  // Generate keyword suggestions
  static generateKeywordSuggestions(content: string, title: string): string[] {
    const text = `${title} ${content}`.toLowerCase();
    const words = text.split(/\s+/).filter(word => word.length > 3);

    // Simple word frequency analysis
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Return most frequent words
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  // Escape HTML characters
  private static escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return text.replace(/[&<>"']/g, m => map[m]);
  }
}
