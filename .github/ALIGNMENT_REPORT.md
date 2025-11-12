# CMSWorkbench → CMSNext Alignment Report

**Generated:** November 12, 2025  
**Purpose:** Document compatibility between intake form components and main CMSNext application

---

## ✅ Component Architecture Alignment

### **shadcn/ui Components**
Both projects use the same component library with consistent patterns:

| Component | CMSWorkbench | CMSNext | Status |
|-----------|-------------|---------|--------|
| Button | ✅ Installed | ✅ Used extensively | ✅ Compatible |
| Input | ✅ Installed | ✅ Used in forms | ✅ Compatible |
| Label | ✅ Installed | ✅ Used in forms | ✅ Compatible |
| Select | ✅ Installed | ✅ Used in forms | ✅ Compatible |
| Checkbox | ✅ Installed | ✅ Used in forms | ✅ Compatible |
| Card | ✅ Installed | ✅ Used in layouts | ✅ Compatible |
| Accordion | ✅ Installed | ⚠️ Not heavily used | ✅ Compatible |

**Verdict:** ✅ All UI components are compatible.

---

## 📋 Type Definitions Alignment

### **Person Interface Comparison**

**CMSWorkbench (`types/case-intake.ts`):**
```typescript
interface ApplicantInfo {
  firstName: string;
  lastName: string;
  citizenship: CitizenshipInfo;
  disability: DisabilityInfo;
  voterRegistered: boolean;
  applicationSigned: boolean;
}
```

**CMSNext (`types/case.ts`):**
```typescript
interface Person {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  organizationId: string | null;
  livingArrangement: string;
  address: Address;
  mailingAddress: MailingAddress;
  authorizedRepIds: string[];
  familyMembers: string[];
  status: string;
  createdAt: string;
  dateAdded: string;
}
```

### **Contact Information**

**CMSWorkbench:**
```typescript
interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}
```

**CMSNext:**
```typescript
interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface MailingAddress extends Address {
  sameAsPhysical: boolean;
}
```

### ⚠️ **Field Mapping Required:**

| CMSWorkbench Field | CMSNext Field | Action Needed |
|-------------------|---------------|---------------|
| `applicant.firstName` | `person.firstName` | ✅ Direct map |
| `applicant.lastName` | `person.lastName` | ✅ Direct map |
| `contact.phone` | `person.phone` | ✅ Direct map |
| `contact.email` | `person.email` | ✅ Direct map |
| `contact.address` (string) | `person.address` (object) | ⚠️ **Parse required** |
| `citizenship` | ❌ Not in Person | ⚠️ **Add to metadata** |
| `disability` | ❌ Not in Person | ⚠️ **Add to metadata** |
| `voterRegistered` | ❌ Not in Person | ⚠️ **Add to metadata** |
| `applicationSigned` | ❌ Not in Person | ⚠️ **Add to metadata** |

---

## 🔧 Required Changes for Integration

### **1. Update Type Definitions**

We need to extend CMSNext's `Person` interface OR use a metadata field:

**Option A: Extend Person Interface (requires CMSNext changes)**
```typescript
interface Person {
  // ... existing fields
  citizenship?: CitizenshipInfo;
  disability?: DisabilityInfo;
  voterRegistered?: boolean;
  applicationSigned?: boolean;
}
```

**Option B: Use Metadata (recommended - no CMSNext changes)**
```typescript
// Store in Person.metadata or CaseRecord.metadata
metadata: {
  citizenship: { isUSCitizen: boolean, eligible: boolean },
  disability: { hasDisability: boolean, description: string },
  voterRegistered: boolean,
  applicationSigned: boolean
}
```

### **2. Address Parsing**

Our single-line address needs to be parsed into CMSNext's structured format:

```typescript
function parseAddress(addressString: string): Address {
  // Example: "123 Main St, Springfield, IL 62701"
  // Parse into: { street, city, state, zip }
}
```

### **3. Relationships Field**

**CMSWorkbench:**
```typescript
interface Relationship {
  name: string;
  phone: string;
  relation: string;
}
```

**CMSNext Options:**
- `person.authorizedRepIds` - for authorized representatives
- `person.familyMembers` - for family relationships
- `person.spouseId` (in CaseRecord) - for spouse

**Action:** Map relationships based on `relation` field:
- "Spouse" → `caseRecord.spouseId`
- "Authorized Rep" → `person.authorizedRepIds`
- Others → `person.familyMembers` or metadata

### **4. AVS/VR Section**

These fields don't exist in the base Person/CaseRecord but should go into:
- `CaseRecord.notes[]` - for the AVS narrative
- Custom fields or metadata for tracking

---

## 🎯 Integration Strategy

### **Phase 1: Data Transformation Layer**

Create a transformer utility:

```typescript
// utils/intakeFormTransformer.ts
export function transformIntakeToCase(
  formData: CaseIntakeFormData
): { person: NewPersonData; caseRecord: NewCaseRecordData } {
  
  const address = parseAddress(formData.contact.address);
  
  return {
    person: {
      firstName: formData.applicant.firstName,
      lastName: formData.applicant.lastName,
      email: formData.contact.email,
      phone: formData.contact.phone,
      address,
      mailingAddress: { ...address, sameAsPhysical: true },
      dateOfBirth: '', // Not collected in intake
      ssn: '', // Not collected in intake
      organizationId: null,
      livingArrangement: '', // Not collected in intake
      authorizedRepIds: extractAuthorizedReps(formData.relationships),
      familyMembers: extractFamilyMembers(formData.relationships),
      status: formData.applicant.applicationSigned ? 'Active' : 'Pending'
    },
    caseRecord: {
      mcn: '', // Generated in main app
      applicationDate: formData.avsSection.avsConsentDate || new Date().toISOString(),
      caseType: 'Intake', // Or determine from citizenship/disability
      personId: '', // Generated in main app
      spouseId: findSpouse(formData.relationships),
      status: 'Pending',
      description: formData.avsSection.narrative || '',
      priority: false,
      livingArrangement: '', // Not collected
      withWaiver: false,
      admissionDate: new Date().toISOString(),
      organizationId: '',
      authorizedReps: [],
      retroRequested: ''
    }
  };
}
```

### **Phase 2: API Integration**

When transferring to CMSNext:

```typescript
import { transformIntakeToCase } from './utils/intakeFormTransformer';

async function submitIntakeForm(formData: CaseIntakeFormData) {
  const caseData = transformIntakeToCase(formData);
  
  // Use CMSNext's DataManager
  await dataManager.createCompleteCase(caseData);
  
  // Or call API endpoint
  await fetch('/api/cases/complete', {
    method: 'POST',
    body: JSON.stringify(caseData)
  });
}
```

---

## 🔍 Missing Fields Analysis

### **Fields in CMSNext NOT in Intake Form:**

| Field | Required? | Solution |
|-------|-----------|----------|
| `dateOfBirth` | Optional | Leave empty, collect in case details |
| `ssn` | Optional | Leave empty, collect in case details |
| `livingArrangement` | Required | Default to empty or "Unknown" |
| `organizationId` | Optional | Set to null |
| `mcn` | Required | Auto-generate in main app |

### **Fields in Intake Form NOT in CMSNext:**

| Field | Solution |
|-------|----------|
| `citizenship` | Add to Person metadata |
| `disability` | Add to Person metadata |
| `voterRegistered` | Add to Person metadata |
| `applicationSigned` | Use as status indicator |
| `reviewDocs.*` | Add to CaseRecord notes |
| `avsSection.narrative` | Add as first CaseRecord note |
| `avsSection.knownInstitutions` | Add to CaseRecord metadata |
| `avsSection.assignedWorker` | Set as case owner/assigned user |

---

## ✅ Validation Rules

### **CMSNext Validation (`utils/validation.ts`):**

```typescript
PersonSchema = z.object({
  firstName: stringRequired('First name'),
  lastName: stringRequired('Last name'),
  email: z.string().email().optional(),
  phone: stringOptional,
  dateOfBirth: z.string().optional(),
  ssn: stringOptional,
  // ...
});

CaseRecordSchema = z.object({
  mcn: stringRequired('MCN'),
  applicationDate: z.string().datetime(),
  caseType: stringRequired('Case type'),
  // ...
});
```

**Our intake form must ensure:**
- ✅ First name and last name are collected
- ✅ Email and phone are optional (already correct)
- ⚠️ We don't collect dateOfBirth or SSN (okay for intake)
- ⚠️ MCN must be generated or assigned during transfer

---

## 📦 Recommended File Structure After Transfer

```
CMSNext/
├── components/
│   ├── case-intake/           # ← Transfer our components here
│   │   ├── ApplicantBasicsSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── RelationshipsSection.tsx
│   │   ├── SystemVerificationSection.tsx
│   │   ├── SubmissionSection.tsx
│   │   ├── CaseIntakeForm.tsx
│   │   ├── FormField.tsx
│   │   ├── FormSelect.tsx
│   │   ├── FormCheckbox.tsx
│   │   └── DynamicList.tsx
│   ├── case/                  # Existing case management
│   │   ├── CaseForm.tsx       # Full case details form
│   │   ├── CaseList.tsx
│   │   └── CaseDetails.tsx
│   └── ui/                    # shadcn components (already exists)
├── hooks/
│   ├── useCaseIntakeForm.ts   # ← Transfer
│   ├── usePhoneFormatter.ts   # ← Transfer
│   ├── useDateFormatter.ts    # ← Transfer
│   └── useCaseManagement.ts   # Already exists
├── types/
│   ├── case-intake.ts         # ← Transfer (optional)
│   └── case.ts                # Already exists - may extend
└── utils/
    └── intakeFormTransformer.ts # ← Create new
```

---

## 🚀 Integration Workflow

### **Step 1: Copy Components**
```bash
cp -r components/case-intake/ ../CMSNext/components/
cp hooks/useCaseIntakeForm.ts ../CMSNext/hooks/
cp hooks/usePhoneFormatter.ts ../CMSNext/hooks/
cp hooks/useDateFormatter.ts ../CMSNext/hooks/
```

### **Step 2: Create Transformer**
Create `utils/intakeFormTransformer.ts` with type mappings.

### **Step 3: Add Route/View**
In CMSNext's `App.tsx` or navigation:
```typescript
<Route path="/intake" element={<CaseIntakeForm />} />
```

### **Step 4: Wire Submission**
Connect form submission to CMSNext's DataManager:
```typescript
const handleIntakeSubmit = async (formData: CaseIntakeFormData) => {
  const caseData = transformIntakeToCase(formData);
  await dataManager.createCompleteCase(caseData);
  navigate('/cases'); // Redirect to case list
};
```

---

## 🎨 Styling Considerations

Both projects use:
- ✅ Tailwind CSS v4
- ✅ Same shadcn/ui theme tokens
- ✅ Same design system

**Action Required:** NONE - styling is fully compatible.

---

## 📝 CategoryConfig Integration

CMSNext uses `CategoryConfig` for dropdown options:

```typescript
interface CategoryConfig {
  caseTypes: string[];
  caseStatuses: string[];
  livingArrangements: string[];
  noteCategories: string[];
  verificationStatuses: string[];
}
```

Our intake form hardcodes some options. **Recommendation:**
- Connect to CMSNext's `useCategoryConfig()` hook
- Use dynamic options instead of hardcoded arrays

---

## ✅ Compatibility Checklist

- [x] shadcn/ui components match
- [x] Tailwind CSS version matches (v4)
- [x] TypeScript strict mode enabled in both
- [x] React 18 used in both
- [ ] Type definitions need mapping
- [ ] Address parsing needed
- [ ] Metadata fields need definition
- [ ] Transformer utility needed
- [ ] Navigation integration needed

---

## 🎯 Next Steps

1. **Create `utils/intakeFormTransformer.ts`** - Data mapping utility
2. **Extend CMSNext types** - Add metadata fields if needed
3. **Test data flow** - Ensure intake → case details works
4. **Update documentation** - Add intake form to main README
5. **Add integration tests** - Test complete workflow

---

## 📞 Support

For questions about this alignment:
- Review `.github/INSTRUCTIONS.md` in both repos
- Check type definitions in `types/case.ts`
- Consult CMSNext's validation schema in `utils/validation.ts`
