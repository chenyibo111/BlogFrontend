// Image URL helper function
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

export function getImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  // If already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If starts with /, prepend base URL
  if (url.startsWith('/')) {
    return `${BASE_URL}${url}`;
  }
  
  // Otherwise, assume it's already a relative path
  return `${BASE_URL}/${url}`;
}

export function getPlaceholderImage(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTNlM2UzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
}
