import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import { useReactToPrint } from 'react-to-print';

const TABS = [
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'summary', label: 'Summary', icon: '💡' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'template', label: 'Template', icon: '🎨' },
];

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, upgrade } = useAuth();
  const [resume, setResume] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const printRef = useRef();

  useEffect(() => { loadResume(); }, [id]);

  const loadResume = async () => {
    try {
      const { data } = await API.get(`/resumes/${id}`);
      setResume(data);
    } catch { toast.error('Could not load resume'); }
  };

  const update = (field, value) => setResume(prev => ({ ...prev, [field]: value }));
  const updatePersonal = (field, value) => setResume(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));

  const save = async () => {
    setSaving(true);
    try {
      await API.put(`/resumes/${id}`, resume);
      toast.success('Saved!');
    } catch { toast.error('Save failed'); }
    setSaving(false);
  };

  const handleUpgrade = async () => {
    await upgrade();
    toast.success('🎉 Upgraded to Premium!');
  };

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const aiGenerate = async (type, context) => {
    if (!context || context.trim() === '') {
      toast.error('Please fill in some details first before using AI');
      return;
    }
    setAiLoading(type);
    try {
      const { data } = await API.post('/ai/generate', { type, context });
      if (type === 'summary') update('summary', data.result);
      else if (type === 'skills') update('skills', data.result.split(',').map(s => s.trim()).filter(Boolean));
      toast.success('✨ AI generated!');
    } catch (err) {
      toast.error('AI failed: ' + (err.response?.data?.message || err.message));
    }
    setAiLoading(false);
  };

  const addExp = () => update('experience', [...(resume.experience || []), { company: '', position: '', startDate: '', endDate: '', current: false, description: '' }]);
  const updateExp = (i, field, val) => { const e = [...resume.experience]; e[i][field] = val; update('experience', e); };
  const removeExp = (i) => update('experience', resume.experience.filter((_, idx) => idx !== i));

  const addEdu = () => update('education', [...(resume.education || []), { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }]);
  const updateEdu = (i, field, val) => { const e = [...resume.education]; e[i][field] = val; update('education', e); };
  const removeEdu = (i) => update('education', resume.education.filter((_, idx) => idx !== i));

  const addProject = () => update('projects', [...(resume.projects || []), { name: '', description: '', technologies: '', link: '' }]);
  const updateProj = (i, field, val) => { const p = [...resume.projects]; p[i][field] = val; update('projects', p); };
  const removeProj = (i) => update('projects', resume.projects.filter((_, idx) => idx !== i));

  if (!resume) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
      Loading...
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'DM Sans', sans-serif; }

        .editor-root { display: flex; flex-direction: column; height: 100vh; background: #0a0a0f; }

        .editor-topbar {
          height: 60px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          flex-shrink: 0;
          backdrop-filter: blur(20px);
        }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .back-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
          padding: 7px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          transition: all 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .title-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #fff;
          padding: 7px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          outline: none;
          width: 220px;
        }
        .title-input:focus { border-color: rgba(99,102,241,0.5); }
        .topbar-right { display: flex; gap: 8px; }

        .save-btn {
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.4);
          color: #818cf8;
          padding: 8px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .save-btn:hover { background: rgba(99,102,241,0.3); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .pdf-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          color: #fff;
          padding: 8px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .pdf-btn:hover { opacity: 0.85; transform: translateY(-1px); }

        .preview-btn-top {
          background: rgba(236,72,153,0.15);
          border: 1px solid rgba(236,72,153,0.3);
          color: #f472b6;
          padding: 8px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .preview-btn-top:hover { background: rgba(236,72,153,0.25); }

        .editor-body { display: flex; flex: 1; overflow: hidden; }

        .editor-left {
          width: 360px;
          background: #0d0d14;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }

        .tabs-bar {
          display: flex;
          overflow-x: auto;
          padding: 8px 8px 0;
          gap: 2px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          scrollbar-width: none;
        }
        .tabs-bar::-webkit-scrollbar { display: none; }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 12px;
          border: none;
          background: transparent;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          white-space: nowrap;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }
        .tab-btn.active { color: #818cf8; border-bottom-color: #6366f1; background: rgba(99,102,241,0.08); }
        .tab-btn:hover:not(.active) { color: #94a3b8; background: rgba(255,255,255,0.04); }

        .panel { padding: 20px; overflow-y: auto; flex: 1; }
        .panel::-webkit-scrollbar { width: 4px; }
        .panel::-webkit-scrollbar-track { background: transparent; }
        .panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        .panel-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 20px; }

        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px; }
        .field input, .field textarea {
          width: 100%;
          padding: 10px 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
          resize: vertical;
        }
        .field input:focus, .field textarea:focus { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.05); }
        .field input::placeholder, .field textarea::placeholder { color: #2d3748; }

        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .add-btn {
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .add-btn:hover { background: rgba(99,102,241,0.25); }

        .item-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }
        .item-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .item-num { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
        .remove-btn { background: none; border: none; color: #475569; cursor: pointer; font-size: 16px; padding: 2px 6px; border-radius: 6px; transition: all 0.2s; }
        .remove-btn:hover { color: #f87171; background: rgba(239,68,68,0.1); }

        .checkbox-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .checkbox-row input { width: auto; }
        .checkbox-row label { font-size: 12px; color: #64748b; text-transform: none; letter-spacing: 0; margin: 0; }

        .ai-btn {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2));
          border: 1px solid rgba(139,92,246,0.3);
          color: #a78bfa;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          margin-top: 10px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .ai-btn:hover { background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.3)); }
        .ai-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .ai-btn-sm {
          padding: 7px 12px;
          background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.15));
          border: 1px solid rgba(139,92,246,0.25);
          color: #a78bfa;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .ai-btn-sm:hover { background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.25)); }
        .ai-btn-sm:disabled { opacity: 0.5; cursor: not-allowed; }

        .editor-right {
          flex: 1;
          background: #111118;
          overflow-y: auto;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .preview-label { font-size: 11px; font-weight: 600; color: #334155; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; align-self: flex-start; }
        .preview-paper {
          background: #fff;
          width: 100%;
          max-width: 800px;
          min-height: 1000px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          border-radius: 4px;
        }
      `}</style>

      <div className="editor-root">
        <div className="editor-topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
            <input className="title-input" value={resume.title} onChange={e => update('title', e.target.value)} placeholder="Resume Title" />
          </div>
          <div className="topbar-right">
            <button className="preview-btn-top" onClick={() => navigate(`/preview/${id}`)}>👁 Preview</button>
            <button className="save-btn" onClick={save} disabled={saving}>{saving ? '⏳ Saving...' : '💾 Save'}</button>
            <button className="pdf-btn" onClick={handlePrint}>⬇️ Download PDF</button>
          </div>
        </div>

        <div className="editor-body">
          {/* Left Panel */}
          <div className="editor-left">
            <div className="tabs-bar">
              {TABS.map(t => (
                <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            <div className="panel">
              {/* PERSONAL */}
              {activeTab === 'personal' && (
                <div>
                  <div className="panel-title">Personal Information</div>
                  {[['fullName','Full Name'],['email','Email Address'],['phone','Phone Number'],['location','Location'],['linkedin','LinkedIn URL'],['website','Website / Portfolio']].map(([f, ph]) => (
                    <div className="field" key={f}>
                      <label>{ph}</label>
                      <input placeholder={ph} value={resume.personalInfo?.[f] || ''} onChange={e => updatePersonal(f, e.target.value)} />
                    </div>
                  ))}
                </div>
              )}

              {/* SUMMARY */}
              {activeTab === 'summary' && (
                <div>
                  <div className="panel-title">Professional Summary</div>
                  <div className="field">
                    <label>Summary</label>
                    <textarea rows={6} placeholder="Write a compelling summary about yourself..." value={resume.summary || ''} onChange={e => update('summary', e.target.value)} />
                  </div>
                  <button className="ai-btn" disabled={aiLoading === 'summary'}
                    onClick={() => aiGenerate('summary', `Name: ${resume.personalInfo?.fullName || 'Professional'}, Skills: ${(resume.skills || []).join(', ')}, Role: ${resume.experience?.[0]?.position || 'Software Developer'}`)}>
                    {aiLoading === 'summary' ? '⏳ Generating...' : '✨ AI Generate Summary'}
                  </button>
                </div>
              )}

              {/* EXPERIENCE */}
              {activeTab === 'experience' && (
                <div>
                  <div className="section-header">
                    <div className="panel-title" style={{ margin: 0 }}>Experience</div>
                    <button className="add-btn" onClick={addExp}>+ Add</button>
                  </div>
                  {(resume.experience || []).map((e, i) => (
                    <div className="item-card" key={i}>
                      <div className="item-card-header">
                        <span className="item-num">Position #{i + 1}</span>
                        <button className="remove-btn" onClick={() => removeExp(i)}>✕</button>
                      </div>
                      {[['position','Job Title'],['company','Company'],['startDate','Start Date'],['endDate','End Date']].map(([f, ph]) => (
                        <div className="field" key={f}>
                          <label>{ph}</label>
                          <input placeholder={ph} value={e[f] || ''} onChange={ev => updateExp(i, f, ev.target.value)} />
                        </div>
                      ))}
                      <div className="checkbox-row">
                        <input type="checkbox" checked={e.current || false} onChange={ev => updateExp(i, 'current', ev.target.checked)} />
                        <label>Currently working here</label>
                      </div>
                      <div className="field">
                        <label>Description</label>
                        <textarea rows={4} placeholder="Describe your responsibilities and achievements..." value={e.description || ''} onChange={ev => updateExp(i, 'description', ev.target.value)} />
                      </div>
                      <button className="ai-btn-sm" disabled={aiLoading === `exp${i}`}
                        onClick={async () => {
                          const ctx = e.description || `${e.position || 'Developer'} at ${e.company || 'Company'}`;
                          setAiLoading(`exp${i}`);
                          try {
                            const { data } = await API.post('/ai/generate', { type: 'experience', context: ctx });
                            updateExp(i, 'description', data.result);
                            toast.success('✨ Improved!');
                          } catch (err) { toast.error('AI failed'); }
                          setAiLoading(false);
                        }}>
                        {aiLoading === `exp${i}` ? '⏳ Improving...' : '✨ AI Improve'}
                      </button>
                    </div>
                  ))}
                  {(resume.experience || []).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#334155', fontSize: 13 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>💼</div>
                      <div>No experience added yet</div>
                    </div>
                  )}
                </div>
              )}

              {/* EDUCATION */}
              {activeTab === 'education' && (
                <div>
                  <div className="section-header">
                    <div className="panel-title" style={{ margin: 0 }}>Education</div>
                    <button className="add-btn" onClick={addEdu}>+ Add</button>
                  </div>
                  {(resume.education || []).map((e, i) => (
                    <div className="item-card" key={i}>
                      <div className="item-card-header">
                        <span className="item-num">Education #{i + 1}</span>
                        <button className="remove-btn" onClick={() => removeEdu(i)}>✕</button>
                      </div>
                      {[['school','University / School'],['degree','Degree'],['field','Field of Study'],['startDate','Start Year'],['endDate','End Year'],['gpa','GPA (optional)']].map(([f, ph]) => (
                        <div className="field" key={f}>
                          <label>{ph}</label>
                          <input placeholder={ph} value={e[f] || ''} onChange={ev => updateEdu(i, f, ev.target.value)} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* SKILLS */}
              {activeTab === 'skills' && (
                <div>
                  <div className="panel-title">Skills</div>
                  <SkillsInput skills={resume.skills || []} onChange={s => update('skills', s)} />
                  <button className="ai-btn" disabled={aiLoading === 'skills'}
                    onClick={() => aiGenerate('skills', `${resume.personalInfo?.fullName || 'Professional'}, ${resume.experience?.[0]?.position || 'Software Developer'}, ${resume.experience?.[0]?.company || ''}`)}>
                    {aiLoading === 'skills' ? '⏳ Suggesting...' : '✨ AI Suggest Skills'}
                  </button>
                </div>
              )}

              {/* PROJECTS */}
              {activeTab === 'projects' && (
                <div>
                  <div className="section-header">
                    <div className="panel-title" style={{ margin: 0 }}>Projects</div>
                    <button className="add-btn" onClick={addProject}>+ Add</button>
                  </div>
                  {(resume.projects || []).map((p, i) => (
                    <div className="item-card" key={i}>
                      <div className="item-card-header">
                        <span className="item-num">Project #{i + 1}</span>
                        <button className="remove-btn" onClick={() => removeProj(i)}>✕</button>
                      </div>
                      {[['name','Project Name'],['technologies','Tech Stack'],['link','Link (optional)']].map(([f, ph]) => (
                        <div className="field" key={f}>
                          <label>{ph}</label>
                          <input placeholder={ph} value={p[f] || ''} onChange={ev => updateProj(i, f, ev.target.value)} />
                        </div>
                      ))}
                      <div className="field">
                        <label>Description</label>
                        <textarea rows={3} value={p.description || ''} onChange={ev => updateProj(i, 'description', ev.target.value)} placeholder="What did you build?" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TEMPLATE */}
              {activeTab === 'template' && (
                <TemplateSelector selected={resume.templateId} onSelect={t => update('templateId', t)} onUpgrade={handleUpgrade} />
              )}
            </div>
          </div>

          {/* Right Preview */}
          <div className="editor-right">
            <div className="preview-label">Live Preview</div>
            <div className="preview-paper" ref={printRef}>
              <ResumePreview resume={resume} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SkillsInput({ skills, onChange }) {
  const [input, setInput] = useState('');
  const add = () => { if (input.trim() && !skills.includes(input.trim())) { onChange([...skills, input.trim()]); setInput(''); } };
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
          style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0', fontFamily: 'DM Sans,sans-serif', fontSize: 13, outline: 'none' }}
          placeholder="Type a skill, press Enter" />
        <button onClick={add} style={{ padding: '10px 16px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Add</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.map((s, i) => (
          <span key={i} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8', padding: '5px 12px', borderRadius: 100, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            {s}
            <span onClick={() => onChange(skills.filter((_, idx) => idx !== i))} style={{ cursor: 'pointer', opacity: 0.6, fontSize: 14 }}>×</span>
          </span>
        ))}
        {skills.length === 0 && <p style={{ color: '#334155', fontSize: 13 }}>No skills added yet</p>}
      </div>
    </div>
  );
}