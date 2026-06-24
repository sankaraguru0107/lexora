import React, { useState } from 'react';
import Layout from '../components/Layout';
import { sendChatMessage } from '../services/azureOpenAI';
import './Documents.css';

const templates = [
  { id: 'rental', icon: '🏠', name: 'Rental Agreement', desc: 'Lease agreement for residential/commercial property' },
  { id: 'nda', icon: '🔒', name: 'Non-Disclosure Agreement', desc: 'Confidentiality agreement between parties' },
  { id: 'employment', icon: '👔', name: 'Employment Contract', desc: 'Job offer and employment terms' },
  { id: 'affidavit', icon: '📜', name: 'Affidavit', desc: 'Sworn statement for legal purposes' },
  { id: 'poa', icon: '✍️', name: 'Power of Attorney', desc: 'Authorization to act on behalf' },
  { id: 'complaint', icon: '⚖️', name: 'Legal Complaint', desc: 'Draft a formal legal complaint' },
];

const DocumentsPage: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  const templateForms: Record<string, { label: string; key: string; placeholder: string }[]> = {
    rental: [
      { label: 'Landlord Name', key: 'landlord', placeholder: 'Full name of landlord' },
      { label: 'Tenant Name', key: 'tenant', placeholder: 'Full name of tenant' },
      { label: 'Property Address', key: 'address', placeholder: 'Complete property address' },
      { label: 'Monthly Rent (₹)', key: 'rent', placeholder: 'e.g. 15000' },
      { label: 'Lease Duration', key: 'duration', placeholder: 'e.g. 11 months' },
    ],
    nda: [
      { label: 'Disclosing Party', key: 'disclosing', placeholder: 'Name of party sharing information' },
      { label: 'Receiving Party', key: 'receiving', placeholder: 'Name of party receiving information' },
      { label: 'Purpose', key: 'purpose', placeholder: 'Purpose of disclosure' },
      { label: 'Duration', key: 'duration', placeholder: 'e.g. 2 years' },
    ],
    employment: [
      { label: 'Employer/Company', key: 'employer', placeholder: 'Company name' },
      { label: 'Employee Name', key: 'employee', placeholder: 'Employee full name' },
      { label: 'Position/Designation', key: 'position', placeholder: 'Job title' },
      { label: 'Monthly Salary (₹)', key: 'salary', placeholder: 'e.g. 50000' },
      { label: 'Joining Date', key: 'date', placeholder: 'e.g. 01 May 2026' },
    ],
    affidavit: [
      { label: 'Deponent Name', key: 'deponent', placeholder: 'Name of person making statement' },
      { label: 'Age', key: 'age', placeholder: 'Age of deponent' },
      { label: 'Statement Purpose', key: 'purpose', placeholder: 'Reason for affidavit' },
      { label: 'Key Facts', key: 'facts', placeholder: 'Main facts to declare' },
    ],
    poa: [
      { label: 'Principal Name', key: 'principal', placeholder: 'Person granting power' },
      { label: 'Agent Name', key: 'agent', placeholder: 'Person receiving power' },
      { label: 'Scope of Authority', key: 'scope', placeholder: 'What actions are authorized' },
      { label: 'Validity Period', key: 'validity', placeholder: 'e.g. 1 year from date' },
    ],
    complaint: [
      { label: 'Complainant Name', key: 'complainant', placeholder: 'Your full name' },
      { label: 'Respondent/Accused', key: 'respondent', placeholder: 'Name of accused/respondent' },
      { label: 'Nature of Complaint', key: 'nature', placeholder: 'Type of complaint' },
      { label: 'Incident Description', key: 'incident', placeholder: 'Describe what happened' },
      { label: 'Relief Sought', key: 'relief', placeholder: 'What remedy do you want' },
    ],
  };

  const generateDocument = async () => {
    if (!selected) return;
    setLoading(true);

    const template = templates.find(t => t.id === selected);
    const fields = Object.entries(formData).map(([k, v]) => `${k}: ${v}`).join('\n');

    const prompt = `Generate a professional legal document in India for: ${template?.name}

Details provided:
${fields}

Please generate a complete, formal legal document with:
1. Proper headings and structure
2. Legal clauses appropriate for Indian law
3. Signature blocks
4. Date and place fields
5. All necessary legal language

Format it as a complete, ready-to-use document.`;

    try {
      const result = await sendChatMessage([], prompt);
      setGenerated(result);
    } catch {
      setGenerated('Error generating document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="docs-page">
        <div className="docs-header">
          <h1>📄 Document Helper</h1>
          <p>Generate legal documents using AI • Indian Law Compliant</p>
        </div>

        <div className="templates-grid">
          {templates.map(t => (
            <div
              key={t.id}
              className={`template-card ${selected === t.id ? 'selected' : ''}`}
              onClick={() => { setSelected(t.id); setGenerated(''); setFormData({}); }}
            >
              <span className="template-icon">{t.icon}</span>
              <div>
                <p className="template-name">{t.name}</p>
                <p className="template-desc">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="doc-form-section fade-in">
            <h2>{templates.find(t => t.id === selected)?.icon} {templates.find(t => t.id === selected)?.name}</h2>
            <div className="doc-form">
              {templateForms[selected]?.map(field => (
                <div key={field.key} className="doc-field">
                  <label>{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
              <button className="generate-btn" onClick={generateDocument} disabled={loading}>
                {loading ? '⏳ Generating...' : '✨ Generate Document'}
              </button>
            </div>
          </div>
        )}

        {generated && (
          <div className="generated-doc fade-in">
            <div className="gen-header">
              <h3>📄 Generated Document</h3>
              <div className="gen-actions">
                <button className="gen-btn" onClick={() => navigator.clipboard.writeText(generated)}>📋 Copy</button>
                <button className="gen-btn" onClick={() => {
                  const blob = new Blob([generated], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'legal-document.txt'; a.click();
                }}>⬇️ Download</button>
              </div>
            </div>
            <div className="gen-content">
              {generated.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('#') ? 'gen-heading' : ''}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DocumentsPage;
