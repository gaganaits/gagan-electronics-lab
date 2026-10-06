# Gagan Electronics Lab --- Security Specification

**Document:** Security Requirements & Controls\
**Project:** Gagan Electronics Lab 3D Printing Website\
**Version:** 1.0\
**Status:** Initial Security Baseline

------------------------------------------------------------------------

## 1. Security Objective

Protect:

-   Customer personal information
-   Customer STL/CAD files
-   PDFs and images
-   Google Drive links
-   Quotation information
-   Pricing configuration
-   Admin accounts
-   Database records
-   Storage objects
-   Application secrets

The application must follow a defense-in-depth model.

No single frontend control should be treated as a security boundary.

------------------------------------------------------------------------

## 2. Threat Model

Important threats include:

1.  Malicious file uploads
2.  Unauthorized quote access
3.  Unauthorized admin access
4.  Broken object-level authorization / IDOR
5.  XSS
6.  SQL injection
7.  SSRF through Google Drive URLs
8.  Path traversal
9.  Storage bucket exposure
10. API abuse
11. Brute-force authentication
12. Rate-limit bypass
13. Secret leakage
14. CSRF where applicable
15. Session theft
16. Privilege escalation
17. Oversized file/resource exhaustion
18. Sensitive information leakage through logs/errors
19. Supply-chain vulnerabilities
20. Automated spam submissions

------------------------------------------------------------------------

## 3. Security Principles

### Never trust client input

Treat all browser input as untrusted.

This includes:

-   IDs
-   filenames
-   MIME types
-   URLs
-   prices
-   roles
-   statuses
-   quantities
-   dates
-   file contents

------------------------------------------------------------------------

## 4. Authentication

Admin authentication must use a trusted authentication system such as
Supabase Auth.

Requirements:

-   Strong password policy
-   Secure session management
-   Logout support
-   Password reset protection
-   Failed-login throttling
-   No custom homemade authentication
-   No passwords stored in application tables
-   No authentication tokens manually stored in insecure custom
    mechanisms

Optional future controls:

-   MFA
-   Passkeys
-   SSO

------------------------------------------------------------------------

## 5. Authorization

Authorization must be enforced independently of the UI.

Every protected operation must verify:

``` text
Authenticated?
      |
      v
Correct role?
      |
      v
Allowed operation?
      |
      v
Allowed resource?
```

Do not rely on:

``` text
if (isAdmin) show button
```

The API/database must independently enforce the same rule.

------------------------------------------------------------------------

## 6. Admin Route Protection

Protected routes:

``` text
/admin
/admin/dashboard
/admin/quotes
/admin/quotes/[id]
/admin/products
/admin/pricing
/admin/settings
```

Unauthenticated users must be denied.

Non-admin users must receive an authorization failure.

Direct navigation to a protected URL must not bypass authorization.

------------------------------------------------------------------------

## 7. IDOR Protection

Never assume that knowing an ID grants access.

Bad:

``` text
GET /api/quotes/123
```

followed by:

``` text
SELECT * FROM quotes WHERE id = 123
```

without authorization.

Correct model:

``` text
authenticate
→ authorize
→ verify ownership/role
→ retrieve resource
```

Use RLS and server-side authorization.

Public reference numbers must not expose sequential database IDs where
avoidable.

------------------------------------------------------------------------

## 8. Database Security

Enable Supabase Row Level Security on all application tables.

Tables requiring RLS include:

-   quotes
-   quote_files
-   products
-   pricing_config
-   admin_profiles
-   audit_logs

Policies must follow least privilege.

Never use permissive policies equivalent to:

``` text
USING (true)
```

for sensitive customer/admin data unless the data is genuinely intended
to be public.

------------------------------------------------------------------------

## 9. Service Role Key

The Supabase service-role key is a privileged secret.

It must:

-   Exist only in server-side environment configuration
-   Never appear in browser bundles
-   Never be prefixed with `NEXT_PUBLIC_`
-   Never be committed to Git
-   Never be logged
-   Never be sent to customers

If accidentally exposed:

1.  Treat it as compromised.
2.  Rotate it immediately.
3.  Inspect logs/repository history.
4.  Remove the leaked secret.
5.  Review unauthorized access.

------------------------------------------------------------------------

## 10. Environment Variables

Never hard-code secrets.

Use environment variables.

`.env.example` may contain names but no real credentials.

Never commit:

``` text
.env
.env.local
.env.production
```

when they contain secrets.

Use Git ignore rules.

------------------------------------------------------------------------

## 11. File Upload Security

Customer uploads are untrusted.

Allowed types should be explicit:

``` text
.stl
.pdf
.jpg
.jpeg
.png
.webp
```

Do not accept arbitrary file types.

Never rely only on extension checks.

Perform:

-   Extension validation
-   MIME validation
-   File signature/magic-byte validation where applicable
-   Size validation
-   Count validation

------------------------------------------------------------------------

## 12. Dangerous File Types

Reject executable/script-like content, including:

``` text
.exe
.dll
.bat
.cmd
.ps1
.js
.mjs
.html
.htm
.php
.jsp
.aspx
```

Do not allow arbitrary SVG uploads unless they are explicitly required
and safely sanitized.

------------------------------------------------------------------------

## 13. File Naming

Never use user-controlled filenames as object paths.

Bad:

``` text
storage/<original-filename>
```

Use:

``` text
quotes/<server-generated-quote-id>/<random-file-id>.<validated-extension>
```

Sanitize filenames shown in the UI.

------------------------------------------------------------------------

## 14. Storage Security

Customer files must live in a private storage bucket.

Never make the quote upload bucket public.

Downloads should use short-lived signed URLs.

A signed URL should:

-   Expire quickly
-   Be generated only for authorized users
-   Not be logged
-   Not be embedded permanently in the database

------------------------------------------------------------------------

## 15. File Size / Resource Exhaustion

Apply hard limits.

Suggested initial limits:

``` text
STL       50 MB
PDF       20 MB
Images    10 MB each
Files     5–10 per quote
```

These values may be adjusted based on actual business needs.

Reject oversized files before expensive processing.

------------------------------------------------------------------------

## 16. File Upload Abuse

Protect upload endpoints using:

-   Authentication where appropriate
-   IP/session rate limiting
-   Request size limits
-   File count limits
-   Storage quota checks
-   Duplicate submission prevention

Do not allow an attacker to fill the free storage quota through repeated
requests.

------------------------------------------------------------------------

## 17. Google Drive URL Security

Accept only the intended Google Drive/Google document domains.

Do not allow arbitrary URLs to trigger server-side fetching.

This prevents SSRF risks.

If the application later downloads Drive content automatically:

-   Validate host
-   Validate redirects
-   Block private/internal IP ranges
-   Restrict protocols to HTTPS
-   Apply response size limits
-   Apply timeouts
-   Do not follow arbitrary redirects
-   Use Google OAuth where required

------------------------------------------------------------------------

## 18. Rate Limiting

Rate limit at least:

``` text
Quote submissions
Contact form
File uploads
Authentication
Password reset
Admin APIs
```

Example starting point:

``` text
Quote:
5/hour/IP

Contact:
5/hour/IP

Authentication:
strict failed-attempt throttling

Uploads:
limited per IP/session
```

Tune these values after observing legitimate traffic.

Rate limiting must not exist only in JavaScript.

------------------------------------------------------------------------

## 19. CAPTCHA / Bot Defense

Cloudflare Turnstile may be introduced for public forms.

Use it when:

-   Spam increases
-   Automated quote submissions appear
-   Rate limiting alone is insufficient

Keep CAPTCHA optional initially if the user experience does not require
it.

------------------------------------------------------------------------

## 20. Content Security Policy

Implement CSP in enforcement mode after resolving violations.

Recommended conceptual baseline:

``` text
default-src 'self';

script-src 'self';

style-src 'self' 'unsafe-inline';

img-src 'self' data: https:;

font-src 'self' data:;

connect-src 'self' https://<approved-supabase-domain>;

frame-src 'self' https://<approved-domains>;

object-src 'none';

base-uri 'self';

form-action 'self';

frame-ancestors 'none';
```

The exact policy must be adapted to the actual application and
dependencies.

Do not blindly copy this policy.

Avoid:

``` text
script-src 'unsafe-inline'
```

Avoid:

``` text
script-src 'unsafe-eval'
```

unless technically unavoidable and documented.

Use nonces/hashes/framework-supported mechanisms where appropriate.

Start with `Content-Security-Policy-Report-Only` during migration if
necessary.

------------------------------------------------------------------------

## 21. Security Headers

Configure:

``` text
X-Content-Type-Options: nosniff

Referrer-Policy:
strict-origin-when-cross-origin

Strict-Transport-Security:
appropriate production policy

Permissions-Policy:
minimal required permissions

Content-Security-Policy:
application-specific policy
```

Use CSP `frame-ancestors` or an appropriate equivalent to prevent
clickjacking.

Do not enable browser capabilities the application does not need.

------------------------------------------------------------------------

## 22. XSS Protection

Prevent reflected, stored and DOM-based XSS.

Rules:

-   Escape dynamic HTML
-   Prefer React's normal rendering
-   Avoid `dangerouslySetInnerHTML`
-   Sanitize HTML if HTML rendering is genuinely required
-   Never inject user-supplied content into scripts
-   Never insert user-controlled values into raw HTML

Customer filenames and requirements must be treated as untrusted text.

------------------------------------------------------------------------

## 23. SQL Injection

Use parameterized queries / Supabase APIs.

Never construct SQL by string concatenation with user input.

Validate:

-   IDs
-   search terms
-   sorting parameters
-   pagination
-   filters

------------------------------------------------------------------------

## 24. CSRF

Where cookie-authenticated state-changing endpoints are used, implement
appropriate CSRF protections.

Use:

-   SameSite cookies where appropriate
-   Origin/Referer validation where appropriate
-   CSRF tokens where required by the architecture

Do not assume that CORS is a CSRF defense.

------------------------------------------------------------------------

## 25. CORS

Allow only origins that genuinely need access.

Do not configure:

``` text
Access-Control-Allow-Origin: *
```

for sensitive authenticated APIs.

Keep CORS separate from authentication and authorization.

------------------------------------------------------------------------

## 26. Server-Side Validation

Validate every API/server action with a schema.

Validate:

-   Required fields
-   String lengths
-   Email format
-   Phone format
-   Quantity range
-   Dates
-   Enum values
-   Product IDs
-   URLs
-   File metadata

Reject unexpected fields where practical.

------------------------------------------------------------------------

## 27. Pricing Security

Never trust browser-supplied final prices.

The client may modify JavaScript or HTTP requests.

Correct:

``` text
Customer inputs
       ↓
Server validation
       ↓
Server pricing configuration
       ↓
Server calculation
       ↓
Quote
```

Pricing configuration must be admin-only.

------------------------------------------------------------------------

## 28. Sensitive Data Logging

Do not log:

-   Passwords
-   Auth tokens
-   Service-role keys
-   API keys
-   Session cookies
-   Signed URLs
-   Full customer files
-   Full sensitive request bodies

Log only the minimum information necessary for troubleshooting and
auditing.

------------------------------------------------------------------------

## 29. Error Handling

Production errors must not expose:

-   Stack traces
-   SQL queries
-   Filesystem paths
-   Environment variables
-   Internal service URLs
-   Secrets
-   Database credentials

Customer-facing response:

``` text
Something went wrong while submitting your request.
Please try again.
```

Technical detail belongs in controlled server logs.

------------------------------------------------------------------------

## 30. Audit Logging

Log security-sensitive admin events:

``` text
ADMIN_LOGIN
QUOTE_VIEW
QUOTE_STATUS_CHANGE
QUOTE_PRICE_CHANGE
FILE_ACCESS
PRODUCT_CREATE
PRODUCT_UPDATE
PRODUCT_DELETE
PRICING_UPDATE
ADMIN_ROLE_CHANGE
```

Each log should include:

-   Admin user
-   Action
-   Resource
-   Timestamp
-   Relevant non-sensitive metadata

Do not log secrets.

------------------------------------------------------------------------

## 31. Session Security

Use secure framework/authentication sessions.

Requirements:

-   Secure cookies where applicable
-   HttpOnly cookies where applicable
-   SameSite policy
-   Session expiration
-   Logout support
-   Reauthentication for sensitive operations where appropriate

Do not implement custom token storage unnecessarily.

------------------------------------------------------------------------

## 32. Dependency Security

Before deployment:

``` text
npm audit
```

and equivalent dependency/security checks should be run.

Review:

-   Vulnerable packages
-   Abandoned packages
-   Unnecessary dependencies
-   Third-party scripts

Keep the dependency footprint small.

------------------------------------------------------------------------

## 33. Git Secret Scanning

Before the first production push, inspect the repository for:

-   API keys
-   Supabase service-role keys
-   JWT secrets
-   Passwords
-   OAuth secrets
-   Private certificates
-   Customer files

Use automated secret scanning where available.

If a secret enters Git history, rotate it rather than assuming deletion
is sufficient.

------------------------------------------------------------------------

## 34. Privacy and Customer Files

Customer STL/CAD files may contain proprietary designs.

Therefore:

-   Keep files private
-   Restrict admin access
-   Use signed URLs
-   Apply retention rules
-   Avoid public indexing
-   Never expose filenames unnecessarily
-   Do not use customer files for unrelated purposes
-   Document retention in the Privacy Policy

------------------------------------------------------------------------

## 35. Data Retention

Recommended architecture:

``` text
Quote submitted
      |
      v
Files stored privately
      |
      v
Quote reviewed/completed
      |
      v
Retention period
      |
      v
Automatic file deletion
```

The retention period must be agreed with the client.

Quote metadata may be retained longer than uploaded files if
business/legal requirements justify it.

------------------------------------------------------------------------

## 36. Security Testing

Test at minimum:

### Authentication

-   Invalid password
-   Brute-force attempts
-   Session expiration
-   Logout
-   Password reset

### Authorization

-   Anonymous access to admin
-   Staff access to admin-only functions
-   Cross-user quote access
-   Modified quote IDs
-   Modified product IDs
-   Modified storage paths

### Uploads

-   Valid STL
-   Valid PDF
-   Valid images
-   Oversized files
-   Wrong extension
-   Wrong MIME type
-   Renamed executable
-   Malicious SVG
-   Empty files
-   Too many files
-   Repeated uploads

### Input

-   XSS payloads
-   SQL injection payloads
-   Very long strings
-   Invalid IDs
-   Invalid URLs
-   Invalid quantities
-   Invalid dates

### API

-   Missing authentication
-   Missing authorization
-   Replay/repeated submissions
-   Rate-limit testing
-   Unexpected HTTP methods

------------------------------------------------------------------------

## 37. Security Regression Tests

Security tests must run whenever the following change:

-   Authentication
-   Authorization
-   RLS policies
-   Storage policies
-   File uploads
-   API routes
-   Pricing
-   Admin routes
-   CSP
-   Third-party integrations

------------------------------------------------------------------------

## 38. Production Security Checklist

### Authentication

-   [ ] Admin authentication enabled
-   [ ] Secure session handling
-   [ ] Logout works
-   [ ] Failed-login throttling
-   [ ] Password reset protected

### Authorization

-   [ ] Admin routes protected
-   [ ] APIs protected
-   [ ] RLS enabled
-   [ ] Storage policies enabled
-   [ ] IDOR tested
-   [ ] Role checks server-side

### Files

-   [ ] Private bucket
-   [ ] File type validation
-   [ ] MIME validation
-   [ ] File signature validation where practical
-   [ ] Size limits
-   [ ] Count limits
-   [ ] Random storage paths
-   [ ] Signed downloads
-   [ ] Retention policy

### Network/API

-   [ ] Rate limiting
-   [ ] CORS restricted
-   [ ] CSP
-   [ ] Security headers
-   [ ] HTTPS
-   [ ] Input validation
-   [ ] Safe error handling

### Secrets

-   [ ] No secrets in Git
-   [ ] Service-role key server-only
-   [ ] `.env` ignored
-   [ ] Secret scanning performed
-   [ ] Secrets rotated if exposed

### Privacy

-   [ ] Privacy Policy
-   [ ] Terms & Conditions
-   [ ] File retention documented
-   [ ] Customer files private
-   [ ] Sensitive logging avoided

------------------------------------------------------------------------

## 39. Incident Response

If a security incident occurs:

1.  Identify the affected component.
2.  Stop or restrict the affected operation.
3.  Rotate compromised credentials immediately.
4.  Revoke affected sessions/tokens where appropriate.
5.  Inspect logs.
6.  Determine affected data/files.
7.  Patch the vulnerability.
8.  Test the fix.
9.  Review whether customers/client need notification.
10. Document the incident.

Never continue using a known compromised secret simply because it is
inconvenient to rotate.

------------------------------------------------------------------------

## 40. Security Definition of Done

The application is not security-ready until:

-   Authentication works
-   Authorization works
-   RLS is enabled
-   Storage is private
-   Signed downloads work
-   File validation works
-   Upload limits work
-   Rate limiting works
-   CSP is configured
-   Security headers are configured
-   Secrets are hidden
-   Admin routes are protected
-   IDOR has been tested
-   XSS has been tested
-   SQL injection protections are verified
-   SSRF risks are addressed
-   Error messages are sanitized
-   Mobile quote/upload flow works
-   Security regression tests pass
