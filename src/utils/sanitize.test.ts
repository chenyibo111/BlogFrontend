import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from '../utils/sanitize'

describe('sanitizeHtml', () => {
  it('removes script tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('script')
    expect(result).toContain('<p>Hello</p>')
  })

  it('removes onclick attributes', () => {
    const input = '<p onclick="alert(\'xss\')">Click me</p>'
    const result = sanitizeHtml(input)
    expect(result).not.toContain('onclick')
    expect(result).toContain('<p>Click me</p>')
  })

  it('preserves safe tags', () => {
    const input = '<h1>Title</h1><p>Paragraph</p><strong>Bold</strong>'
    const result = sanitizeHtml(input)
    expect(result).toBe(input)
  })

  it('preserves images with src', () => {
    const input = '<img src="https://example.com/image.jpg" alt="test" />'
    const result = sanitizeHtml(input)
    expect(result).toContain('src')
    expect(result).toContain('alt')
  })

  it('handles empty input', () => {
    expect(sanitizeHtml('')).toBe('')
  })
})