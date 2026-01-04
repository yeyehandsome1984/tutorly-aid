/**
 * Sanitizes blog content to ensure consistent styling
 * Removes legacy inline styles that cause visual inconsistencies
 */

/**
 * Removes inline color styles from HTML content
 */
export function removeInlineColors(html: string): string {
  if (!html) return html;

  let sanitized = html;

  // Remove color from style attributes (keep other styles)
  sanitized = sanitized.replace(
    /style="([^"]*)"/gi,
    (match, styles) => {
      // Remove color-related properties
      const cleanedStyles = styles
        .split(';')
        .map((s: string) => s.trim())
        .filter((s: string) => {
          const prop = s.split(':')[0]?.trim().toLowerCase();
          return prop && !['color', 'background-color', 'background'].includes(prop);
        })
        .join('; ');
      
      return cleanedStyles ? `style="${cleanedStyles}"` : '';
    }
  );

  // Remove legacy font color attributes
  sanitized = sanitized.replace(/\s+color=["'][^"']*["']/gi, '');
  
  // Remove font tags with color (legacy HTML)
  sanitized = sanitized.replace(
    /<font[^>]*color=["'][^"']*["'][^>]*>([\s\S]*?)<\/font>/gi,
    '$1'
  );

  return sanitized;
}

/**
 * Normalizes table structure for consistent rendering
 */
export function normalizeTableStructure(html: string): string {
  if (!html) return html;

  let sanitized = html;

  // Ensure tables have proper structure
  // Remove width/height attributes that may cause layout issues
  sanitized = sanitized.replace(
    /<table([^>]*)>/gi,
    (match, attrs) => {
      const cleanedAttrs = attrs
        .replace(/\s*width=["'][^"']*["']/gi, '')
        .replace(/\s*height=["'][^"']*["']/gi, '')
        .replace(/\s*cellpadding=["'][^"']*["']/gi, '')
        .replace(/\s*cellspacing=["'][^"']*["']/gi, '')
        .replace(/\s*border=["'][^"']*["']/gi, '')
        .trim();
      return `<table${cleanedAttrs ? ' ' + cleanedAttrs : ''}>`;
    }
  );

  // Clean td/th attributes
  sanitized = sanitized.replace(
    /<(t[dh])([^>]*)>/gi,
    (match, tag, attrs) => {
      const cleanedAttrs = attrs
        .replace(/\s*width=["'][^"']*["']/gi, '')
        .replace(/\s*height=["'][^"']*["']/gi, '')
        .replace(/\s*bgcolor=["'][^"']*["']/gi, '')
        .replace(/\s*valign=["'][^"']*["']/gi, '')
        .replace(/\s*align=["'][^"']*["']/gi, '')
        .trim();
      return `<${tag}${cleanedAttrs ? ' ' + cleanedAttrs : ''}>`;
    }
  );

  return sanitized;
}

/**
 * Cleans up empty paragraphs and excessive whitespace
 */
export function cleanupWhitespace(html: string): string {
  if (!html) return html;

  let sanitized = html;

  // Remove empty paragraphs (but keep intentional spacing)
  sanitized = sanitized.replace(/<p>\s*<\/p>/gi, '');
  sanitized = sanitized.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '<p>&nbsp;</p>');

  // Normalize multiple consecutive breaks
  sanitized = sanitized.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');

  // Remove excessive whitespace between tags
  sanitized = sanitized.replace(/>\s{2,}</g, '> <');

  return sanitized;
}

/**
 * Ensures all images have alt attributes
 */
export function ensureImageAccessibility(html: string): string {
  if (!html) return html;

  return html.replace(
    /<img([^>]*)>/gi,
    (match, attrs) => {
      if (!/alt=/i.test(attrs)) {
        return `<img${attrs} alt="">`;
      }
      return match;
    }
  );
}

/**
 * Main sanitizer function that combines all cleanup operations
 */
export function sanitizeBlogContent(html: string): string {
  if (!html) return html;

  let sanitized = html;

  // Apply all sanitization steps
  sanitized = removeInlineColors(sanitized);
  sanitized = normalizeTableStructure(sanitized);
  sanitized = cleanupWhitespace(sanitized);
  sanitized = ensureImageAccessibility(sanitized);

  return sanitized.trim();
}
