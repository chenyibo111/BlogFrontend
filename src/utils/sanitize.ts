import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous tags and attributes while preserving safe content
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    // Allow common formatting and content tags
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'em', 'u', 's', 'del', 'ins',
      'a', 'img',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'figure', 'figcaption',
      'div', 'span',
    ],
    // Allow safe attributes
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'target', 'rel',
      'class', 'id',
      'width', 'height',
      'data-*', // Allow data attributes for custom use
    ],
    // Allow data attributes (like data-video, etc.)
    ALLOW_DATA_ATTR: true,
    // Add rel="noopener noreferrer" to all links for security
    ADD_ATTR: ['target', 'rel'],
  });
}

/**
 * Configure DOMPurify to add security attributes to links
 */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  // Add rel="noopener noreferrer" to all anchor tags with target="_blank"
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});