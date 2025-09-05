import React, { useState, useCallback } from 'react';
import { Spinner } from 'reactstrap';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  quality?: number;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  placeholder,
  fallback = '/images/placeholder.png',
  loading = 'lazy',
  onLoad,
  onError,
  quality = 75,
  priority = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder || src);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    setCurrentSrc(src);
    onLoad?.();
  }, [src, onLoad]);

  const handleError = useCallback(() => {
    setImageError(true);
    setCurrentSrc(fallback);
    onError?.();
  }, [fallback, onError]);

  // Generate optimized image URL (you can integrate with your image optimization service)
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    // If it's already an external URL or data URL, return as is
    if (originalSrc.startsWith('http') || originalSrc.startsWith('data:')) {
      return originalSrc;
    }

    // For local images, you can add optimization parameters
    // This is a placeholder - implement based on your image optimization service
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality) params.set('q', quality.toString());
    
    const queryString = params.toString();
    return queryString ? `${originalSrc}?${queryString}` : originalSrc;
  }, [width, height, quality]);

  const optimizedSrc = getOptimizedSrc(currentSrc);

  return (
    <div 
      className={`position-relative ${className}`}
      style={{ 
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
        ...style 
      }}
    >
      {/* Loading spinner */}
      {!imageLoaded && !imageError && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Spinner size="sm" color="primary" />
        </div>
      )}

      {/* Image */}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        className="img-fluid"
      />

      {/* Error fallback */}
      {imageError && (
        <div 
          className="position-absolute top-50 start-50 translate-middle text-center"
          style={{ color: '#6c757d' }}
        >
          <i className="fas fa-image fa-2x mb-2"></i>
          <div className="small">Image not available</div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;