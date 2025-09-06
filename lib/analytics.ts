// Analytics system for the editor
export interface AnalyticsEvent {
  id: string;
  type: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
  pageUrl: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

export interface PageAnalytics {
  pageId: string;
  pageUrl: string;
  views: number;
  uniqueViews: number;
  avgTimeOnPage: number;
  bounceRate: number;
  lastViewed: string;
  topReferrers: Array<{ source: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  topDevices: Array<{ device: string; count: number }>;
}

export interface UserBehavior {
  userId: string;
  sessionId: string;
  events: AnalyticsEvent[];
  sessionDuration: number;
  pagesVisited: string[];
  actionsPerformed: string[];
  lastActivity: string;
}

export class AnalyticsManager {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
    this.bindPageEvents();
  }

  // Track an event
  trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type: 'event',
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      metadata,
    };

    this.events.push(event);
    this.saveEvents();
  }

  // Track page view
  trackPageView(pageId: string, pageTitle?: string) {
    this.trackEvent('page', 'view', pageTitle, undefined, {
      pageId,
      pageTitle,
    });
  }

  // Track user action
  trackUserAction(
    action: string,
    componentId?: string,
    componentType?: string
  ) {
    this.trackEvent('user', action, componentId, undefined, {
      componentId,
      componentType,
    });
  }

  // Track editor action
  trackEditorAction(
    action: string,
    componentId?: string,
    componentType?: string
  ) {
    this.trackEvent('editor', action, componentId, undefined, {
      componentId,
      componentType,
    });
  }

  // Track performance
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.trackEvent('performance', metric, unit, value);
  }

  // Track error
  trackError(error: string, componentId?: string, stack?: string) {
    this.trackEvent('error', 'occurred', error, undefined, {
      componentId,
      stack,
    });
  }

  // Get analytics data
  getAnalyticsData(): {
    totalEvents: number;
    sessionDuration: number;
    pagesVisited: string[];
    topActions: Array<{ action: string; count: number }>;
    topCategories: Array<{ category: string; count: number }>;
    errors: number;
  } {
    const now = Date.now();
    const sessionStart = this.events[0]?.timestamp || now;
    const sessionDuration = now - sessionStart;

    const pagesVisited = [
      ...new Set(
        this.events
          .filter(e => e.category === 'page' && e.action === 'view')
          .map(e => e.pageUrl)
      ),
    ];

    const actionCounts: { [key: string]: number } = {};
    const categoryCounts: { [key: string]: number } = {};
    let errorCount = 0;

    this.events.forEach(event => {
      actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;
      categoryCounts[event.category] =
        (categoryCounts[event.category] || 0) + 1;

      if (event.category === 'error') {
        errorCount++;
      }
    });

    const topActions = Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([action, count]) => ({ action, count }));

    const topCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([category, count]) => ({ category, count }));

    return {
      totalEvents: this.events.length,
      sessionDuration,
      pagesVisited,
      topActions,
      topCategories,
      errors: errorCount,
    };
  }

  // Get page analytics
  getPageAnalytics(pageId: string): PageAnalytics | null {
    const pageEvents = this.events.filter(
      e => e.metadata?.pageId === pageId || e.pageUrl.includes(pageId)
    );

    if (pageEvents.length === 0) return null;

    const views = pageEvents.filter(
      e => e.category === 'page' && e.action === 'view'
    ).length;
    const uniqueViews = new Set(pageEvents.map(e => e.userId || e.sessionId))
      .size;

    const timeOnPageEvents = pageEvents.filter(
      e => e.category === 'performance' && e.action === 'timeOnPage'
    );
    const avgTimeOnPage =
      timeOnPageEvents.length > 0
        ? timeOnPageEvents.reduce((sum, e) => sum + (e.value || 0), 0) /
          timeOnPageEvents.length
        : 0;

    const bounceEvents = pageEvents.filter(
      e => e.category === 'page' && e.action === 'bounce'
    );
    const bounceRate = views > 0 ? (bounceEvents.length / views) * 100 : 0;

    const lastViewed =
      pageEvents.length > 0
        ? new Date(Math.max(...pageEvents.map(e => e.timestamp))).toISOString()
        : new Date().toISOString();

    return {
      pageId,
      pageUrl: pageEvents[0]?.pageUrl || '',
      views,
      uniqueViews,
      avgTimeOnPage,
      bounceRate,
      lastViewed,
      topReferrers: [],
      topCountries: [],
      topDevices: [],
    };
  }

  // Set user ID
  setUserId(userId: string) {
    this.userId = userId;
    localStorage.setItem('analytics_user_id', userId);
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Export analytics data
  exportData(): string {
    return JSON.stringify(
      {
        sessionId: this.sessionId,
        userId: this.userId,
        events: this.events,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  // Clear analytics data
  clearData() {
    this.events = [];
    localStorage.removeItem('analytics_events');
  }

  // Private methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadUserId() {
    this.userId = localStorage.getItem('analytics_user_id') || undefined;
  }

  private saveEvents() {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events));
    } catch (error) {
      console.warn('Failed to save analytics events:', error);
    }
  }

  private bindPageEvents() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page', 'hidden');
      } else {
        this.trackEvent('page', 'visible');
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent('page', 'unload');
    });

    // Track clicks
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement;
      this.trackEvent('interaction', 'click', target.tagName.toLowerCase());
    });

    // Track scroll
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackEvent('interaction', 'scroll', undefined, window.scrollY);
      }, 100);
    });
  }
}
