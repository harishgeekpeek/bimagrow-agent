/**
 * URL Validation Utility - Validates URLs before opening them
 * Prevents: Phishing, URL injection, protocol attacks
 */

/**
 * Configuration for allowed domains
 * Add your S3 bucket domain and any other trusted domains here
 */
const ALLOWED_DOMAINS = [
  // AWS S3 domains
  "s3.amazonaws.com",
  "s3-",  // Matches any s3-[region].amazonaws.com
  ".s3.amazonaws.com",
  ".s3.",
  
  // Add your company domains here
  // Example:
  // "cdn.yourdomain.com",
  // "documents.yourdomain.com",
];

/**
 * Blocked protocols that should never be opened
 */
const BLOCKED_PROTOCOLS = [
  "javascript:",
  "data:",
  "file:",
  "vbscript:",
  "about:",
  "chrome:",
  "blob:",
];

/**
 * Validate if a URL is safe to open
 * 
 * Checks:
 * - Protocol is HTTPS only
 * - No blocked protocols
 * - Domain is in whitelist
 * - Valid URL structure
 * 
 * @param url - URL to validate
 * @returns true if safe, false if potentially malicious
 */
export const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  
  try {
    // Check for blocked protocols in string
    const lowerUrl = url.toLowerCase();
    for (const blocked of BLOCKED_PROTOCOLS) {
      if (lowerUrl.includes(blocked)) {
        console.warn(`Blocked protocol detected: ${blocked}`);
        return false;
      }
    }
    
    // Parse URL
    const parsed = new URL(url);
    
    // Only allow HTTPS
    if (parsed.protocol !== "https:") {
      console.warn(`Non-HTTPS protocol blocked: ${parsed.protocol}`);
      return false;
    }
    
    // Check domain against whitelist
    const isAllowedDomain = ALLOWED_DOMAINS.some(domain => {
      if (domain.startsWith("-")) {
        // Handle s3- prefix
        return parsed.hostname?.includes(domain);
      }
      if (domain.startsWith(".")) {
        // Handle .domain.com suffix
        return parsed.hostname?.endsWith(domain) || parsed.hostname === domain.substring(1);
      }
      return parsed.hostname === domain || parsed.hostname?.endsWith("." + domain);
    });
    
    if (!isAllowedDomain) {
      console.warn(`Domain not whitelisted: ${parsed.hostname}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn("Invalid URL structure:", url);
    return false;
  }
};

/**
 * Validate S3 presigned URLs specifically
 * 
 * Presigned URLs have the format:
 * https://[bucket-name].s3.amazonaws.com/[key]?X-Amz-Algorithm=...
 * 
 * @param url - URL to validate
 * @returns true if it's a valid S3 presigned URL
 */
export const isValidS3Url = (url: string | undefined): boolean => {
  if (!isValidUrl(url)) return false;
  
  try {
    const parsed = new URL(url!);
    
    // Must have X-Amz-Signature query parameter (S3 presigned URL indicator)
    const hasSignature = parsed.searchParams.has("X-Amz-Signature");
    
    // S3 URLs should have X-Amz-Algorithm
    const hasAlgorithm = parsed.searchParams.has("X-Amz-Algorithm");
    
    // At least one presigned URL indicator should exist
    if (!hasSignature && !hasAlgorithm) {
      console.warn("Not a valid S3 presigned URL (missing X-Amz parameters)");
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate policy document URLs
 * Works for both S3 presigned URLs and direct document URLs
 * 
 * @param url - URL to validate
 * @returns true if safe to open
 */
export const isValidPolicyUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  
  // Try S3 validation first
  if (isValidS3Url(url)) return true;
  
  // Fall back to generic URL validation
  return isValidUrl(url);
};

/**
 * Validate phone links and contact URLs
 * Used for mailto:, tel:, whatsapp: protocols
 * 
 * @param url - URL to validate
 * @returns true if safe to open
 */
export const isValidContactUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  
  const lowerUrl = url.toLowerCase();
  
  // Allow specific protocols for contact
  if (lowerUrl.startsWith("tel:")) {
    const number = url.substring(4);
    // Only digits, +, -, spaces, parentheses
    return /^[\d\s\-\+\(\)]+$/.test(number) && number.length > 5;
  }
  
  if (lowerUrl.startsWith("mailto:")) {
    const email = url.substring(7);
    // Basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  if (lowerUrl.startsWith("https://wa.me/")) {
    const number = url.substring(14);
    // WhatsApp URLs should have only digits
    return /^[\d]+$/.test(number) && number.length > 5;
  }
  
  return false;
};

/**
 * Sanitize URL for display (removes query params that might contain tokens)
 * 
 * @param url - URL to sanitize
 * @returns Sanitized URL string safe to display
 */
export const sanitizeUrlForDisplay = (url: string | undefined): string => {
  if (!url) return "";
  
  try {
    const parsed = new URL(url);
    // Return just the domain and path, not query params
    return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`;
  } catch {
    return "[Invalid URL]";
  }
};
