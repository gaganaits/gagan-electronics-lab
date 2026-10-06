# Gagan Electronics Lab --- UI/UX Design Specification

**Project:** Gagan Electronics Lab\
**Document:** UI/UX & Visual Design Specification\
**Version:** 1.0\
**Status:** Design Baseline

------------------------------------------------------------------------

## 1. Design Direction

The Gagan Electronics Lab website should combine:

> **Digital Minimalism + Precision Engineering + Warm Human Craft**

The visual identity should feel:

-   Premium
-   Modern
-   Calm
-   Technical
-   Tactile
-   Trustworthy
-   Human
-   Engineering-focused

The site should NOT look like a generic industrial website or a generic
SaaS landing page.

The visual inspiration comes from the client's preferred "Softly"
aesthetic:

-   Warm off-white backgrounds
-   Desaturated pastel accents
-   Large rounded surfaces
-   Soft depth
-   Grain/noise texture
-   Gentle motion
-   Spacious layouts
-   Editorial typography
-   Tactile cards
-   Strong but restrained CTAs

The aesthetic must be adapted to the actual 3D-printing business.

------------------------------------------------------------------------

## 2. Core Design Principle

The website should communicate:

> **"Professional 3D printing made approachable."**

The interface should make a technically complex service feel easy for a
customer.

A customer should understand within seconds:

1.  What Gagan Electronics Lab does
2.  What they can print
3.  Who they serve
4.  How to request a quote
5.  What files they can submit

------------------------------------------------------------------------

## 3. Brand Personality

The interface should feel:

### Precise

Use structured specifications, dimensions, materials and technical
information.

### Approachable

Avoid overly corporate industrial jargon.

### Creative

Use product photography, 3D visuals and subtle editorial composition.

### Reliable

Present actual capabilities clearly.

### Human

Show real company/product imagery and genuine customer information when
supplied.

------------------------------------------------------------------------

## 4. Important Content Rule

Never manufacture business claims to make the design look complete.

Do NOT invent:

-   Customer counts
-   Years of experience
-   Accuracy percentages
-   Production capacity
-   Certifications
-   Awards
-   Testimonials
-   Customer logos
-   "Trusted by 500+ companies"
-   "99.9% success rate"
-   "Industry-leading"
-   Other unverifiable claims

Use actual information supplied by Gagan Electronics Lab.

If information is unavailable, design the component so it can be
populated later.

------------------------------------------------------------------------

## 5. Visual System

### Primary Background

`#FDFCF8`

Warm off-white. This is the primary page background.

### Primary Text

`#292524`

Soft stone-black for headlines, navigation, product names, buttons and
important labels.

### Muted Text

`#78716C`

For supporting descriptions, metadata and secondary information.

### Sage

`#E8EFE8`

For application cards, secondary product sections and technical
information backgrounds.

### Lavender

`#EFEDF4`

Use sparingly for supporting sections and category differentiation.

### Coral Accent

`#FFB7B2`

Primary visual accent for primary CTAs, highlights, quote actions and
active states.

Do not flood the interface with coral.

Use a restrained stone-neutral scale for borders, dividers, placeholders
and disabled states.

------------------------------------------------------------------------

## 6. Typography

### Primary Font

**Outfit**

Use for:

-   Navigation
-   Body
-   Product names
-   Headings
-   Buttons
-   Specifications

### Accent Font

**Reenie Beanie**

Use only for occasional expressive accents.

Do NOT use it for technical specifications, navigation, product names,
forms, pricing or important information.

It should provide a small handwritten human touch rather than function
as the primary typeface.

------------------------------------------------------------------------

## 7. Typography Scale

### Hero

Desktop: `64–96px`

Mobile: `44–60px`

Use tight tracking:

`letter-spacing: -0.025em`

### Section Heading

Desktop: `48–64px`

Mobile: `36–44px`

### Product Heading

`28–40px`

### Body

`16–18px`

### Small Metadata

`13–14px`

Avoid extremely small text.

------------------------------------------------------------------------

## 8. Sentence Case

Use sentence case throughout the interface.

Prefer:

> Request a quote

instead of:

> REQUEST A QUOTE

Prefer:

> Explore our printers

instead of:

> EXPLORE OUR PRINTERS

Avoid excessive uppercase typography.

------------------------------------------------------------------------

## 9. Grain / Texture

Use a subtle global grain overlay.

Concept:

``` css
position: fixed;
inset: 0;
pointer-events: none;
z-index: 50;
opacity: 0.15–0.25;
mix-blend-mode: overlay;
```

Use SVG `feTurbulence` or an optimized equivalent.

The grain must:

-   Not interfere with readability
-   Not increase page weight significantly
-   Not interfere with interactions
-   Not create excessive visual noise
-   Respect reduced-motion/accessibility requirements

The inspiration uses 0.35 opacity, but start lower and tune visually for
the business site.

------------------------------------------------------------------------

## 10. Background Visual Language

Use soft blurred pastel shapes:

-   Coral
-   Sage
-   Lavender

Apply:

-   Large blur radius
-   Low opacity
-   Slow movement

Do not use:

-   Neon gradients
-   Purple-blue SaaS gradients
-   Excessive glowing effects
-   Large animated blobs dominating the page

Background visuals should support content rather than become the
content.

------------------------------------------------------------------------

## 11. Border Radius

Recommended:

``` text
Small card: 16px
Medium card: 24px
Large section: 32px
Hero/product surfaces: 32–48px
Buttons: 9999px
```

Do not make every tiny UI element extremely rounded.

Technical tables and dense controls may use smaller radii.

------------------------------------------------------------------------

## 12. Shadows

Use extremely soft shadows:

``` text
0 4px 20px -2px rgba(0,0,0,0.05)
```

Avoid heavy drop shadows, neon shadows, strong black shadows and
excessive elevation.

------------------------------------------------------------------------

## 13. Navigation

Use a floating pill navigation.

### Desktop

A centered/max-width container containing:

-   Small logo mark
-   Gagan Electronics Lab
-   Products
-   Services
-   About
-   Contact
-   Request a quote CTA

Characteristics:

-   Off-white/white translucent surface
-   Backdrop blur
-   Large radius
-   Subtle border
-   Compact navigation
-   Coral accent where appropriate
-   Dark CTA

### Mobile

Use:

``` text
┌────────────────────────────┐
│ ● Gagan              ☰     │
└────────────────────────────┘
```

The menu should open as a clean mobile panel.

Do not overcrowd the mobile header.

------------------------------------------------------------------------

## 14. Hero Section

The hero must immediately explain the business.

Do NOT use vague marketing copy.

Avoid:

> "Where imagination becomes reality."

Prefer specific messaging such as:

> **3D printing for prototypes, parts and projects.**

Only use wording that accurately reflects the client's actual services.

Supporting text should explain:

-   What customers can submit
-   What Gagan Electronics Lab does
-   How quotation works

Example direction:

> Upload your STL, PDF or project files and tell us what you need. We'll
> review the requirements and provide a quotation.

### Hero CTAs

Primary:

> Request a quote

Secondary:

> Explore our services

Primary CTA uses Coral. Secondary CTA uses a neutral/light surface.

------------------------------------------------------------------------

## 15. Hero Visual

Use a real product/printer visual if the client provides one.

Preferred:

-   High-quality 3D printer image
-   Real product photograph
-   Carefully prepared 3D render
-   Approved product model

Avoid generic stock imagery where possible.

The hero visual may use:

-   Soft pastel background
-   Rounded image container
-   Subtle floating effect
-   Grain texture

------------------------------------------------------------------------

## 16. Quick Quote Entry

Immediately below or integrated into the hero:

> Have a 3D model ready?

**Upload your file**

Supported:

``` text
STL
PDF
JPG
PNG
```

Also:

> Or share a Google Drive link

This creates a direct connection between the visual website and the
primary business function.

------------------------------------------------------------------------

## 17. How It Works

Use a calm process layout:

``` text
01
Share your design

↓

02
Tell us your requirements

↓

03
We review the project

↓

04
Receive your quotation

↓

05
We print your part
```

Use large numbers and minimal supporting text.

On mobile, stack vertically.

------------------------------------------------------------------------

## 18. Product / Service Section

Section direction:

> **What we can help you print**

Use large horizontal cards.

Each card:

-   Product/service name
-   Short description
-   Image
-   Key capability
-   Explore button

Example categories only if actually offered:

-   Prototyping
-   Custom parts
-   Functional components
-   Models
-   Educational projects
-   Product development

Do not display unsupported services.

------------------------------------------------------------------------

## 19. Product Cards

Cards should feel tactile rather than like generic e-commerce cards.

Structure:

``` text
┌─────────────────────────────┐
│                             │
│       Product Image         │
│                             │
├─────────────────────────────┤
│ Industrial 3D Printer       │
│ Short description...        │
│                             │
│ Technology    Build volume  │
│                             │
│ Explore →                   │
└─────────────────────────────┘
```

Use:

-   White surface
-   24--32px radius
-   Soft shadow
-   Minimal border
-   Generous padding

------------------------------------------------------------------------

## 20. Product Detail Page

Structure:

``` text
Product

[Large product visual]

Product name
Short description

[Request a quote]

Specifications
────────────────────

Technology
Build volume
Layer resolution
Print speed
Materials
Connectivity
Other verified specifications

Applications

What's included

Downloads

[Request a quote]
```

The specification section should feel technical and trustworthy.

Never invent missing specifications.

------------------------------------------------------------------------

## 21. Technical Specification Design

Avoid giant dense tables on mobile.

Desktop:

``` text
Technology           FDM
Build volume         220 × 220 × 250 mm
Layer resolution     ...
Materials            ...
Print speed          ...
```

Mobile:

Use stacked specification rows.

Technical values must remain easy to scan.

------------------------------------------------------------------------

## 22. Applications Section

Use pastel cards inspired by the original scenario-scroll concept.

Example:

``` text
Prototype
Build and test product ideas quickly.

Custom part
Create replacement or purpose-built components.

Education
Build physical models for learning and projects.
```

Only show categories applicable to the client's actual services.

------------------------------------------------------------------------

## 23. Horizontal Scroll

Use horizontal scrolling on mobile where it improves browsing.

Cards approximately:

`280–320px`

Do not force horizontal scrolling for essential information.

Provide visible indication that more cards exist.

Ensure keyboard and screen-reader accessibility.

------------------------------------------------------------------------

## 24. 3D Product Experience

If the client provides usable 3D models:

Use:

-   Three.js
-   React Three Fiber
-   GLB/GLTF

The 3D viewer is an enhancement, not a requirement.

Structure:

``` text
Product image
      ↓
Optional 3D viewer
      ↓
Specifications
```

Provide a fallback static image.

Lazy-load the 3D viewer.

Do not load Three.js globally.

------------------------------------------------------------------------

## 25. Quote Experience

The quotation flow is the most important interactive component.

Create:

``` text
/request-quote
```

The page should feel like a guided form rather than a traditional long
business form.

------------------------------------------------------------------------

## 26. Quote Form Design

### Step 1 --- Your project

-   What do you need?
-   Product/service
-   Quantity
-   Material
-   Color
-   Quality
-   Infill where applicable
-   Required date

### Step 2 --- Your files

Allow:

-   STL
-   PDF
-   JPG
-   JPEG
-   PNG
-   WEBP

Also:

> Prefer Google Drive?

\[ Paste Google Drive link \]

### Step 3 --- Your details

-   Name
-   Company
-   Email
-   Phone
-   Location

### Step 4 --- Review

Show:

``` text
Project
Files
Quantity
Material
Requirements
Contact details
```

Then:

> Submit quote request

------------------------------------------------------------------------

## 27. File Upload UI

Use a drag-and-drop surface:

``` text
┌────────────────────────────────────┐
│                                    │
│       Drop your files here         │
│                                    │
│       or choose files              │
│                                    │
│       STL · PDF · JPG · PNG        │
│                                    │
└────────────────────────────────────┘
```

Use a soft Sage or Lavender background.

On mobile:

-   Large touch target
-   Clear "Choose files" button
-   Show selected files below

------------------------------------------------------------------------

## 28. Upload Progress

For each file show:

``` text
model.stl
12.4 MB

Uploading...
██████████████░░░

✓ Uploaded
```

Provide:

-   Remove
-   Retry
-   Error state

Never show internal storage paths.

------------------------------------------------------------------------

## 29. File Validation UX

Invalid file:

> This file type isn't supported. Please upload an STL, PDF, JPG or PNG
> file.

Too large:

> This file is larger than the 50 MB limit.

Never expose server stack traces or technical storage errors.

------------------------------------------------------------------------

## 30. Google Drive UI

Provide an alternative card:

``` text
Prefer to share from Google Drive?

Paste your Google Drive link

[________________________]

We'll access the file when reviewing your request.
```

Explain that the customer must ensure the file has appropriate sharing
permissions.

------------------------------------------------------------------------

## 31. Quote Confirmation

After successful submission:

> **Your quote request is in.**

> We've received your project details and files.

Show:

``` text
Reference
QT-2026-00123
```

Then:

> Keep this reference for future communication.

Do not expose internal database IDs.

------------------------------------------------------------------------

## 32. Cost Estimate UI

If automatic estimation is eventually implemented, show it as an
estimate.

Example:

``` text
Estimated printing cost

₹850 – ₹1,100

Based on:
PLA
20% infill
Standard quality
Estimated print time

Final pricing may change after project review.
```

Never present an automated calculation as a guaranteed final price.

------------------------------------------------------------------------

## 33. Admin Dashboard

The public website can remain soft and editorial.

The admin panel should be more functional.

Use the same:

-   Typography
-   Color palette
-   Radius
-   Spacing

But reduce decorative effects.

Admin priorities:

-   Readability
-   Data density
-   Clear actions
-   Status visibility
-   File access
-   Pricing

------------------------------------------------------------------------

## 34. Admin Quote Card

Example:

``` text
QT-2026-00123

ABC Engineering
Prototype component

2 × PLA

3 files

New
₹ —

Submitted 06 Oct 2026

[Review]
```

Statuses should use subtle semantic colors.

Avoid excessive colored badges.

------------------------------------------------------------------------

## 35. Quote Detail

Admin should see:

``` text
Customer
Project
Requirements
Files
Google Drive link
Pricing
Status
Timeline
Audit history
```

Actions:

-   Review files
-   Calculate estimate
-   Add quotation
-   Change status

------------------------------------------------------------------------

## 36. Pricing Interface

Admin pricing configuration:

``` text
Materials

PLA             ₹ / kg
PETG            ₹ / kg
ABS             ₹ / kg

Machine rates

Printer A       ₹ / hour
Printer B       ₹ / hour

Labour

₹ / hour

Margin

____ %
```

Only authorized administrators can modify these values.

------------------------------------------------------------------------

## 37. Testimonials

Only display testimonials supplied by the client.

Example:

``` text
"I've used Gagan Electronics Lab for..."
                              — Customer Name
```

The handwritten accent can be used for the signature.

Never fabricate testimonials.

------------------------------------------------------------------------

## 38. Trust Section

Do not use fake metrics.

Instead use factual trust signals:

-   Actual materials
-   Actual technologies
-   Actual machine models
-   Actual certifications
-   Actual service area
-   Actual support channels

Only display information verified by the client.

------------------------------------------------------------------------

## 39. Conversion Section

Near the end:

``` text
Have a part you need printed?

Upload your design and tell us what you're building.

[ Request a quote ]
```

Use a warm pastel background.

Do not use generic marketing slogans.

------------------------------------------------------------------------

## 40. FAQ

Use an accessible accordion.

Possible questions, only where relevant:

-   What file types can I submit?
-   Can I send an STL file?
-   Can I send a Google Drive link?
-   What materials are available?
-   How is pricing calculated?
-   Can you print custom parts?
-   How long does printing take?
-   Do you provide post-processing?
-   Can I request multiple quantities?

Do not answer questions with unverified information.

------------------------------------------------------------------------

## 41. Footer

Include:

``` text
Gagan Electronics Lab

3D printing / services / products

Products
Services
Applications
Request a quote
About
Contact

Privacy Policy
Terms & Conditions

Contact information

© Gagan Electronics Lab
```

Only show contact information supplied by the client.

------------------------------------------------------------------------

## 42. Privacy & Terms Pages

Create:

``` text
/privacy-policy
/terms-and-conditions
```

Use the same visual design system but prioritize readability over
decoration.

Do not bury legal text inside a modal.

------------------------------------------------------------------------

## 43. Motion Design

Animations should feel slow and intentional.

Preferred reveal:

``` text
translateY(20–30px)
opacity 0 → 1
duration ≈ 0.7–0.8s
```

Background blobs:

``` text
6–10 second
very low-amplitude movement
```

Product cards:

-   Subtle hover lift
-   Image scale around 1.02--1.04
-   No dramatic effects

Buttons:

-   Subtle scale
-   Subtle shadow
-   Approximately 150--250ms

------------------------------------------------------------------------

## 44. Reduced Motion

Respect:

``` text
prefers-reduced-motion
```

When enabled:

-   Disable background floating animations
-   Disable unnecessary transforms
-   Reduce reveal animation
-   Keep content immediately accessible

------------------------------------------------------------------------

## 45. Mobile-First Layout

Design specifically for:

``` text
320px
375px
390px
430px
```

Mobile priorities:

1.  What the company does
2.  Request quote
3.  Products/services
4.  File upload
5.  Contact

Avoid excessive text before the first CTA.

------------------------------------------------------------------------

## 46. Desktop Composition

Desktop can use more editorial composition:

``` text
          Hero text
              \
               \
            Product
             visual

Products → horizontal cards

Applications → asymmetric grid

Process → large numbered steps

Quote → centered conversion panel
```

Maintain generous whitespace.

------------------------------------------------------------------------

## 47. Responsive Product Gallery

Desktop:

-   Large primary image
-   Smaller supporting images

Mobile:

-   Swipeable image gallery

Images must remain sharp and optimized.

------------------------------------------------------------------------

## 48. Accessibility

Design must maintain:

-   WCAG-conscious contrast
-   Keyboard navigation
-   Visible focus
-   Accessible labels
-   Semantic buttons
-   Accessible accordions
-   Screen-reader-friendly forms
-   Proper alt text
-   Reduced-motion support

Do not sacrifice accessibility for visual aesthetics.

------------------------------------------------------------------------

## 49. Performance

The aesthetic must not make the website slow.

Optimize:

-   Grain texture
-   Background effects
-   Images
-   Fonts
-   3D assets
-   JavaScript
-   Animations

Do not use a huge full-screen video simply because it looks impressive.

Do not load 3D assets until needed.

Do not load unnecessary font weights.

------------------------------------------------------------------------

## 50. Design System Components

Create reusable components:

``` text
Navbar
Hero
Button
PillButton
SectionHeading
ProductCard
ProductGrid
ProductGallery
SpecificationList
ApplicationCard
ProcessStep
QuoteUpload
FileCard
QuoteForm
QuoteConfirmation
FAQAccordion
TestimonialCard
CTASection
Footer
GrainOverlay
BackgroundBlob
```

Do not duplicate components across pages.

------------------------------------------------------------------------

## 51. Component Rules

Components should:

-   Have clear responsibilities
-   Accept typed props
-   Avoid hard-coded business data
-   Be reusable
-   Be accessible
-   Be responsive

Business data should live separately from presentation.

------------------------------------------------------------------------

## 52. Content/Data Separation

Product information should not be scattered throughout JSX.

Use structured data:

``` text
data/
  products.ts
  services.ts
  applications.ts
  faqs.ts
```

When Supabase becomes the source of product data, UI components should
not need major changes.

------------------------------------------------------------------------

## 53. Visual Hierarchy

Every section should answer one question.

Hero:

> What does Gagan Electronics Lab do?

Products:

> What can I get?

Applications:

> Is this suitable for my use case?

Process:

> How does it work?

Quote:

> How do I get a price?

Trust:

> Why should I contact them?

------------------------------------------------------------------------

## 54. What NOT to Do

Do not:

-   Use purple gradients
-   Use generic AI copy
-   Use fake statistics
-   Use fake testimonials
-   Use fake logos
-   Use fake certifications
-   Use excessive glassmorphism
-   Use excessive animations
-   Use giant text with no information
-   Hide important information behind animations
-   Make the quote form unnecessarily long
-   Make file upload confusing
-   Make the mobile interface an afterthought
-   Use stock photos if real client imagery is available
-   Add unnecessary 3D effects
-   Sacrifice performance for visual effects

------------------------------------------------------------------------

## 55. Final Visual Goal

The finished site should feel like:

``` text
                Gagan Electronics Lab

     Warm editorial design
              +
       Engineering precision
              +
        3D product visuals
              +
        Simple quote flow
              +
       Technical credibility
```

The visual impression should be:

> **A modern 3D-printing studio with serious technical capability,
> presented with the warmth and polish of a premium digital product.**

The design should feel distinctive without becoming distracting.

------------------------------------------------------------------------

## 56. Design Acceptance Criteria

-   [ ] Client's Softly-inspired aesthetic is recognizable
-   [ ] Gagan Electronics Lab branding is prominent
-   [ ] No purple SaaS gradient aesthetic
-   [ ] No fake metrics
-   [ ] No fake testimonials
-   [ ] No vague hero copy
-   [ ] Hero immediately explains the business
-   [ ] Request Quote is obvious
-   [ ] STL/PDF/image upload is easy to discover
-   [ ] Google Drive submission is supported
-   [ ] Product catalogue is visually strong
-   [ ] Product specifications are easy to scan
-   [ ] Quote flow feels simple
-   [ ] Admin interface is functional
-   [ ] Mobile layouts work cleanly
-   [ ] Grain texture remains subtle
-   [ ] Animations are slow and restrained
-   [ ] Reduced-motion support exists
-   [ ] Accessibility is maintained
-   [ ] Performance is not compromised by visual effects
-   [ ] Privacy Policy exists
-   [ ] Terms & Conditions exists
-   [ ] Favicon exists
-   [ ] SEO metadata exists
-   [ ] All business claims are verified
-   [ ] Real client imagery is used where available
