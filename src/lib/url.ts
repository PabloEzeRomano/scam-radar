export function deriveTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const segments = pathname.split('/').filter(segment => segment.length > 0);

    if (segments.length === 0) {
      return urlObj.hostname;
    }

    // Get the last non-empty segment
    const lastSegment = segments[segments.length - 1];

    // Clean up the segment (remove query params, fragments, etc.)
    const cleanSegment = lastSegment.split(/[?#]/)[0];

    return cleanSegment || urlObj.hostname;
  } catch {
    // If URL parsing fails, return the original URL
    return url;
  }
}

export function detectPlatform(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes('linkedin.com')) {
      return 'LinkedIn';
    } else if (hostname.includes('github.com')) {
      return 'GitHub';
    } else if (hostname.includes('bitbucket.org')) {
      return 'Bitbucket';
    } else if (hostname.includes('x.com') || hostname.includes('twitter.com')) {
      return 'X/Twitter';
    } else {
      return 'Other';
    }
  } catch {
    return 'Other';
  }
}
