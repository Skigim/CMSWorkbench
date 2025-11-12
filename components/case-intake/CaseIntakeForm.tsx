'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ApplicantBasicsSection } from './ApplicantBasicsSection';
import { ContactSection } from './ContactSection';
import { RelationshipsSection } from './RelationshipsSection';
import { SystemVerificationSection } from './SystemVerificationSection';
import { SubmissionSection } from './SubmissionSection';
import { useCaseIntakeForm } from '@/hooks/useCaseIntakeForm';
import { CaseIntakeFormData } from '@/types/case-intake';

export function CaseIntakeForm() {
  const { formData, setFormData } = useCaseIntakeForm();

  const handleUpdate = (updates: Partial<CaseIntakeFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Case Application Intake Form
        </h1>
        <p className="text-muted-foreground mt-2">
          Collect basic applicant information and initiate case review
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={[
          'basics',
          'contact',
          'relationships',
          'verification',
          'submission',
        ]}
        className="space-y-4"
      >
        <AccordionItem value="basics" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            1. Applicant Status & Basics
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <ApplicantBasicsSection formData={formData} onUpdate={handleUpdate} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            2. Contact Information
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <ContactSection formData={formData} onUpdate={handleUpdate} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="relationships" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            3. Relationships
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <RelationshipsSection formData={formData} onUpdate={handleUpdate} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            4. System Verification
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <SystemVerificationSection formData={formData} onUpdate={handleUpdate} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="submission" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            5. Submission & AVS
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <SubmissionSection formData={formData} onUpdate={handleUpdate} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
