import { CaseIntakeFormData, Relationship } from '../types/case-intake';

/**
 * CMSNext-compatible type definitions
 * These mirror the types from CMSNext/types/case.ts
 */

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface MailingAddress extends Address {
  sameAsPhysical: boolean;
}

interface NewPersonData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  organizationId?: string | null;
  livingArrangement: string;
  address: Address;
  mailingAddress: MailingAddress;
  authorizedRepIds?: string[];
  familyMembers?: string[];
  status: string;
}

type CaseStatus = 'Active' | 'Pending' | 'Closed' | 'Archived';

interface NewCaseRecordData {
  mcn: string;
  applicationDate: string;
  caseType: string;
  personId: string;
  spouseId?: string;
  status: CaseStatus;
  description: string;
  priority?: boolean;
  livingArrangement: string;
  withWaiver?: boolean;
  admissionDate: string;
  organizationId: string;
  authorizedReps?: string[];
  retroRequested?: string;
}

/**
 * Parse a single-line address string into structured Address object
 * Format examples:
 * - "123 Main St, Springfield, IL 62701"
 * - "456 Oak Avenue, Unit 2B, Portland, OR 97201"
 */
function parseAddress(addressString: string): Address {
  const trimmed = addressString.trim();
  
  if (!trimmed) {
    return { street: '', city: '', state: '', zip: '' };
  }

  // Split by comma
  const parts = trimmed.split(',').map(p => p.trim());

  if (parts.length < 3) {
    // Not enough parts, return as-is in street field
    return {
      street: trimmed,
      city: '',
      state: '',
      zip: ''
    };
  }

  // Last part should be "STATE ZIP"
  const lastPart = parts[parts.length - 1];
  const stateZipMatch = lastPart.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);

  if (!stateZipMatch) {
    // Couldn't parse state/zip, return best effort
    return {
      street: parts.slice(0, -2).join(', '),
      city: parts[parts.length - 2] || '',
      state: '',
      zip: lastPart
    };
  }

  const state = stateZipMatch[1];
  const zip = stateZipMatch[2];
  const city = parts[parts.length - 2];
  const street = parts.slice(0, -2).join(', ');

  return { street, city, state, zip };
}

/**
 * Extract authorized representative IDs from relationships
 * Relationships with relation "Authorized Rep" or "POA" become authorized reps
 */
function extractAuthorizedReps(relationships: Relationship[]): string[] {
  return relationships
    .filter(r => 
      r.relation.toLowerCase().includes('authorized') || 
      r.relation.toLowerCase().includes('poa') ||
      r.relation.toLowerCase().includes('representative')
    )
    .map(r => r.name)
    .filter(name => name.trim() !== '');
}

/**
 * Extract family member names from relationships
 * Exclude spouse and authorized reps
 */
function extractFamilyMembers(relationships: Relationship[]): string[] {
  return relationships
    .filter(r => {
      const relation = r.relation.toLowerCase();
      return !relation.includes('spouse') && 
             !relation.includes('authorized') && 
             !relation.includes('poa') &&
             !relation.includes('representative');
    })
    .map(r => `${r.name} (${r.relation})`)
    .filter(entry => entry.trim() !== '');
}

/**
 * Find spouse ID from relationships
 * Returns the name of the spouse, or empty string if none
 */
function findSpouse(relationships: Relationship[]): string {
  const spouse = relationships.find(r => 
    r.relation.toLowerCase().includes('spouse')
  );
  return spouse ? spouse.name : '';
}

/**
 * Determine case type based on intake form data
 * Uses citizenship and disability status to suggest type
 */
function determineCaseType(formData: CaseIntakeFormData): string {
  // If disability is indicated, suggest LTC (Long Term Care)
  if (formData.disability.status) {
    return 'LTC';
  }
  
  // If citizenship issues, suggest General
  if (!formData.citizenship.status) {
    return 'General';
  }

  // Default to Medicaid for basic intake
  return 'Medicaid';
}

/**
 * Transform intake form data to CMSNext-compatible case structure
 * 
 * @param formData - Data from CaseIntakeForm
 * @returns Object with person and caseRecord data ready for CMSNext DataManager
 */
export function transformIntakeToCase(
  formData: CaseIntakeFormData
): { person: NewPersonData; caseRecord: NewCaseRecordData } {
  
  const address = parseAddress(formData.contact.address);
  
  // Parse applicant name into first/last
  const nameParts = formData.applicantName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Create person data
  const person: NewPersonData = {
    firstName,
    lastName,
    email: formData.contact.email,
    phone: formData.contact.phone,
    address,
    mailingAddress: { ...address, sameAsPhysical: true },
    
    // Fields not collected in intake - use sensible defaults
    dateOfBirth: '', // Will be collected in case details
    ssn: '', // Will be collected in case details
    organizationId: null,
    livingArrangement: '', // Will be determined in case details
    
    // Relationship mappings
    authorizedRepIds: extractAuthorizedReps(formData.relationships),
    familyMembers: extractFamilyMembers(formData.relationships),
    
    // Status based on application signed
    status: formData.applicationSigned ? 'Active' : 'Pending'
  };

  // Create case record data
  const caseRecord: NewCaseRecordData = {
    // MCN will be auto-generated by CMSNext
    mcn: '',
    
    // Use AVS consent date as application date, or current date
    applicationDate: formData.avsConsentDate || new Date().toISOString(),
    
    // Determine appropriate case type
    caseType: determineCaseType(formData),
    
    // Person ID will be set by CMSNext during creation
    personId: '',
    
    // Spouse from relationships
    spouseId: findSpouse(formData.relationships),
    
    // Initial status
    status: 'Pending',
    
    // Initial description from intake
    description: 'Case created from intake form',
    
    // No priority flag on intake
    priority: false,
    
    // Living arrangement not collected in intake
    livingArrangement: '',
    
    // Waiver not determined at intake
    withWaiver: false,
    
    // Use AVS consent date or current date as admission
    admissionDate: formData.avsConsentDate || new Date().toISOString(),
    
    // Organization not assigned at intake
    organizationId: '',
    
    // Authorized reps array (empty - using person.authorizedRepIds instead)
    authorizedReps: [],
    
    // Retro not requested at intake
    retroRequested: ''
  };

  return { person, caseRecord };
}

/**
 * Create metadata object for fields not in standard Person/CaseRecord
 * This can be stored in Person or CaseRecord metadata fields
 */
export function createIntakeMetadata(formData: CaseIntakeFormData) {
  return {
    // Citizenship status
    citizenship: {
      status: formData.citizenship.status
    },
    
    // Disability status
    disability: {
      status: formData.disability.status
    },
    
    // Voter registration
    voterRegistration: formData.voterReg,
    
    // Application signed status
    applicationSigned: formData.applicationSigned,
    
    // Applicant status (individual/married/other)
    applicantStatus: formData.applicantStatus,
    
    // System verification checklist
    reviewDocs: {
      budgets: formData.reviewDocs.budgets,
      narratives: formData.reviewDocs.narratives,
      verification: formData.reviewDocs.verification,
      interfaces: formData.reviewDocs.interfaces
    },
    
    // AVS section data
    avs: {
      consentDate: formData.avsConsentDate,
      submitted: formData.avsSubmitted,
      vrNeeded: formData.vrNeeded,
      vrSentDetails: formData.vrSentDetails,
      knownInstitutions: formData.knownInstitutions,
      caseAssignment: formData.caseAssignment
    },
    
    // Source tracking
    source: 'intake-form',
    intakeDate: new Date().toISOString()
  };
}

/**
 * Validate that transformed data meets CMSNext requirements
 * Returns validation errors if any
 */
export function validateTransformedData(
  transformed: { person: NewPersonData; caseRecord: NewCaseRecordData }
): string[] {
  const errors: string[] = [];

  // Person validation
  if (!transformed.person.firstName.trim()) {
    errors.push('First name is required');
  }
  if (!transformed.person.lastName.trim()) {
    errors.push('Last name is required');
  }

  // Case record validation
  if (!transformed.caseRecord.applicationDate) {
    errors.push('Application date is required');
  }
  if (!transformed.caseRecord.caseType) {
    errors.push('Case type is required');
  }

  return errors;
}

/**
 * Example usage:
 * 
 * const handleSubmit = async (formData: CaseIntakeFormData) => {
 *   // Transform to CMSNext format
 *   const caseData = transformIntakeToCase(formData);
 *   
 *   // Validate
 *   const errors = validateTransformedData(caseData);
 *   if (errors.length > 0) {
 *     console.error('Validation errors:', errors);
 *     return;
 *   }
 *   
 *   // Get metadata for storage
 *   const metadata = createIntakeMetadata(formData);
 *   
 *   // Send to CMSNext DataManager
 *   const createdCase = await dataManager.createCompleteCase(caseData);
 *   
 *   // Store metadata (implementation depends on CMSNext structure)
 *   // Option 1: Update person with metadata
 *   // await dataManager.updatePerson(createdCase.person.id, { ...createdCase.person, metadata });
 *   
 *   // Option 2: Add as first note
 *   // await dataManager.addNote(createdCase.id, {
 *   //   category: 'Intake',
 *   //   content: JSON.stringify(metadata, null, 2)
 *   // });
 * };
 */
