# Case Intake Form - Component Documentation

## Overview
The Case Intake Form is a streamlined, modular base information intake form built with shadcn/ui components. This form collects essential applicant information before transitioning to detailed case management in the main application.

The original monolithic component has been refactored into:

- **10 Component Files** (UI + Sections)
- **3 Custom Hooks** (State management & utilities)
- **1 Types File** (TypeScript interfaces)

## Directory Structure

```
/workspaces/CMSWorkbench/
├── components/
│   ├── ui/                          # shadcn/ui base components
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── select.tsx
│   └── case-intake/                 # Custom form components
│       ├── index.ts                 # Barrel exports
│       ├── CaseIntakeForm.tsx       # Main form container
│       ├── FormField.tsx            # Text input wrapper
│       ├── FormSelect.tsx           # Select dropdown wrapper
│       ├── FormCheckbox.tsx         # Checkbox wrapper
│       ├── DynamicList.tsx          # Generic list component
│       ├── ApplicantBasicsSection.tsx
│       ├── ContactSection.tsx
│       ├── RelationshipsSection.tsx
│       ├── SystemVerificationSection.tsx
│       └── SubmissionSection.tsx
├── hooks/
│   ├── useCaseIntakeForm.ts        # Form state management
│   ├── usePhoneFormatter.ts        # Phone number formatting
│   └── useDateFormatter.ts         # Date formatting (MM/DD/YYYY)
└── types/
    └── case-intake.ts              # TypeScript types & interfaces
```

## Component Breakdown

### 1. Base UI Components

#### `FormField.tsx`
Wraps shadcn/ui `Input` and `Label` with consistent styling.
```tsx
<FormField
  label="Applicant Name"
  id="applicantName"
  value={value}
  onChange={setValue}
  placeholder="Full name"
  required
/>
```

#### `FormSelect.tsx`
Wraps shadcn/ui `Select` components with label.
```tsx
<FormSelect
  label="Applicant Status"
  id="status"
  value={value}
  onChange={setValue}
  options={[
    { value: 'individual', label: 'Individual' },
    { value: 'married', label: 'Married' }
  ]}
/>
```

#### `FormCheckbox.tsx`
Wraps shadcn/ui `Checkbox` with label.
```tsx
<FormCheckbox
  label="U.S. Citizen"
  id="citizenship"
  checked={isChecked}
  onChange={setChecked}
/>
```

#### `DynamicList.tsx`
Generic component for managing dynamic arrays (relationships, income, expenses, resources).
```tsx
<DynamicList
  items={relationships}
  onAdd={addRelationship}
  onRemove={removeRelationship}
  addButtonText="Add Relationship"
  renderItem={(rel, idx) => <RelationshipFields {...rel} />}
/>
```

### 2. Section Components

Each section handles a specific part of the form:

- **ApplicantBasicsSection** - Name, status, citizenship, disability, voter registration
- **ContactSection** - Address, phone, email (with phone formatting)
- **RelationshipsSection** - Dynamic list of relationships
- **SystemVerificationSection** - Document review checkboxes
- **SubmissionSection** - AVS consent date, final actions (AVS submitted, VR needed/sent), mandatory narrative with auto-calculated dates, known institutions, case assignment

#### Special Feature: Mandatory Narrative
The SubmissionSection includes an auto-generated narrative template that:
- Displays the AVS consent date entered by the user
- Auto-calculates submit date (today), 5-day date, and 11-day date
- Includes known institutions field
- Provides a "Copy" button to copy the formatted narrative to clipboard
- Updates in real-time as the user enters information

All sections follow the same pattern:
```tsx
interface SectionProps {
  formData: CaseIntakeFormData;
  onUpdate: (updates: Partial<CaseIntakeFormData>) => void;
  // Optional: additional props like nameOptions
}
```

### 3. Main Form Component

**`CaseIntakeForm.tsx`**
- Uses shadcn/ui `Accordion` for collapsible sections
- Manages overall form state via `useCaseIntakeForm` hook
- Delegates rendering to section components
- All sections expanded by default

### 4. Custom Hooks

#### `useCaseIntakeForm.ts`
Manages form state and provides helper functions:
```tsx
const { formData, setFormData, getNameOptions } = useCaseIntakeForm();
```

#### `usePhoneFormatter.ts`
Formats phone numbers to (XXX) XXX-XXXX format:
```tsx
const { formatPhoneNumber } = usePhoneFormatter();
const formatted = formatPhoneNumber('1234567890'); // "(123) 456-7890"
```

#### `useDateFormatter.ts`
Formats dates to MM/DD/YYYY format:
```tsx
const { formatDate } = useDateFormatter();
const formatted = formatDate('11122025'); // "11/12/2025"
```

### 5. TypeScript Types

**`types/case-intake.ts`** defines:
- `CaseIntakeFormData` - Main form data interface
- `Relationship`, `Income`, `Expense`, `Resource` - Nested data structures
- `ApplicantStatus`, `VoterRegistration`, `Frequency` - Union types
- `initialFormData` - Default form state

## Key Features

### ✅ Type Safety
- Full TypeScript support throughout
- No implicit `any` types
- Proper interface definitions for all props

### ✅ Reusability
- Generic `DynamicList` component works for any array type
- Base form components can be used in other forms
- Section components are independently testable

### ✅ shadcn/ui Integration
- Uses Accordion for section organization
- Cards for list items
- Consistent design system
- Accessible by default (Radix UI primitives)

### ✅ Clean Code
- Single Responsibility Principle
- Props drilling minimized
- Logic separated into hooks
- Easy to maintain and extend

## Usage in Main Project

This is a **base intake form** designed to collect initial applicant information. Financial details (income, expenses, resources) are handled in the main case details window of your CMSNext application.

To use this form in your CMSNext project:

1. **Copy the directories:**
   ```bash
   cp -r components/case-intake /path/to/CMSNext/components/
   cp -r hooks /path/to/CMSNext/
   cp -r types /path/to/CMSNext/
   ```

2. **Ensure shadcn/ui components are installed:**
   ```bash
   npx shadcn@latest add accordion button card checkbox input label select
   ```

3. **Import and use:**
   ```tsx
   import { CaseIntakeForm } from '@/components/case-intake';
   
   export default function IntakePage() {
     return <CaseIntakeForm />;
   }
   ```

## Future Enhancements

Potential improvements:
- Form validation with Zod schema
- Form submission handler
- Data persistence (localStorage/API)
- Export functionality
- Progress indicator
- Auto-save functionality
- Field-level validation feedback
- Integration with React Hook Form
- Connection to main case details workflow

## Testing Checklist

- [x] TypeScript compiles without errors
- [ ] All sections expand/collapse correctly
- [ ] Dynamic lists (add/remove) work properly
- [ ] Phone number formatting functions correctly
- [ ] Name options populate in dropdowns
- [ ] Form state updates correctly
- [ ] Responsive design on mobile devices
- [ ] Keyboard navigation works
- [ ] Screen reader accessibility

## Migration Notes

The original `case_intake_form.tsx` is preserved at the root level. Once testing is complete, it can be safely deleted.

### Changes from Original:
- ✅ Uses shadcn/ui Accordion instead of custom section headers
- ✅ Proper TypeScript typing throughout
- ✅ Modular component architecture
- ✅ Separated concerns (UI, logic, types)
- ✅ Better accessibility with Radix UI primitives
- ✅ Consistent design system
