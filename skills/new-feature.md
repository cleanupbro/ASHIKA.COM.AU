# New Feature Skill
> Build new functionality for the application
> Priority: MEDIUM

---

## TRIGGERS

- "add"
- "create"
- "build"
- "implement"
- "new feature"
- "new page"
- "new component"

---

## PRE-FLIGHT CHECKS

1. [ ] Clearly understand the feature requirements
2. [ ] Identify where in the codebase it belongs
3. [ ] Check for similar existing patterns to follow
4. [ ] Plan the implementation approach

---

## STEPS

### 1. Requirements Gathering
Before coding, answer:
- What does this feature do?
- Who uses it?
- What pages/components are needed?
- Does it need database integration?
- Does it need API integration?

### 2. Plan Structure
```
New Component:
  src/components/[category]/ComponentName.tsx

New Page:
  src/app/[route]/page.tsx

New Utility:
  src/lib/[utility].ts

New Type:
  src/types/[type].ts
```

### 3. Follow Existing Patterns
```bash
# Find similar components to reference
ls -la ephraim-care-app/src/components/

# Check existing page structure
ls -la ephraim-care-app/src/app/
```

### 4. Create Files
Use this template for new components:
```tsx
"use client";

import React from 'react';

interface ComponentNameProps {
  // props here
}

export default function ComponentName({ }: ComponentNameProps) {
  return (
    <div>
      {/* content */}
    </div>
  );
}
```

### 5. Implement Feature
- Start with basic structure
- Add functionality incrementally
- Test after each addition
- Follow TypeScript strictly

### 6. Style with Tailwind
Use existing color scheme:
```
Background: bg-[#e8f5f0] (light mint)
Accent: text-[#2a7d6e] (deep teal)
White sections: bg-white
```

### 7. Build Verification
```bash
cd ~/Desktop/ephraim-care/ephraim-care-app
npm run build
```
Must complete with 0 errors.

### 8. Document Feature
Add to CLIENT_SUMMARY.md if client-facing.
Add to MEMORY.md for internal tracking.

---

## FILE NAMING CONVENTIONS

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ServicesGrid.tsx` |
| Pages | lowercase | `page.tsx` |
| Routes | kebab-case | `about-us/` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `ServiceType.ts` |

---

## IMPORT CONVENTIONS

```tsx
// Use path aliases
import Component from '@/components/ui/Component';
import { utility } from '@/lib/utils';
import { Type } from '@/types/types';

// NOT relative paths
// import Component from '../../../components/ui/Component';
```

---

## RESPONSIVE DESIGN

Always implement mobile-first:
```tsx
<div className="
  p-4 md:p-6 lg:p-8        // Padding
  text-sm md:text-base      // Text size
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  // Grid
">
```

---

## VERIFICATION

- [ ] Feature works as expected
- [ ] Build passes
- [ ] Mobile responsive
- [ ] Follows existing patterns
- [ ] TypeScript types defined
- [ ] NDIS compliant (if text-based)

---

## IF FAILED

1. Check build errors
2. Review TypeScript types
3. Compare with similar existing features
4. Simplify if too complex

---

## SUCCESS MESSAGE

"Feature implemented: [Description]. Build passes. Ready for testing."

---

*For deployment, use deploy.md skill.*
