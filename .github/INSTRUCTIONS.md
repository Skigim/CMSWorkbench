# GitHub Copilot Instructions for CMSWorkbench

## Project Overview
CMSWorkbench is a Next.js 14 application using TypeScript, Tailwind CSS, and shadcn/ui components. This is a development workbench for building CMS-related UI components and features.

## Tech Stack
- **Framework**: Next.js 14.2.32 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React

## Project Structure
```
/workspaces/CMSWorkbench/
├── .github/              # GitHub configurations and instructions
├── app/                  # Next.js app directory
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/           # shadcn/ui components (to be added)
├── lib/                  # Utility functions
│   └── utils.ts         # Helper utilities (cn function)
├── components.json      # shadcn/ui configuration
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Development Guidelines

### Code Style
- Use TypeScript for all files
- Follow Next.js App Router conventions
- Use functional components with hooks
- Prefer named exports for components
- Use `cn()` utility from `lib/utils.ts` for conditional class names

### Component Development
- Place shadcn/ui components in the `components/` directory (auto-generated via CLI)
- Create custom components following shadcn/ui patterns
- Use Tailwind CSS for styling
- Implement responsive design by default
- Ensure accessibility (ARIA attributes, keyboard navigation)

### File Naming Conventions
- Components: PascalCase (e.g., `Button.tsx`, `CaseIntakeForm.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- Pages: lowercase with hyphens for routes (e.g., `page.tsx`, `case-intake/page.tsx`)

### Adding shadcn/ui Components
Use the shadcn/ui CLI to add pre-built components:
```bash
npx shadcn-ui@latest add [component-name]
```

Common components:
- `button`, `card`, `input`, `label`, `form`, `select`, `textarea`
- `dialog`, `dropdown-menu`, `popover`, `tabs`, `accordion`
- `table`, `sheet`, `toast`, `alert`

### Development Commands
```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Common Tasks

### Creating a New Page
1. Create a new folder in `app/` with the route name
2. Add a `page.tsx` file
3. Export default React component

### Creating a Form Component
1. Add shadcn/ui form components: `npx shadcn-ui@latest add form input label button`
2. Use React Hook Form for form state management
3. Implement validation with Zod schema
4. Follow shadcn/ui form patterns

### Styling Guidelines
- Use Tailwind utility classes
- Leverage shadcn/ui design tokens (defined in `globals.css`)
- Use CSS variables for theming (e.g., `hsl(var(--primary))`)
- Keep responsive design in mind (mobile-first approach)

### State Management
- Use React hooks (`useState`, `useEffect`, etc.) for local state
- Consider Context API for shared state
- Implement Server Components where possible (Next.js 14 App Router)

## Key Files to Reference

### `components.json`
Configuration for shadcn/ui CLI. Defines:
- Component installation path
- Tailwind config location
- Style preferences (default, New York, etc.)
- Import aliases

### `lib/utils.ts`
Contains the `cn()` utility function for merging Tailwind classes with `clsx` and `tailwind-merge`.

### `app/globals.css`
Global styles including:
- Tailwind directives
- CSS variables for theming
- Base styles and resets

## Best Practices

### Performance
- Use Next.js Image component for images
- Implement lazy loading for heavy components
- Minimize client-side JavaScript (prefer Server Components)
- Use dynamic imports for code splitting

### Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers

### Type Safety
- Define TypeScript interfaces for props
- Avoid using `any` type
- Use strict TypeScript configuration

### Git Workflow
- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Use conventional commit format when possible

## Current Project Status
- Basic Next.js setup complete
- shadcn/ui configured
- Ready for component development
- Case intake form in progress (`case_intake_form.tsx`)

## Resources
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com)

## Notes for AI Assistants
- Always check existing components before creating new ones
- Follow the established patterns in the codebase
- Suggest shadcn/ui components when applicable
- Ensure TypeScript types are properly defined
- Consider both desktop and mobile experiences
- Prioritize accessibility and performance

## 📦 Integration with CMSNext

This workbench is designed for developing components that will be transferred to the main CMSNext project repository. The components follow identical architectural patterns to ensure seamless integration.

### **Alignment Status:**
✅ shadcn/ui components match versions  
✅ Tailwind CSS v4 configuration identical  
✅ TypeScript strict mode enabled  
✅ Component architecture compatible  

### **Transfer Checklist:**
1. Copy `components/case-intake/` → `../CMSNext/components/case-intake/`
2. Copy custom hooks → `../CMSNext/hooks/`
3. Copy `utils/intakeFormTransformer.ts` → `../CMSNext/utils/`
4. Review and merge type definitions
5. Test transformer with CMSNext DataManager
6. Update navigation to include intake route

### **Data Transformation:**
The `utils/intakeFormTransformer.ts` utility handles mapping between the simplified intake form structure and CMSNext's full Person/CaseRecord schema. 

**Key Transformations:**
- Single `applicantName` field → parsed into `firstName` + `lastName`
- Single-line `address` → structured `Address` object (street, city, state, zip)
- `relationships[]` → mapped to `authorizedRepIds`, `familyMembers`, `spouseId`
- Citizenship/disability → stored in case metadata
- AVS data → stored in case metadata and initial notes

**Detailed Documentation:**  
See `.github/ALIGNMENT_REPORT.md` for comprehensive field mappings and integration strategy.

### **Usage Example:**
```typescript
import { transformIntakeToCase, createIntakeMetadata } from '@/utils/intakeFormTransformer';

// Transform intake form data
const caseData = transformIntakeToCase(formData);
const metadata = createIntakeMetadata(formData);

// Send to CMSNext DataManager
const createdCase = await dataManager.createCompleteCase(caseData);

// Store metadata as note
await dataManager.addNote(createdCase.id, {
  category: 'Intake',
  content: JSON.stringify(metadata, null, 2)
});
```
