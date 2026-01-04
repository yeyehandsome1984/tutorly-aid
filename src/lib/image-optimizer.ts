/**
 * Optimizes images in HTML content for better performance
 * - Adds lazy loading
 * - Adds async decoding
 * - Wraps images in picture elements with WebP support (if URL supports it)
 * - Adds proper sizing attributes
 */

export function optimizeHtmlImages(html: string): string {
  if (!html) return html;

  // Process each img tag
  let optimizedHtml = html.replace(
    /<img\s+([^>]*)>/gi,
    (match, attributes) => {
      // Parse existing attributes
      const srcMatch = attributes.match(/src=["']([^"']+)["']/i);
      const altMatch = attributes.match(/alt=["']([^"']*)["']/i);
      const classMatch = attributes.match(/class=["']([^"']*)["']/i);
      const widthMatch = attributes.match(/width=["']?(\d+)["']?/i);
      const heightMatch = attributes.match(/height=["']?(\d+)["']?/i);

      if (!srcMatch) return match;

      const src = srcMatch[1];
      const alt = altMatch ? altMatch[1] : '';
      const existingClass = classMatch ? classMatch[1] : '';
      const width = widthMatch ? widthMatch[1] : '';
      const height = heightMatch ? heightMatch[1] : '';

      // Build optimized img attributes
      const imgClasses = `${existingClass} max-w-full h-auto`.trim();
      
      // Check if source is from Supabase storage (supports transformations)
      const isSupabaseStorage = src.includes('supabase') && src.includes('storage');
      
      // Check if already WebP
      const isWebP = src.toLowerCase().endsWith('.webp');
      
      // For Supabase storage images, we can request WebP format
      let webpSrc = src;
      if (isSupabaseStorage && !isWebP) {
        // Supabase storage transformation for WebP
        webpSrc = src.includes('?') 
          ? `${src}&format=webp&quality=80` 
          : `${src}?format=webp&quality=80`;
      }

      // Build size attributes
      const sizeAttrs = [
        width ? `width="${width}"` : '',
        height ? `height="${height}"` : '',
      ].filter(Boolean).join(' ');

      // Create picture element with WebP source for supported images
      if (isSupabaseStorage && !isWebP) {
        return `<picture>
          <source srcset="${webpSrc}" type="image/webp">
          <img 
            src="${src}" 
            alt="${alt}" 
            class="${imgClasses}"
            loading="lazy"
            decoding="async"
            ${sizeAttrs}
          >
        </picture>`;
      }

      // For other images, just optimize the img tag
      return `<img 
        src="${src}" 
        alt="${alt}" 
        class="${imgClasses}"
        loading="lazy"
        decoding="async"
        ${sizeAttrs}
      >`;
    }
  );

  // Clean up extra whitespace in tags
  optimizedHtml = optimizedHtml.replace(/\s+>/g, '>');
  optimizedHtml = optimizedHtml.replace(/\s{2,}/g, ' ');

  return optimizedHtml;
}

/**
 * Generates srcset for responsive images
 */
export function generateSrcSet(src: string, widths: number[] = [400, 800, 1200]): string {
  const isSupabaseStorage = src.includes('supabase') && src.includes('storage');
  
  if (!isSupabaseStorage) {
    return src;
  }

  return widths
    .map(w => {
      const transformedUrl = src.includes('?')
        ? `${src}&width=${w}&format=webp&quality=80`
        : `${src}?width=${w}&format=webp&quality=80`;
      return `${transformedUrl} ${w}w`;
    })
    .join(', ');
}

/**
 * Checks if a URL points to a WebP image
 */
export function isWebPImage(url: string): boolean {
  return url.toLowerCase().endsWith('.webp');
}

/**
 * Gets optimal image format based on browser support
 */
export function getOptimalImageUrl(src: string): string {
  const isSupabaseStorage = src.includes('supabase') && src.includes('storage');
  
  if (!isSupabaseStorage || isWebPImage(src)) {
    return src;
  }

  // Add WebP transformation for Supabase storage
  return src.includes('?')
    ? `${src}&format=webp&quality=80`
    : `${src}?format=webp&quality=80`;
}
