import React, { useState } from 'react';
import { Image, EyeOff, Send, ExternalLink, Lightbulb, Sun, Check } from 'lucide-react';
import './RaiseQueryView.css';

const RaiseQueryView = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div className="rq-subnav">
        <div className="rq-tab active">Raise a Query</div>
      </div>

      <div className="rq-content">
        <div className="rq-header">
          <h1>Raise a Query</h1>
          <p>Provide details about your grievance or request below. Our team will review it shortly.</p>
        </div>

        <div className="rq-layout">
          {/* Form Column */}
          <div className="rq-form-col">
            <div className="form-group">
              <label>Query Category</label>
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="" disabled>Select category...</option>
                <option value="Academics">Academics</option>
                <option value="Hostel">Hostel</option>
                <option value="Administration">Administration</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="form-group">
              <label>Query Title</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Briefly state your concern (e.g., Delay in Grade Upload)" 
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Detailed Description</label>
              <textarea 
                className="form-control" 
                placeholder="Provide as much detail as possible to help us resolve this quickly..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Attachments (Optional)</label>
              <div 
                className="upload-box"
                style={{ 
                  cursor: 'pointer',
                  borderColor: isDragging ? '#0b1528' : '#d1d5db',
                  background: isDragging ? '#f3f4f6' : 'transparent',
                  transition: 'all 0.2s'
                }}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setAttachedFile(e.dataTransfer.files[0].name);
                  }
                }}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachedFile(e.target.files[0].name);
                    }
                  }}
                />
                
                {attachedFile ? (
                  <>
                    <Check size={32} color="#16a34a" />
                    <h5 style={{ color: '#0b1528' }}>{attachedFile}</h5>
                    <p>Click to replace</p>
                  </>
                ) : (
                  <>
                    <Image size={32} color={isDragging ? '#0b1528' : '#9ca3af'} />
                    <h5>Click or drag and drop files here</h5>
                    <p>PDF, JPG, PNG (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            <div className="anon-box">
              <div className="anon-text">
                <h5><EyeOff size={16} color="#3b82f6" /> Raise Anonymously</h5>
                <p>Admins won't see your profile details, but resolution may take longer.</p>
              </div>
              <div 
                className="toggle-switch" 
                style={{ 
                  background: isAnonymous ? '#0b1528' : '#d1d5db',
                  cursor: 'pointer'
                }}
                onClick={() => setIsAnonymous(!isAnonymous)}
              >
                <div 
                  className="toggle-circle"
                  style={{
                    transform: isAnonymous ? 'translateX(16px)' : 'translateX(0)'
                  }}
                ></div>
              </div>
            </div>

            <div className="rq-actions">
              <button 
                className="btn-discard"
                onClick={() => {
                  setCategory('');
                  setTitle('');
                  setDescription('');
                  setAttachedFile(null);
                  setIsAnonymous(false);
                  alert("Draft discarded.");
                }}
              >
                Discard Draft
              </button>
              <button 
                className="btn-submit"
                onClick={() => {
                  if (!title || !description || !category) {
                    alert("Please fill in the Category, Title, and Description before submitting.");
                    return;
                  }
                  alert(`Query Submitted Successfully!\n\nTitle: ${title}\nCategory: ${category}\nAnonymous: ${isAnonymous ? 'Yes' : 'No'}\nAttachment: ${attachedFile || 'None'}`);
                  
                  // Reset form
                  setCategory('');
                  setTitle('');
                  setDescription('');
                  setAttachedFile(null);
                  setIsAnonymous(false);
                }}
              >
                <Send size={16} /> Submit Query
              </button>
            </div>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="rq-side-col">
            
            <div className="sim-queries-widget">
              <div className="sim-title">
                <Sun size={20} color="#f59e0b" /> Similar Queries
              </div>
              <p className="sim-desc">
                We found some queries similar to yours. Checking these might give you an instant answer.
              </p>

              <div 
                className="sim-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => alert("Opening details for: Late grade submission for CMS102")}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="sim-badge resolved">RESOLVED</span>
                  <ExternalLink size={12} color="#9ca3af" />
                </div>
                <h4>Late grade submission for CMS102</h4>
                <p>"Is there a policy for when professors don't upload final grades within..."</p>
              </div>

              <div 
                className="sim-card"
                style={{ cursor: 'pointer' }}
                onClick={() => alert("Opening details for: Portal error during course reg")}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="sim-badge progress">IN PROGRESS</span>
                  <ExternalLink size={12} color="#9ca3af" />
                </div>
                <h4>Portal error during course reg</h4>
                <p>"The portal keeps timing out when I try to add my elective..."</p>
              </div>

              <div 
                className="sim-card"
                style={{ cursor: 'pointer' }}
                onClick={() => alert("Opening details for: Hostel Wi-Fi downtime in Block B")}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="sim-badge resolved">RESOLVED</span>
                  <ExternalLink size={12} color="#9ca3af" />
                </div>
                <h4>Hostel Wi-Fi downtime in Block B</h4>
                <p>"The Wi-Fi in the second floor of Block B has been down for 3 days..."</p>
              </div>
            </div>

            <div className="pro-tip">
              <h4><Lightbulb size={16} color="#fde047" /> Pro Tip</h4>
              <p>Adding screenshots or PDF receipts usually speeds up the resolution process by up to 40%.</p>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
            </div>

          </div>
        </div>

        <div className="copy-footer" style={{ marginTop: '40px', paddingBottom: '40px', textAlign: 'center', fontSize: '11px', color: '#6b7280' }}>
          © 2026 Vicharanashala Lab Internship Hub. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default RaiseQueryView;
