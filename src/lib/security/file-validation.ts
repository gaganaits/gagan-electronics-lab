import crypto from "crypto";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
  normalizedExtension?: string;
  detectedMime?: string;
}

export const ALLOWED_EXTENSIONS = [
  "stl",
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
] as const;

export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

export const MAX_FILE_SIZES: Record<string, number> = {
  stl: 50 * 1024 * 1024, // 50 MB
  pdf: 20 * 1024 * 1024, // 20 MB
  jpg: 10 * 1024 * 1024, // 10 MB
  jpeg: 10 * 1024 * 1024, // 10 MB
  png: 10 * 1024 * 1024, // 10 MB
  webp: 10 * 1024 * 1024, // 10 MB
};

export const MAX_FILES_PER_QUOTE = 10;

const DANGEROUS_EXTENSIONS = new Set([
  "exe", "bat", "cmd", "sh", "ps1", "js", "mjs", "cjs", "jsx", "ts", "tsx",
  "html", "htm", "xhtml", "php", "phtml", "py", "rb", "pl", "cgi",
  "svg", "xml", "jsp", "asp", "aspx", "dll", "so", "dylib", "scr", "vbs",
  "jar", "war", "ear", "msi", "com", "bin", "elf"
]);

/**
 * Sanitize filename for safe UI presentation and remove directory traversal attempts
 */
export function sanitizeFilename(raw: string): string {
  // Strip null bytes and directory traversal sequences
  let clean = raw.replace(/\0/g, "").replace(/[\/\\]/g, "_");
  clean = clean.replace(/(\.\.)+/g, "_");
  // Keep only alphanumeric, hyphen, underscore, and dot
  clean = clean.replace(/[^a-zA-Z0-9_\-\. ]/g, "_");
  if (clean.length > 100) {
    const ext = clean.substring(clean.lastIndexOf("."));
    clean = clean.substring(0, 90) + ext;
  }
  return clean || "unnamed_file";
}

/**
 * Generate an unpredictable private storage path
 * format: quotes/{quoteId}/{randomId}.{ext}
 */
export function generateSecureStoragePath(quoteId: string, ext: string): string {
  const safeQuoteId = quoteId.replace(/[^a-zA-Z0-9_\-]/g, "");
  const randomId = crypto.randomUUID();
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `quotes/${safeQuoteId}/${randomId}.${safeExt}`;
}

/**
 * Validate file metadata, extension, size, and magic bytes / signatures
 */
export function validateUploadedFile(
  filename: string,
  buffer: Buffer,
  declaredMimeType: string
): FileValidationResult {
  const cleanName = sanitizeFilename(filename);
  const parts = cleanName.split(".");
  if (parts.length < 2) {
    return { valid: false, error: "File must have a valid extension (.stl, .pdf, .jpg, .png, .webp)" };
  }

  const ext = parts[parts.length - 1].toLowerCase();

  // Check dangerous extension blacklist
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Executable or script files (.${ext}) are strictly prohibited.` };
  }

  // Check whitelist
  if (!ALLOWED_EXTENSIONS.includes(ext as AllowedExtension)) {
    return {
      valid: false,
      error: `Unsupported file type .${ext}. Only STL, PDF, JPG, PNG, and WEBP files are accepted.`
    };
  }

  // Check file size limits
  const maxSize = MAX_FILE_SIZES[ext] || 10 * 1024 * 1024;
  if (buffer.length > maxSize) {
    const limitMb = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File "${cleanName}" exceeds the maximum allowed size of ${limitMb} MB for .${ext} files.`
    };
  }

  if (buffer.length === 0) {
    return { valid: false, error: "Uploaded file is empty (0 bytes)." };
  }

  // Magic byte checks
  let detectedMime = declaredMimeType;

  if (ext === "pdf") {
    // PDF starts with %PDF-
    const header = buffer.subarray(0, 5).toString("utf-8");
    if (!header.startsWith("%PDF-")) {
      return { valid: false, error: "File content does not match a valid PDF document." };
    }
    detectedMime = "application/pdf";
  } else if (ext === "png") {
    // PNG starts with 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer.length < 8 ||
      buffer[0] !== 0x89 ||
      buffer[1] !== 0x50 ||
      buffer[2] !== 0x4e ||
      buffer[3] !== 0x47 ||
      buffer[4] !== 0x0d ||
      buffer[5] !== 0x0a ||
      buffer[6] !== 0x1a ||
      buffer[7] !== 0x0a
    ) {
      return { valid: false, error: "File content does not match a valid PNG image." };
    }
    detectedMime = "image/png";
  } else if (ext === "jpg" || ext === "jpeg") {
    // JPEG starts with FF D8 FF
    if (buffer.length < 3 || buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
      return { valid: false, error: "File content does not match a valid JPEG image." };
    }
    detectedMime = "image/jpeg";
  } else if (ext === "webp") {
    // RIFF .... WEBP
    const riff = buffer.subarray(0, 4).toString("utf-8");
    const webp = buffer.subarray(8, 12).toString("utf-8");
    if (riff !== "RIFF" || webp !== "WEBP") {
      return { valid: false, error: "File content does not match a valid WEBP image." };
    }
    detectedMime = "image/webp";
  } else if (ext === "stl") {
    // STL is either ASCII (starts with "solid" case-insensitive) or Binary (80-byte header + uint32 triangle count)
    const asciiCheck = buffer.subarray(0, 80).toString("utf-8").trim().toLowerCase();
    const isAscii = asciiCheck.startsWith("solid");

    if (isAscii) {
      detectedMime = "model/stl";
    } else {
      // Binary STL must be at least 84 bytes
      if (buffer.length < 84) {
        return { valid: false, error: "STL model file is corrupted or too short." };
      }
      // Binary STL triangle count at byte 80 (little endian)
      const numTriangles = buffer.readUInt32LE(80);
      const expectedSize = 84 + numTriangles * 50;
      // Allow minor padding but must reasonably match
      if (Math.abs(buffer.length - expectedSize) > 500 && buffer.length < expectedSize) {
        return { valid: false, error: "Binary STL file is incomplete or corrupted." };
      }
      detectedMime = "model/stl";
    }
  }

  return {
    valid: true,
    sanitizedFilename: cleanName,
    normalizedExtension: ext,
    detectedMime,
  };
}
