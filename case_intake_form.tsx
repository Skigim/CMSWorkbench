import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CaseIntakeForm() {
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantStatus: '',
    contact: { address: '', phone: '', email: '' },
    relationships: [{ name: '', phone: '', relation: '' }],
    citizenship: { status: false },
    disability: { status: false },
    income: [{ type: '', person: '', amount: '', frequency: '' }],
    expenses: [{ type: '', amount: '', frequency: '', shared: false }],
    resources: [{ type: '', person: '', value: '', description: '' }],
    voterReg: '',
    applicationSigned: false,
    reviewDocs: { budgets: false, narratives: false, verification: false, interfaces: false },
    avs: false,
    caseAssignment: '',
  });

  const [expandedSections, setExpandedSections] = useState({
    applicationBasics: true,
    relationships: true,
    systemVerification: true,
    financials: true,
    submission: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getNameOptions = () => {
    const names = [];
    if (formData.applicantName) names.push(formData.applicantName);
    formData.relationships.forEach(rel => {
      if (rel.name) names.push(rel.name);
    });
    return names;
  };

  const addIncomeRow = () => {
    setFormData(prev => ({
      ...prev,
      income: [...prev.income, { type: '', person: '', amount: '', frequency: '' }]
    }));
  };

  const removeIncomeRow = (idx) => {
    setFormData(prev => ({
      ...prev,
      income: prev.income.filter((_, i) => i !== idx)
    }));
  };

  const updateIncomeRow = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      income: prev.income.map((row, i) => i === idx ? { ...row, [field]: value } : row)
    }));
  };

  const addExpenseRow = () => {
    setFormData(prev => ({
      ...prev,
      expenses: [...prev.expenses, { type: '', amount: '', frequency: '', shared: false }]
    }));
  };

  const removeExpenseRow = (idx) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.filter((_, i) => i !== idx)
    }));
  };

  const updateExpenseRow = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      expenses: prev.expenses.map((row, i) => i === idx ? { ...row, [field]: value } : row)
    }));
  };

  const addResourceRow = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { type: '', person: '', value: '', description: '' }]
    }));
  };

  const removeResourceRow = (idx) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== idx)
    }));
  };

  const updateResourceRow = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map((row, i) => i === idx ? { ...row, [field]: value } : row)
    }));
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const SectionHeader = ({ title, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between bg-slate-700 text-white p-4 font-semibold hover:bg-slate-600 transition"
    >
      {title}
      {expandedSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Case Application Intake Form</h1>

      {/* APPLICATION BASICS */}
      <div className="mb-6 bg-white rounded border border-slate-200">
        <SectionHeader title="1. Applicant Status & Basics" section="applicationBasics" />
        {expandedSections.applicationBasics && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Applicant Name</label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => setFormData(prev => ({ ...prev, applicantName: e.target.value }))}
                placeholder="Full name"
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Applicant Status</label>
              <select
                value={formData.applicantStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, applicantStatus: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded"
              >
                <option value="">Select...</option>
                <option value="individual">Individual</option>
                <option value="married">Married</option>
                <option value="other">Other</option>
              </select>
            </div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.citizenship.status}
                onChange={(e) => setFormData(prev => ({ ...prev, citizenship: { ...prev.citizenship, status: e.target.checked } }))}
                className="w-4 h-4"
              />
              <span className="text-slate-700">U.S. Citizen</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.disability.status}
                onChange={(e) => setFormData(prev => ({ ...prev, disability: { ...prev.disability, status: e.target.checked } }))}
                className="w-4 h-4"
              />
              <span className="text-slate-700">Verified Disabled</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Voter Registration</label>
              <select
                value={formData.voterReg}
                onChange={(e) => setFormData(prev => ({ ...prev, voterReg: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded"
              >
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.applicationSigned}
                onChange={(e) => setFormData(prev => ({ ...prev, applicationSigned: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-slate-700">Application Signed</span>
            </label>
          </div>
        )}
      </div>

      {/* CONTACT INFORMATION */}
      <div className="mb-6 bg-white rounded border border-slate-200">
        <SectionHeader title="2. Contact Information" section="contact" />
        {expandedSections.contact && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.contact.address}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                placeholder="Street address"
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.contact.phone}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setFormData(prev => ({ ...prev, contact: { ...prev.contact, phone: formatted } }));
                }}
                placeholder="(123) 456-7890"
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                placeholder="email@example.com"
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* RELATIONSHIPS */}
      <div className="mb-6 bg-white rounded border border-slate-200">
        <SectionHeader title="3. Relationships" section="relationships" />
        {expandedSections.relationships && (
          <div className="p-6 space-y-4">
            {formData.relationships.map((rel, idx) => (
              <div key={idx} className="p-4 bg-slate-100 rounded space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={rel.name}
                    onChange={(e) => {
                      const newRels = [...formData.relationships];
                      newRels[idx].name = e.target.value;
                      setFormData(prev => ({ ...prev, relationships: newRels }));
                    }}
                    placeholder="Full name"
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={rel.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      const newRels = [...formData.relationships];
                      newRels[idx].phone = formatted;
                      setFormData(prev => ({ ...prev, relationships: newRels }));
                    }}
                    placeholder="(123) 456-7890"
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Relation</label>
                  <input
                    type="text"
                    value={rel.relation}
                    onChange={(e) => {
                      const newRels = [...formData.relationships];
                      newRels[idx].relation = e.target.value;
                      setFormData(prev => ({ ...prev, relationships: newRels }));
                    }}
                    placeholder="e.g., Spouse, Parent, Child"
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                {formData.relationships.length > 1 && (
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        relationships: prev.relationships.filter((_, i) => i !== idx)
                      }));
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  relationships: [...prev.relationships, { name: '', phone: '', relation: '' }]
                }));
              }}
              className="text-sm bg-slate-600 text-white p-2 rounded hover:bg-slate-700"
            >
              + Add Relationship
            </button>
          </div>
        )}
      </div>

      {/* SYSTEM VERIFICATION */}
      <div className="mb-6 bg-white rounded border border-slate-200">
        <SectionHeader title="4. System Verification" section="systemVerification" />
        {expandedSections.systemVerification && (
          <div className="p-6 space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.reviewDocs.budgets}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewDocs: { ...prev.reviewDocs, budgets: e.target.checked } }))}
                className="w-4 h-4"
              />
              <span className="text-slate-700">Past Budgets - Reviewed</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.reviewDocs.narratives}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewDocs: { ...prev.reviewDocs, narratives: e.target.checked } }))}
                className="w-4 h-4"
              />
              <span className="text-slate-700">Narratives - Reviewed</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.reviewDocs.verification}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewDocs: { ...prev.reviewDocs, verification: e.target.checked } }))}
                className="w-4 h-4"
              />
              <span className="text-slate-700">Verification Requests - Reviewed</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.reviewDocs.interfaces}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewDocs: { ...prev.reviewDocs, interfaces: e.target.checked } }))}
                className="w-4 h-4"
              />
              <span className="text-slate-700">Interfaces - Reviewed</span>
            </label>
          </div>
        )}
      </div>

      {/* FINANCIALS */}
      <div className="mb-6 bg-white rounded border border-slate-200">
        <SectionHeader title="5. Financials" section="financials" />
        {expandedSections.financials && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Income Sources</h3>
              {formData.income.map((income, idx) => (
                <div key={idx} className="p-4 bg-slate-100 rounded space-y-3 mb-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                      <input
                        type="text"
                        value={income.type}
                        onChange={(e) => updateIncomeRow(idx, 'type', e.target.value)}
                        placeholder="e.g., SSA"
                        className="w-full p-2 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Person</label>
                      <select
                        value={income.person}
                        onChange={(e) => updateIncomeRow(idx, 'person', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded"
                      >
                        <option value="">Select...</option>
                        {getNameOptions().map((name, i) => (
                          <option key={i} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                      <input
                        type="number"
                        value={income.amount}
                        onChange={(e) => updateIncomeRow(idx, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full p-2 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                      <select
                        value={income.frequency}
                        onChange={(e) => updateIncomeRow(idx, 'frequency', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded"
                      >
                        <option value="">Select...</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                  </div>
                  {formData.income.length > 1 && (
                    <button
                      onClick={() => removeIncomeRow(idx)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addIncomeRow}
                className="text-sm bg-slate-600 text-white p-2 rounded hover:bg-slate-700"
              >
                + Add Income Source
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Expenses</h3>
              {formData.expenses.map((expense, idx) => (
                <div key={idx} className="p-4 bg-slate-100 rounded space-y-3 mb-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                      <input
                        type="text"
                        value={expense.type}
                        onChange={(e) => updateExpenseRow(idx, 'type', e.target.value)}
                        placeholder="e.g., Mortgage, Utilities"
                        className="w-full p-2 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                      <input
                        type="number"
                        value={expense.amount}
                        onChange={(e) => updateExpenseRow(idx, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full p-2 border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                      <select
                        value={expense.frequency}
                        onChange={(e) => updateExpenseRow(idx, 'frequency', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded"
                      >
                        <option value="">Select...</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                    <label className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        checked={expense.shared}
                        onChange={(e) => updateExpenseRow(idx, 'shared', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700">Shared Expense</span>
                    </label>
                  </div>
                  {formData.expenses.length > 1 && (
                    <button
                      onClick={() => removeExpenseRow(idx)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addExpenseRow}
                className="text-sm bg-slate-600 text-white p-2 rounded hover:bg-slate-700"
              >
                + Add Expense
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Resources</h3>
              {formData.resources.map((resource, idx) => (
                <div key={idx} className="p-4 bg-slate-100 rounded space-y-3 mb-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                      <input
                        type="text"
                        value={resource.type}
                        onChange={(e) => updateResourceRow(idx, 'type', e.target.value)}
                        placeholder="e.g., Vehicle, Bank Account, Property"
                        className="w-full p-2 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Person</label>
                      <select
                        value={resource.person}
                        onChange={(e) => updateResourceRow(idx, 'person', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded"
                      >
                        <option value="">Select...</option>
                        {getNameOptions().map((name, i) => (
                          <option key={i} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                      <input
                        type="number"
                        value={resource.value}
                        onChange={(e) => updateResourceRow(idx, 'value', e.target.value)}
                        placeholder="0.00"
                        className="w-full p-2 border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={resource.description}
                        onChange={(e) => updateResourceRow(idx, 'description', e.target.value)}
                        placeholder="e.g., 2023 Chevy Equinox, Wells Fargo"
                        className="w-full p-2 border border-slate-300 rounded"
                      />
                    </div>
                  </div>
                  {formData.resources.length > 0 && (
                    <button
                      onClick={() => removeResourceRow(idx)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addResourceRow}
                className="text-sm bg-slate-600 text-white p-2 rounded hover:bg-slate-700"
              >
                + Add Resource
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SUBMISSION */}
      <div className="mb-6 bg-white rounded border border-slate-200">
        <SectionHeader title="6. Submission" section="submission" />
        {expandedSections.submission && (
          <div className="p-6 space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.avs}
                onChange={(e) => setFormData(prev => ({ ...prev, avs: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-slate-700">AVS - Submitted</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Case Assignment</label>
              <input
                type="text"
                value={formData.caseAssignment}
                onChange={(e) => setFormData(prev => ({ ...prev, caseAssignment: e.target.value }))}
                placeholder="e.g., Self, Case Worker Name"
                className="w-full p-2 border border-slate-300 rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}