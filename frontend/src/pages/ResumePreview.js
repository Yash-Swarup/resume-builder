export default function ResumePreview({ resume }) {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], projects = [], templateId } = resume;

  if (templateId === 'template2') return <Template2 resume={resume} />;
  if (templateId === 'template3') return <Template3 resume={resume} />;
  return <Template1 resume={resume} />;
}

function Template1({ resume }) {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [] } = resume;
  return (
    <div style={{ fontFamily: 'Georgia, serif', padding: 40, fontSize: 13, lineHeight: 1.6, color: '#1e293b' }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #2563eb', paddingBottom: 16, marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 26, color: '#1e293b' }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ margin: '6px 0 0', color: '#64748b' }}>{[p.email, p.phone, p.location].filter(Boolean).join(' | ')}</p>
      </div>
      {summary && <Section title="Summary"><p style={{ margin: 0 }}>{summary}</p></Section>}
      {experience.length > 0 && <Section title="Experience">{experience.map((e, i) => <ExpItem key={i} item={e} />)}</Section>}
      {education.length > 0 && <Section title="Education">{education.map((e, i) => <EduItem key={i} item={e} />)}</Section>}
      {skills.length > 0 && <Section title="Skills"><p style={{ margin: 0 }}>{skills.join(', ')}</p></Section>}
    </div>
  );
}

function Template2({ resume }) {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], projects = [] } = resume;
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', fontSize: 12, minHeight: 700 }}>
      <div style={{ width: 220, background: '#16a34a', color: 'white', padding: 24, flexShrink: 0 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18 }}>{p.fullName || 'Your Name'}</h2>
        <p style={{ margin: '0 0 20px', fontSize: 11, opacity: 0.8 }}>{p.email}</p>
        <p style={{ margin: '0 0 4px', fontSize: 11 }}>{p.phone}</p>
        <p style={{ margin: '0 0 20px', fontSize: 11 }}>{p.location}</p>
        {skills.length > 0 && <><h4 style={{ margin: '0 0 8px', textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 }}>Skills</h4>{skills.map((s, i) => <div key={i} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 4, padding: '3px 8px', marginBottom: 4, fontSize: 11 }}>{s}</div>)}</>}
      </div>
      <div style={{ flex: 1, padding: 24 }}>
        {summary && <><h3 style={{ color: '#16a34a', margin: '0 0 8px', fontSize: 13 }}>ABOUT</h3><p style={{ margin: '0 0 20px' }}>{summary}</p></>}
        {experience.length > 0 && <><h3 style={{ color: '#16a34a', margin: '0 0 8px', fontSize: 13 }}>EXPERIENCE</h3>{experience.map((e, i) => <ExpItem key={i} item={e} />)}</>}
        {education.length > 0 && <><h3 style={{ color: '#16a34a', margin: '0 0 12px', fontSize: 13 }}>EDUCATION</h3>{education.map((e, i) => <EduItem key={i} item={e} />)}</>}
      </div>
    </div>
  );
}

function Template3({ resume }) {
  const { personalInfo: p = {}, summary, experience = [], education = [], skills = [], projects = [] } = resume;
  return (
    <div style={{ fontFamily: "'Trebuchet MS', sans-serif", fontSize: 13 }}>
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', padding: '32px 40px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ margin: '8px 0 0', opacity: 0.9 }}>{[p.email, p.phone, p.location].filter(Boolean).join(' · ')}</p>
      </div>
      <div style={{ padding: '24px 40px' }}>
        {summary && <Section title="Profile" color="#7c3aed"><p style={{ margin: 0 }}>{summary}</p></Section>}
        {experience.length > 0 && <Section title="Experience" color="#7c3aed">{experience.map((e, i) => <ExpItem key={i} item={e} />)}</Section>}
        {education.length > 0 && <Section title="Education" color="#7c3aed">{education.map((e, i) => <EduItem key={i} item={e} />)}</Section>}
        {skills.length > 0 && <Section title="Skills" color="#7c3aed"><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{skills.map((s, i) => <span key={i} style={{ background: '#ede9fe', color: '#7c3aed', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{s}</span>)}</div></Section>}
        {projects.length > 0 && <Section title="Projects" color="#7c3aed">{projects.map((pr, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong>{pr.name}</strong> {pr.technologies && <span style={{ color: '#7c3aed', fontSize: 12 }}>({pr.technologies})</span>}
            <p style={{ margin: '4px 0 0', color: '#64748b' }}>{pr.description}</p>
          </div>
        ))}</Section>}
      </div>
    </div>
  );
}

function Section({ title, children, color = '#2563eb' }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ margin: '0 0 10px', color, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, borderBottom: `1px solid ${color}30`, paddingBottom: 4 }}>{title}</h3>
      {children}
    </div>
  );
}

function ExpItem({ item: e }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{e.position}</strong>
        <span style={{ color: '#64748b', fontSize: 12 }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
      </div>
      <div style={{ color: '#4b5563', fontSize: 12 }}>{e.company}</div>
      {e.description && <p style={{ margin: '4px 0 0', color: '#374151' }}>{e.description}</p>}
    </div>
  );
}

function EduItem({ item: e }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{e.degree} {e.field && `in ${e.field}`}</strong>
        <span style={{ color: '#64748b', fontSize: 12 }}>{e.startDate} – {e.endDate}</span>
      </div>
      <div style={{ color: '#4b5563', fontSize: 12 }}>{e.school}</div>
    </div>
  );
}