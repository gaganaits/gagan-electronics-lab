/**
 * Security validation for Google Drive URLs
 * STRICT SSRF PROTECTION:
 * We never perform server-side HTTP requests/fetching of customer-supplied URLs.
 * We strictly validate that the URL domain matches approved Google Drive / Docs origins.
 */

const APPROVED_HOSTNAMES = new Set([
  "drive.google.com",
  "docs.google.com",
]);

export interface UrlValidationResult {
  valid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

export function validateGoogleDriveUrl(rawUrl: string | undefined | null): UrlValidationResult {
  if (!rawUrl || rawUrl.trim() === "") {
    return { valid: true };
  }

  const trimmed = rawUrl.trim();

  // Basic length limit (prevent memory exhaustion)
  if (trimmed.length > 500) {
    return { valid: false, error: "Provided URL exceeds the maximum length of 500 characters." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: "Invalid URL format." };
  }

  // Must be HTTPS protocol
  if (parsed.protocol !== "https:") {
    return { valid: false, error: "Only secure HTTPS URLs are accepted." };
  }

  // Must be strictly from approved hostnames
  const host = parsed.hostname.toLowerCase();
  if (!APPROVED_HOSTNAMES.has(host)) {
    return {
      valid: false,
      error: "URL must be hosted on drive.google.com or docs.google.com.",
    };
  }

  // Disallow user credentials in URL (e.g. https://user:pass@drive.google.com)
  if (parsed.username || parsed.password) {
    return { valid: false, error: "URL contains forbidden authentication credentials." };
  }

  // Disallow non-standard ports (e.g. drive.google.com:8080)
  if (parsed.port && parsed.port !== "443") {
    return { valid: false, error: "Non-standard network ports are not permitted." };
  }

  return {
    valid: true,
    sanitizedUrl: parsed.toString(),
  };
}
