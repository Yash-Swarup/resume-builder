import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';
import ResumePreview from './ResumePreview';
import { useReactToPrint } from 'react-to-print';

export default function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    API.get(`/resumes/${id}`)
      .then(({ data }) => setResume(data))
      .catch(() => toast.error('Could not load resume'));
  }, [id]);

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  if (!resume) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'DM Sans,sans-serif', fontSize: 15 }}>
      Loading preview...
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0a0a0f; }

        .preview-root { min-height: 100vh; background: #0a0a0f; display: flex; flex-direction: column; }

        .preview-bar {
          height: 60px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(20px);
        }

        .bar-left { display: flex; align-items: center; gap: 12px; }
        .bar-title { font-size: 15px; font-weight: 600; color: '#fff'; color: #fff; }
        .bar-sub { font-size: 12px; color: #475569; }
        .bar-right { display: flex; gap: 8px; }

        .btn-back {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-back:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .btn-edit {
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-edit:hover { background: rgba(99,102,241,0.25); }

        .btn-pdf {
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          color: #fff;
          padding: 8px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.2s;
        }
        .btn-pdf:hover { opacity: 0.85; transform: translateY(-1px); }

        .preview-stage {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 40px 32px 60px;
          overflow-y: auto;
        }

        .preview-paper {
          background: #fff;
          width: 100%;
          max-width: 850px;
          min-height: 1100px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
          border-radius: 4px;
          animation: fadeUp 0.4s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media print {
          .preview-bar { display: none; }
          .preview-stage { padding: 0; }
          .preview-paper { box-shadow: none; max-width: 100%; }
        }
      `}</style>

      <div className="preview-root">
        <div className="preview-bar">
          <div className="bar-left">
            <div>
              <div className="bar-title">{resume.title || 'Resume'}</div>
              <div className="bar-sub">Full Preview</div>
            </div>
          </div>
          <div className="bar-right">
            <button className="btn-back" onClick={() => navigate('/dashboard')}>← Dashboard</button>
            <button className="btn-edit" onClick={() => navigate(`/editor/${id}`)}>✏️ Edit</button>
            <button className="btn-pdf" onClick={handlePrint}>⬇️ Download PDF</button>
          </div>
        </div>

        <div className="preview-stage">
          <div className="preview-paper" ref={printRef}>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </>
  );
}