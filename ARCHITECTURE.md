# Gagan Electronics Lab --- Application Architecture

**Document:** Architecture Specification\
**Project:** Gagan Electronics Lab 3D Printing Website\
**Version:** 1.0\
**Status:** Initial Implementation Baseline

------------------------------------------------------------------------

## 1. Purpose

This document defines the technical architecture for the Gagan
Electronics Lab website.

The application is a professional 3D-printing business website with:

-   Product/service catalogue
-   Product detail pages
-   Customer quotation requests
-   STL/PDF/image uploads
-   Google Drive links
-   Quote management
-   Protected administration
-   Future automatic 3D-print cost estimation
-   SEO and responsive public pages

The first release should operate within free-tier infrastructure
wherever practical, while keeping the architecture upgradeable.

------------------------------------------------------------------------

## 2. Architecture Principles

1.  Keep the public website fast and mostly static.
2.  Keep customer files out of the frontend hosting platform.
3.  Store structured application data in PostgreSQL.
4.  Store uploaded files in private object storage.
5.  Treat every uploaded file and user-provided value as untrusted.
6.  Enforce authorization server-side and at the database/storage layer.
7.  Keep pricing logic on the server.
8.  Separate public content from admin functionality.
9.  Avoid unnecessary third-party services.
10. Design V1 so future automatic STL estimation can be added without a
    rewrite.

------------------------------------------------------------------------

## 3. High-Level Architecture

``` text
                         Internet
                            |
                            v
                 +----------------------+
                 | Cloudflare / CDN     |
                 | DNS + Edge Security  |
                 +----------+-----------+
                            |
                            v
                 +----------------------+
                 | Next.js Application  |
                 | Public Website       |
                 +----------+-----------+
                            |
              +-------------+-------------+
              |                           |
              v                           v
       Public content               Quote workflow
       Product pages                Authenticated APIs
       SEO pages                    Server actions/API
                                        |
                                        v
                              +----------------------+
                              | Supabase              |
                              |                       |
                              | PostgreSQL            |
                              | Supabase Auth         |
                              | Private Storage      |
                              +----+------------+-----+
                                   |            |
                                   v            v
                              Application     Customer
                              data            files
```

GitHub is used for source control and CI/deployment integration.

------------------------------------------------------------------------

## 4. Technology Stack

### Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS
-   Accessible reusable UI components
-   React where appropriate

### Backend

-   Next.js server-side functionality for lightweight application
    APIs/actions
-   Supabase PostgreSQL
-   Supabase Auth
-   Supabase Storage

### Hosting

Initial target:

-   GitHub --- source control
-   Cloudflare Pages --- frontend hosting
-   Supabase Free --- database, authentication and private file storage

Do not use ngrok as production hosting.

Do not make production depend on a developer laptop.

------------------------------------------------------------------------

## 5. Application Layers

### Presentation Layer

Responsible for:

-   Navigation
-   Product pages
-   Quote form
-   File selection
-   Validation feedback
-   Admin interface
-   Responsive/mobile UI

Client-side validation improves UX but is never considered a security
boundary.

### Application Layer

Responsible for:

-   Request validation
-   Authentication checks
-   Authorization
-   Quote creation
-   File upload authorization
-   Pricing calculations
-   Admin operations
-   Rate limiting
-   Error handling

### Data Layer

Responsible for:

-   PostgreSQL records
-   Row Level Security
-   Storage policies
-   Referential integrity
-   Audit records

### Storage Layer

Responsible for:

-   STL files
-   PDF files
-   Images
-   Other explicitly approved customer files

Customer files must be stored in private buckets.

------------------------------------------------------------------------

## 6. Public Website Structure

``` text
/
├── /products
├── /products/[slug]
├── /services
├── /applications
├── /request-quote
├── /about
├── /contact
├── /privacy-policy
├── /terms-and-conditions
└── /404
```

The public website should not require database access for content that
can safely be statically generated.

------------------------------------------------------------------------

## 7. Admin Structure

``` text
/admin
├── /login
├── /dashboard
├── /quotes
├── /quotes/[id]
├── /products
├── /products/new
├── /products/[id]/edit
├── /pricing
└── /settings
```

All admin routes must require authentication and authorization.

Frontend route hiding is not sufficient.

Every admin API/server action must independently verify authorization.

------------------------------------------------------------------------

## 8. Quote Workflow

``` text
Customer
   |
   v
Request Quote
   |
   +--> Contact information
   |
   +--> Project requirements
   |
   +--> Quantity/material/etc.
   |
   +--> Files
   |      +--> STL
   |      +--> PDF
   |      +--> JPG/JPEG/PNG/WEBP
   |
   +--> Google Drive link
   |
   v
Server validation
   |
   v
Rate limit check
   |
   v
Create quote
   |
   +--> Store metadata in PostgreSQL
   |
   +--> Store approved files in private Storage
   |
   v
Generate public-safe quote reference
   |
   v
Admin review
   |
   v
Estimate / final quotation
```

------------------------------------------------------------------------

## 9. Quote Status Model

Recommended states:

``` text
NEW
UNDER_REVIEW
QUOTE_SENT
ACCEPTED
REJECTED
COMPLETED
ARCHIVED
```

State transitions should be validated server-side.

Do not allow arbitrary user-supplied status values.

------------------------------------------------------------------------

## 10. Data Model

Recommended core tables:

### products

``` text
id
slug
name
category
short_description
description
technology
build_volume
print_speed
layer_resolution
supported_materials
specifications
applications
images
brochure_path
active
created_at
updated_at
```

### quotes

``` text
id
public_reference
customer_name
company_name
email
phone
location
product_id
quantity
material
color
quality
infill
required_date
requirements
google_drive_url
status
estimated_price
final_price
currency
created_at
updated_at
```

### quote_files

``` text
id
quote_id
storage_path
original_filename
mime_type
extension
size_bytes
created_at
```

### pricing_config

``` text
id
material
material_rate_per_kg
machine_rate_per_hour
electricity_rate
labour_rate
post_processing_rate
minimum_charge
margin_percent
active
updated_at
```

### admin_profiles

``` text
user_id
role
active
created_at
updated_at
```

### audit_logs

``` text
id
admin_user_id
action
resource_type
resource_id
metadata
created_at
```

Never store passwords or authentication secrets in application tables.

------------------------------------------------------------------------

## 11. File Storage Architecture

Use a private Supabase Storage bucket.

Suggested logical structure:

``` text
quotes/
  <quote-id>/
    <random-file-id>.stl
    <random-file-id>.pdf
    <random-file-id>.jpg
```

Do not use customer-controlled filenames as object paths.

Do not make the bucket public.

Admin downloads should use short-lived signed URLs.

------------------------------------------------------------------------

## 12. File Upload Pipeline

``` text
Browser
  |
  v
Client validation
  |
  v
Server authorization
  |
  v
Rate limit
  |
  v
File size validation
  |
  v
Extension validation
  |
  v
MIME/signature validation
  |
  v
Generate server-side object name
  |
  v
Private Storage
  |
  v
Store metadata in quote_files
```

Rejected files must not be retained.

------------------------------------------------------------------------

## 13. Google Drive Integration

V1 should accept a Google Drive URL without automatically fetching its
contents.

Store the URL in the quote record.

Validate that the URL belongs to an approved Google domain.

Do not create an unrestricted server-side URL fetcher.

If automatic Drive retrieval is implemented later, it must include:

-   strict domain validation
-   redirect validation
-   SSRF protection
-   appropriate Google OAuth
-   authorization
-   scoped permissions

------------------------------------------------------------------------

## 14. Pricing Architecture

V1 should support manual quotation.

The pricing module should be designed for future automatic estimation.

Future pipeline:

``` text
STL
 |
 v
Geometry parser
 |
 +--> Volume
 +--> Bounding box
 +--> Dimensions
 |
 v
Print parameter selection
 |
 v
Material consumption estimate
 |
 v
Print-time estimate
 |
 v
Machine cost
 |
 v
Electricity
 |
 v
Labour
 |
 v
Post-processing
 |
 v
Margin
 |
 v
Indicative price
```

The final price must remain subject to business review unless the
company explicitly approves fully automated quoting.

------------------------------------------------------------------------

## 15. Pricing Formula

Conceptual model:

``` text
Material Cost
+ Machine Cost
+ Electricity
+ Labour
+ Post Processing
+ Packaging
+ Other Charges
= Base Cost

Base Cost + Margin
= Indicative Selling Price
```

Pricing configuration belongs on the server.

The browser must not be able to set the authoritative final price.

------------------------------------------------------------------------

## 16. Authentication

Use Supabase Auth for admin authentication.

Authentication and authorization are separate:

``` text
Authentication
    |
    v
Who is this user?

Authorization
    |
    v
What is this user allowed to do?
```

A valid login does not automatically grant admin privileges.

------------------------------------------------------------------------

## 17. Authorization

Recommended roles:

``` text
ADMIN
STAFF
```

Start with the smallest role set required.

Examples:

-   ADMIN: full management
-   STAFF: quote review and permitted operations

Authorization must be enforced:

-   At route/server boundary
-   At API/server action
-   At database RLS
-   At storage policies

------------------------------------------------------------------------

## 18. Deployment Architecture

``` text
Developer
   |
   v
Git
   |
   v
GitHub
   |
   v
Cloudflare Pages
   |
   v
Production Website

Production Website
        |
        v
     Supabase
     /       \
Database    Storage
```

Secrets must be configured through the hosting/platform secret
mechanism.

Do not commit `.env` files containing secrets.

------------------------------------------------------------------------

## 19. Environment Separation

Use:

``` text
.env.example
.env.local
```

`.env.example` contains placeholders only.

Example:

``` text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service-role key must never be exposed to client-side code.

------------------------------------------------------------------------

## 20. Performance Architecture

-   Static rendering for public pages where possible
-   Incremental/static generation for product pages where useful
-   Responsive images
-   WebP/AVIF where appropriate
-   Lazy loading
-   Lazy-load 3D viewers
-   Avoid loading Three.js globally
-   Avoid unnecessary client components
-   Minimize third-party scripts

Customer upload files must never be loaded into the public website
unnecessarily.

------------------------------------------------------------------------

## 21. SEO Architecture

Implement:

-   Metadata per page
-   Canonical URLs
-   Sitemap
-   Robots.txt
-   Open Graph metadata
-   Semantic HTML
-   Structured data where appropriate

Product pages should have unique metadata.

Do not keyword-stuff pages.

------------------------------------------------------------------------

## 22. Accessibility Architecture

Target WCAG-conscious implementation.

Required:

-   Semantic HTML
-   Keyboard navigation
-   Visible focus states
-   Labels
-   Error messages
-   Accessible forms
-   Alt text
-   Contrast
-   Reduced-motion support
-   Accessible dialogs/modals

------------------------------------------------------------------------

## 23. Mobile Architecture

The site must be mobile-first.

Test at minimum:

``` text
320px
375px
390px
430px
768px
1024px
1280px+
```

Check for:

-   Horizontal overflow
-   Broken navigation
-   Form usability
-   Upload usability
-   Table overflow
-   Button size
-   Text wrapping
-   3D viewer usability

------------------------------------------------------------------------

## 24. Testing Strategy

### Unit Tests

Test:

-   Pricing calculations
-   Validation functions
-   File validation
-   URL validation
-   Status transitions

### Integration Tests

Test:

-   Quote creation
-   File upload
-   Database policies
-   Authentication
-   Admin authorization

### End-to-End Tests

Test:

-   Customer quote submission
-   Valid/invalid upload
-   Admin login
-   Unauthorized admin access
-   Quote review
-   Quote status update
-   Mobile quote flow

### Production Build

Before release:

``` text
npm run lint
npm run typecheck
npm test
npm run build
```

Use the project's actual scripts if names differ.

------------------------------------------------------------------------

## 25. Future Extensions

The architecture should permit:

-   Automatic STL estimation
-   Customer accounts
-   Quote acceptance
-   Online payments
-   Order tracking
-   Email notifications
-   WhatsApp notifications
-   Product management
-   Blog
-   Analytics
-   CRM integration
-   Customer dashboard

These should be added only when business requirements justify them.

------------------------------------------------------------------------

## 26. Non-Goals for V1

Do not add unnecessarily:

-   Full e-commerce
-   Payment gateway
-   Customer accounts
-   Complex CRM
-   Automatic STL pricing
-   Real-time chat
-   Large analytics stack
-   Unnecessary microservices

The first release should solve the client's actual business need
cleanly.

------------------------------------------------------------------------

## 27. Definition of Done

The application is ready for client review only when:

-   Public pages work
-   Quote flow works
-   File uploads work securely
-   Google Drive links work
-   Admin authentication works
-   Admin authorization works
-   RLS is enabled
-   Storage is private
-   Rate limiting is active
-   CSP is configured
-   Security headers are configured
-   No secrets are committed
-   Mobile layouts are tested
-   Invalid files are rejected
-   No fake business claims exist
-   Terms and Privacy pages exist
-   Favicon and metadata exist
-   Production build passes
-   Critical flows are tested
