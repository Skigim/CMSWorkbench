# Quick Integration Reference

## 🎯 One-Command Transfer
```bash
# From CMSWorkbench root directory
cp -r components/case-intake ../CMSNext/components/ && \
cp hooks/useCaseIntakeForm.ts hooks/usePhoneFormatter.ts hooks/useDateFormatter.ts ../CMSNext/hooks/ && \
cp utils/intakeFormTransformer.ts ../CMSNext/utils/
```

## 📝 Minimal Integration Code

### Add to CMSNext App

```typescript
// components/intake/IntakePage.tsx
import { CaseIntakeForm } from '@/components/case-intake';
import { transformIntakeToCase, createIntakeMetadata } from '@/utils/intakeFormTransformer';
import { useDataManagerSafe } from '@/contexts/DataManagerContext';
import { useNavigate } from 'react-router-dom'; // or Next.js navigation

export function IntakePage() {
  const dataManager = useDataManagerSafe();
  const navigate = useNavigate();

  const handleSubmit = async (formData: CaseIntakeFormData) => {
    try {
      // Transform to CMSNext format
      const caseData = transformIntakeToCase(formData);
      
      // Create case
      const newCase = await dataManager.createCompleteCase(caseData);
      
      // Store metadata
      const metadata = createIntakeMetadata(formData);
      await dataManager.addNote(newCase.id, {
        category: 'Intake',
        content: JSON.stringify(metadata, null, 2)
      });
      
      // Navigate to case details
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error('Intake submission failed:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="container mx-auto py-8">
      <CaseIntakeForm onSubmit={handleSubmit} />
    </div>
  );
}
```

## 🔌 Required CMSNext Context

Ensure these are available:
- ✅ `useDataManagerSafe()` - Already exists in CMSNext
- ✅ Navigation system (React Router or Next.js)
- ✅ Toast/notification system (Sonner) - Already installed

## 📊 Data Flow

```
User fills form
      ↓
CaseIntakeFormData
      ↓
transformIntakeToCase()
      ↓
{ person: NewPersonData, caseRecord: NewCaseRecordData }
      ↓
dataManager.createCompleteCase()
      ↓
CaseDisplay (with generated ID, MCN, etc.)
      ↓
createIntakeMetadata() → addNote()
      ↓
Navigate to case details
```

## ✅ Verification Steps

1. **Form Loads:**
   ```
   Visit /intake route → Form displays without errors
   ```

2. **Form Submits:**
   ```
   Fill form → Click submit → Case appears in case list
   ```

3. **Data Preserved:**
   ```
   Open created case → Check person details → Verify address structure
   ```

4. **Metadata Stored:**
   ```
   Check notes tab → Should see "Intake" category note with JSON metadata
   ```

## 🐛 Troubleshooting

### "Cannot find module 'case-intake'"
```bash
# Verify files were copied correctly
ls ../CMSNext/components/case-intake
```

### "transformIntakeToCase is not a function"
```bash
# Check transformer was copied
ls ../CMSNext/utils/intakeFormTransformer.ts
```

### "DataManager createCompleteCase failed"
- Verify MCN generation is working
- Check that required fields are populated
- Review CMSNext validation schema

### Address Parsing Issues
- Test with sample: "123 Main St, Springfield, IL 62701"
- Ensure state is 2-letter abbreviation
- ZIP code must be 5 or 9 digits

## 📚 Full Documentation

- **Detailed Alignment:** `.github/ALIGNMENT_REPORT.md`
- **Component Guide:** `components/case-intake/README.md`
- **Integration Summary:** `utils/INTEGRATION_SUMMARY.md`
- **Project Instructions:** `.github/INSTRUCTIONS.md`

---

*Ready to integrate! 🚀*
