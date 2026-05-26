import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOTAL_STEPS = 5;

const ID_TYPES    = ['National ID', 'Passport', "Driver's License"];
const COURSES     = ['BSc Computer Science', 'MBA', 'BBA Finance', 'MSc Data Science', 'Diploma in Law'];

function ProgressBar({ step }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-3)' }}>Step {step} of {TOTAL_STEPS}</span>
        <span style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600 }}>
          {Math.round((step / TOTAL_STEPS) * 100)}% complete
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 10,
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
          width: `${(step / TOTAL_STEPS) * 100}%`,
          transition: 'width 0.35s ease',
        }} />
      </div>
      {/* Step dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i < step ? 'var(--color-primary)' : i === step - 1 ? 'var(--color-accent)' : 'var(--color-border)',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── Step components ── */

function Step1({ data, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label className="form-label">Full name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
        <input className="form-input" value={data.name} onChange={e => set('name', e.target.value)} placeholder="Your full legal name" required />
      </div>
      <div>
        <label className="form-label">Email address</label>
        <input className="form-input" value={data.email} readOnly style={{ background: 'var(--color-surface)', color: 'var(--color-text-3)' }} />
      </div>
      <div>
        <label className="form-label">Phone number</label>
        <input className="form-input" value={data.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" type="tel" />
      </div>
    </div>
  );
}

function Step2({ data, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label className="form-label">ID Type <span style={{ color: 'var(--color-danger)' }}>*</span></label>
        <select className="form-input" value={data.idType} onChange={e => set('idType', e.target.value)}>
          <option value="">Select ID type…</option>
          {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">ID Number <span style={{ color: 'var(--color-danger)' }}>*</span></label>
        <input className="form-input" value={data.idNumber} onChange={e => set('idNumber', e.target.value)} placeholder="Enter your ID number" />
      </div>
      <div style={{ background: 'rgba(217,64,64,0.08)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'var(--color-danger)' }}>
        ⚠️ KYC verification is required within 7 days of enrollment.
      </div>
    </div>
  );
}

function Step3({ data, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label className="form-label">Enrolled Course</label>
        <select className="form-input" value={data.course} onChange={e => set('course', e.target.value)}>
          <option value="">Select your course…</option>
          {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Enrollment Date</label>
        <input className="form-input" type="date" value={data.enrollDate} onChange={e => set('enrollDate', e.target.value)} />
      </div>
      <div>
        <label className="form-label" style={{ marginBottom: 10 }}>Refund Eligibility</label>
        <div style={{ display: 'flex', gap: 12 }}>
          {['Yes', 'No'].map(v => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="radio"
                name="refund"
                value={v}
                checked={data.refundEligible === v}
                onChange={() => set('refundEligible', v)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span style={{ fontSize: 14 }}>{v}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4({ data, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label className="form-label">Profile Photo</label>
        <div style={{
          border: '2px dashed var(--color-border)', borderRadius: 10, padding: '28px 20px',
          textAlign: 'center', background: 'var(--color-surface)',
        }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>📸</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 12 }}>Upload your profile photo</p>
          <input type="file" accept="image/*" onChange={e => set('photo', e.target.files?.[0])} />
        </div>
        {data.photo && <p style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 6 }}>✅ {data.photo.name}</p>}
      </div>
      <div>
        <label className="form-label">Supporting Document <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>(PDF, max 5MB)</span></label>
        <div style={{
          border: '2px dashed var(--color-border)', borderRadius: 10, padding: '28px 20px',
          textAlign: 'center', background: 'var(--color-surface)',
        }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>📄</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 12 }}>Upload supporting document</p>
          <input type="file" accept=".pdf" onChange={e => set('document', e.target.files?.[0])} />
        </div>
        {data.document && <p style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 6 }}>✅ {data.document.name}</p>}
      </div>
    </div>
  );
}

function Step5({ data, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 10, padding: '16px 20px',
      }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-1)', marginBottom: 2 }}>Are you an expert?</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-3)' }}>Verified experts get special badges and earn +20 Spark per answer</p>
        </div>
        <button
          type="button"
          onClick={() => set('isExpert', !data.isExpert)}
          style={{
            width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
            background: data.isExpert ? 'var(--color-accent)' : 'var(--color-border)',
            position: 'relative', transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute', top: 3, borderRadius: '50%',
            width: 20, height: 20, background: '#fff',
            transition: 'left 0.2s', left: data.isExpert ? 24 : 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </button>
      </div>

      {data.isExpert && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '16px', background: 'rgba(232,160,32,0.07)', borderRadius: 10, border: '1px solid rgba(232,160,32,0.3)' }}>
          <div>
            <label className="form-label">Your Specialty</label>
            <input className="form-input" value={data.specialty} onChange={e => set('specialty', e.target.value)} placeholder="e.g. Cardiology, Corporate Law, Data Science…" />
          </div>
          <div>
            <label className="form-label">Credentials / Certifications</label>
            <input type="file" accept=".pdf,image/*" onChange={e => set('credentials', e.target.files?.[0])} style={{ fontSize: 13 }} />
            {data.credentials && <p style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 4 }}>✅ {data.credentials.name}</p>}
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(26,39,68,0.04)', borderRadius: 10, padding: '16px 20px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Review & Confirm</p>
        <p style={{ fontSize: 13, color: 'var(--color-text-3)', lineHeight: 1.7 }}>
          By clicking "Confirm & Submit", you agree to our Terms of Service and Privacy Policy.
          Your information will only be used for verification purposes.
        </p>
      </div>
    </div>
  );
}

const STEP_TITLES = [
  'About You',
  'KYC / Verification',
  'Course & Refund Info',
  'File Platform',
  'Expert Consultation',
];

const STEP_ICONS = ['👤', '🪪', '📚', '📁', '🎓'];

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [step,   setStep]   = useState(1);
  const [data,   setData]   = useState({
    name: '', email: 'user@university.edu', phone: '',
    idType: '', idNumber: '',
    course: '', enrollDate: '', refundEligible: '',
    photo: null, document: null,
    isExpert: false, specialty: '', credentials: null,
  });

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const next = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else {
      // Submit
      setTimeout(() => navigate('/feed'), 500);
    }
  };
  const back = () => { if (step > 1) setStep(s => s - 1); };

  const stepProps = { data, set };

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(135deg, var(--color-primary) 0%, #243360 100%)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '32px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#fff' }}>
            ⚡ FAQ Portal
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
            Complete your profile to get started
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '32px 32px 24px' }}>
          <ProgressBar step={step} />

          {/* Step header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, fontSize: 20,
              background: 'rgba(26,39,68,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {STEP_ICONS[step - 1]}
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Step {step}
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
                {STEP_TITLES[step - 1]}
              </h2>
            </div>
          </div>

          {/* Step content */}
          {step === 1 && <Step1 {...stepProps} />}
          {step === 2 && <Step2 {...stepProps} />}
          {step === 3 && <Step3 {...stepProps} />}
          {step === 4 && <Step4 {...stepProps} />}
          {step === 5 && <Step5 {...stepProps} />}

          {/* Navigation */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--color-border)',
          }}>
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="btn-ghost"
              style={{ opacity: step === 1 ? 0.4 : 1 }}
            >
              ← Back
            </button>
            <button type="button" onClick={next} className="btn-primary">
              {step === TOTAL_STEPS ? '✓ Confirm & Submit' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
