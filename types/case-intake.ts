export type ApplicantStatus = 'individual' | 'married' | 'other' | '';
export type VoterRegistration = 'yes' | 'no' | '';

export interface Relationship {
  name: string;
  phone: string;
  relation: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface CitizenshipInfo {
  status: boolean;
}

export interface DisabilityInfo {
  status: boolean;
}

export interface ReviewDocs {
  budgets: boolean;
  narratives: boolean;
  verification: boolean;
  interfaces: boolean;
}

export interface CaseIntakeFormData {
  applicantName: string;
  applicantStatus: ApplicantStatus;
  contact: ContactInfo;
  relationships: Relationship[];
  citizenship: CitizenshipInfo;
  disability: DisabilityInfo;
  voterReg: VoterRegistration;
  applicationSigned: boolean;
  reviewDocs: ReviewDocs;
  avsConsentDate: string;
  avsSubmitted: boolean;
  vrNeeded: boolean;
  vrSentDetails: string;
  knownInstitutions: string;
  caseAssignment: string;
}

export const initialFormData: CaseIntakeFormData = {
  applicantName: '',
  applicantStatus: '',
  contact: { address: '', phone: '', email: '' },
  relationships: [{ name: '', phone: '', relation: '' }],
  citizenship: { status: false },
  disability: { status: false },
  voterReg: '',
  applicationSigned: false,
  reviewDocs: { budgets: false, narratives: false, verification: false, interfaces: false },
  avsConsentDate: '',
  avsSubmitted: false,
  vrNeeded: false,
  vrSentDetails: '',
  knownInstitutions: '',
  caseAssignment: '',
};
