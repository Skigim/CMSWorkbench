'use client';

import { useState, useMemo } from 'react';
import { FormField } from './FormField';
import { FormCheckbox } from './FormCheckbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CaseIntakeFormData } from '@/types/case-intake';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { Copy, Check } from 'lucide-react';

interface SubmissionSectionProps {
  formData: CaseIntakeFormData;
  onUpdate: (updates: Partial<CaseIntakeFormData>) => void;
}

export function SubmissionSection({ formData, onUpdate }: SubmissionSectionProps) {
  const [copied, setCopied] = useState(false);
  const { formatDate } = useDateFormatter();

  // Calculate dates based on AVS consent date
  const narrativeDates = useMemo(() => {
    const getFormattedDate = (offset = 0) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    return {
      submitDate: getFormattedDate(0),
      fiveDayDate: getFormattedDate(5),
      elevenDayDate: getFormattedDate(11),
    };
  }, []);

  const narrativeText = useMemo(() => {
    const consentDate = formData.avsConsentDate || 'MM/DD/YYYY';
    const knownInst = formData.knownInstitutions || '______________________';

    return `MLTC: AVS Submitted
Consent Date: ${consentDate}
Submit Date: ${narrativeDates.submitDate}
5 Day: ${narrativeDates.fiveDayDate}
11 Day: ${narrativeDates.elevenDayDate}
Known Institutions: ${knownInst}`;
  }, [formData.avsConsentDate, formData.knownInstitutions, narrativeDates]);

  const copyNarrative = async () => {
    try {
      await navigator.clipboard.writeText(narrativeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* AVS Consent Date */}
      <div>
        <FormField
          label="AVS Consent Date"
          id="avsConsentDate"
          value={formData.avsConsentDate}
          onChange={(value) => onUpdate({ avsConsentDate: formatDate(value) })}
          placeholder="MM/DD/YYYY"
        />
      </div>

      {/* Final Actions */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Final Actions</h3>
        
        <FormCheckbox
          label="AVS Submitted"
          id="avsSubmitted"
          checked={formData.avsSubmitted}
          onChange={(checked) => onUpdate({ avsSubmitted: checked })}
        />

        <FormCheckbox
          label="VR Needed"
          id="vrNeeded"
          checked={formData.vrNeeded}
          onChange={(checked) => onUpdate({ vrNeeded: checked })}
        />

        <FormField
          label="VR Sent Details"
          id="vrSentDetails"
          value={formData.vrSentDetails}
          onChange={(value) => onUpdate({ vrSentDetails: value })}
          placeholder="e.g., Sent on MM/DD/YYYY via mail"
        />
      </div>

      {/* Mandatory Narrative */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Mandatory Narrative</h3>
        
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="relative">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {narrativeText}
              </pre>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={copyNarrative}
                className="absolute top-0 right-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <FormField
          label="Known Institutions"
          id="knownInstitutions"
          value={formData.knownInstitutions}
          onChange={(value) => onUpdate({ knownInstitutions: value })}
          placeholder="Enter any known institutions"
        />
      </div>

      {/* Case Assignment */}
      <div>
        <FormField
          label="Case Assignment"
          id="caseAssignment"
          value={formData.caseAssignment}
          onChange={(value) => onUpdate({ caseAssignment: value })}
          placeholder="e.g., Self, Case Worker Name"
        />
      </div>
    </div>
  );
}
