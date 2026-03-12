import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await API.get('/resumes');
      setResumes(data);
    } catch { toast.error('Could not load resumes'); }
    setLoading(false);
  };

  const createNew = async () => {
    try {
      const { data } = await API.post('/resumes', {
        title: 'My Resume',
        templateId: 'template1',
        personalInfo: { fullName: user.name, email: user.email },
        experience: [], education: [], skills: [], projects: []
      });
      navigate(`/editor/${data._id}`);
    } catch { toast.error('Could not create resume'); }
  };

  const deleteResume = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this resume?')) return;
    await API.delete(`/resumes/${id}`);
    setResumes(resumes.filter(r => r._id !== id));
    toast.success('Deleted');
  };

  const templateColors = { template1: '#6366f1', template2: '#10b981', template3: '#f59e0b' };
  const templateNames = { template1: 'Classic', template2: 'Modern', template3: 'Executive ⭐' };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0a0f; color: #fff; margin: 0; }

        .dash-root { min-height: 100vh; background: #0a0a0f; }

        .topbar {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(20px);
        }
        .topbar-brand {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Playfair Display', serif;
          font-size: 20px; color: #fff;
        }
        .brand-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .premium-badge {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          color: #fff;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .user-name { color: #94a3b8; font-size: 14px; }
        .logout-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          transition: all 0.2s;
        }
        .logout-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .dash-body { max-width: 1100px; margin: 0 auto; padding: 48px 32px; }

        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }
        .dash-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          color: #fff;
          margin-bottom: 6px;
        }
        .dash-sub { color: #475569; font-size: 14px; }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          padding: 13px 24px;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .create-btn:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.3); }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
        }
        .stat-num { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .stat-label { font-size: 13px; color: #475569; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .resume-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
        }
        .resume-card:hover {
          border-color: rgba(99,102,241,0.4);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        }
        .card-preview {
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          position: relative;
          overflow: hidden;
        }
        .card-preview-lines {
          position: absolute;
          inset: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0.3;
        }
        .preview-line { height: 6px; border-radius: 3px; background: #fff; }
        .card-body { padding: 20px; }
        .card-title-text { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 4px; }
        .card-meta { font-size: 12px; color: #475569; margin-bottom: 16px; }
        .template-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .card-actions { display: flex; gap: 8px; }
        .action-btn {
          flex: 1;
          padding: 9px;
          border-radius: 10px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        .btn-edit { background: rgba(99,102,241,0.15); color: #818cf8; }
        .btn-edit:hover { background: rgba(99,102,241,0.25); }
        .btn-preview { background: rgba(16,185,129,0.15); color: #34d399; }
        .btn-preview:hover { background: rgba(16,185,129,0.25); }
        .btn-del { background: rgba(239,68,68,0.12); color: #f87171; width: 36px; flex: none; }
        .btn-del:hover { background: rgba(239,68,68,0.22); }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 0;
        }
        .empty-icon {
          width: 80px; height: 80px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 32px;
          margin: 0 auto 20px;
        }
        .empty-title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 8px; }
        .empty-sub { color: #475569; font-size: 14px; margin-bottom: 24px; }

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .skeleton {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          height: 280px;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>

      <div className="dash-root">
        <div className="topbar">
          <div className="topbar-brand">
            <div className="brand-icon">📄</div>
            ResumeAI
          </div>
          <div className="topbar-right">
            {user?.isPremium && <span className="premium-badge">⭐ PREMIUM</span>}
            <span className="user-name">Hi, {user?.name}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="dash-body">
          <div className="dash-header">
            <div>
              <h1 className="dash-title">My Resumes</h1>
              <p className="dash-sub">{resumes.length} resume{resumes.length !== 1 ? 's' : ''} created</p>
            </div>
            <button className="create-btn" onClick={createNew}>
              <span style={{ fontSize: 18 }}>+</span> New Resume
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-num">{resumes.length}</div>
              <div className="stat-label">Total Resumes</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{user?.isPremium ? '3' : '2'}</div>
              <div className="stat-label">Templates Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">∞</div>
              <div className="stat-label">AI Generations</div>
            </div>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1,2,3].map(i => <div key={i} className="skeleton" />)}
            </div>
          ) : (
            <div className="grid">
              {resumes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <div className="empty-title">No resumes yet</div>
                  <div className="empty-sub">Create your first resume and land your dream job</div>
                  <button className="create-btn" style={{ margin: '0 auto', display: 'inline-flex' }} onClick={createNew}>
                    + Create Your First Resume
                  </button>
                </div>
              ) : resumes.map(r => {
                const color = templateColors[r.templateId] || '#6366f1';
                return (
                  <div key={r._id} className="resume-card">
                    <div className="card-preview" style={{ background: `linear-gradient(135deg, ${color}22, ${color}11)` }}>
                      <div className="card-preview-lines">
                        <div className="preview-line" style={{ width: '60%', background: color }} />
                        <div className="preview-line" style={{ width: '40%', opacity: 0.5 }} />
                        <div className="preview-line" style={{ width: '80%', opacity: 0.3, marginTop: 8 }} />
                        <div className="preview-line" style={{ width: '70%', opacity: 0.2 }} />
                        <div className="preview-line" style={{ width: '75%', opacity: 0.2 }} />
                        <div className="preview-line" style={{ width: '65%', opacity: 0.2, marginTop: 8 }} />
                        <div className="preview-line" style={{ width: '80%', opacity: 0.15 }} />
                        <div className="preview-line" style={{ width: '55%', opacity: 0.15 }} />
                      </div>
                      <span style={{ fontSize: 36, position: 'relative', zIndex: 1 }}>📄</span>
                    </div>
                    <div className="card-body">
                      <div className="card-title-text">{r.title || 'Untitled Resume'}</div>
                      <div className="card-meta">Updated {new Date(r.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <span className="template-tag" style={{ background: `${color}22`, color: color }}>
                        {templateNames[r.templateId] || r.templateId}
                      </span>
                      <div className="card-actions">
                        <button className="action-btn btn-edit" onClick={() => navigate(`/editor/${r._id}`)}>✏️ Edit</button>
                        <button className="action-btn btn-preview" onClick={() => navigate(`/preview/${r._id}`)}>👁 Preview</button>
                        <button className="action-btn btn-del" onClick={(e) => deleteResume(r._id, e)}>🗑</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}