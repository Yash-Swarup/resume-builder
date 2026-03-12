import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          background: #0a0a0f;
          overflow: hidden;
          position: relative;
        }

        .auth-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 80px;
          position: relative;
          z-index: 2;
        }

        .auth-right {
          width: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          position: relative;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .orb1 { width: 500px; height: 500px; background: rgba(99,102,241,0.15); top: -100px; left: -100px; }
        .orb2 { width: 400px; height: 400px; background: rgba(236,72,153,0.1); bottom: -100px; right: 200px; }
        .orb3 { width: 300px; height: 300px; background: rgba(16,185,129,0.08); top: 50%; right: -50px; }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 60px;
        }
        .brand-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          margin-bottom: 28px;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }
        .hero-title span {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 17px;
          color: #94a3b8;
          line-height: 1.7;
          max-width: 440px;
          margin-bottom: 48px;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #cbd5e1;
          font-size: 14px;
        }
        .feature-dot {
          width: 28px; height: 28px;
          background: rgba(99,102,241,0.2);
          border: 1px solid rgba(99,102,241,0.4);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .card {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(20px);
        }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: #fff;
          margin-bottom: 6px;
        }
        .card-sub {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 32px;
        }

        .toggle-row {
          display: flex;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 28px;
        }
        .toggle-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-btn.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
        }
        .toggle-btn.inactive {
          background: transparent;
          color: #64748b;
        }

        .field {
          margin-bottom: 16px;
        }
        .field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .field input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s;
        }
        .field input:focus { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.05); }
        .field input::placeholder { color: #475569; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          transition: opacity 0.2s, transform 0.1s;
          letter-spacing: 0.3px;
        }
        .submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .divider {
          text-align: center;
          color: #334155;
          font-size: 12px;
          margin: 20px 0;
          position: relative;
        }
        .divider::before, .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .divider::before { left: 0; }
        .divider::after { right: 0; }

        @media (max-width: 900px) {
          .auth-left { display: none; }
          .auth-right { width: 100%; padding: 24px; }
        }
      `}</style>

      <div className="auth-root">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-orb orb3" />

        {/* Left Hero */}
        <div className="auth-left">
          <div className="brand-logo">
            <div className="brand-icon">📄</div>
            <span className="brand-name">ResumeAI</span>
          </div>
          <div className="hero-tag">✦ AI-Powered Resume Builder</div>
          <h1 className="hero-title">
            Build resumes that<br /><span>get you hired</span>
          </h1>
          <p className="hero-desc">
            Create stunning, professional resumes in minutes with AI assistance. 
            Choose from beautiful templates and let AI write your content.
          </p>
          <div className="feature-list">
            {[['✦','3 Professional Templates'],['⚡','AI-Generated Content'],['📥','Instant PDF Download'],['🔒','Secure & Private']].map(([icon, text]) => (
              <div className="feature-item" key={text}>
                <div className="feature-dot">{icon}</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="auth-right">
          <div className="card">
            <h2 className="card-title">{isLogin ? 'Welcome back' : 'Get started'}</h2>
            <p className="card-sub">{isLogin ? 'Sign in to continue building' : 'Create your free account today'}</p>

            <div className="toggle-row">
              <button className={`toggle-btn ${isLogin ? 'active' : 'inactive'}`} onClick={() => setIsLogin(true)}>Sign In</button>
              <button className={`toggle-btn ${!isLogin ? 'active' : 'inactive'}`} onClick={() => setIsLogin(false)}>Sign Up</button>
            </div>

            {!isLogin && (
              <div className="field">
                <label>Full Name</label>
                <input placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div className="field">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>

            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? '⏳ Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
            </button>

            <div className="divider">or</div>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#475569' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}