import { templates } from '../utils/templates';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function TemplateSelector({ selected, onSelect, onUpgrade }) {
  const { user } = useAuth();

  const handleSelect = (t) => {
    if (t.isPaid && !user?.isPremium) {
      toast('Upgrade to unlock premium templates', { icon: '⭐' });
      return;
    }
    onSelect(t.id);
  };

  return (
    <div>
      <div style={{ fontFamily:'DM Sans,sans-serif' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Choose Template</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {templates.map(t => (
            <div key={t.id} onClick={() => handleSelect(t)}
              style={{
                background: selected === t.id ? `${t.color}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selected === t.id ? t.color + '60' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 14,
                padding: 16,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 56,
                  background: `${t.color}22`,
                  border: `1px solid ${t.color}40`,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <div style={{ width: 28, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ height: 3, borderRadius: 2, background: t.color, width: '100%' }} />
                    <div style={{ height: 2, borderRadius: 2, background: t.color, width: '70%', opacity: 0.5 }} />
                    <div style={{ height: 2, borderRadius: 2, background: '#fff', width: '100%', opacity: 0.15, marginTop: 2 }} />
                    <div style={{ height: 2, borderRadius: 2, background: '#fff', width: '80%', opacity: 0.1 }} />
                    <div style={{ height: 2, borderRadius: 2, background: '#fff', width: '90%', opacity: 0.1 }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.4 }}>{t.description}</div>
                </div>
              </div>

              {selected === t.id && (
                <div style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, background: t.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700 }}>✓</div>
              )}
              {t.isPaid && selected !== t.id && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: user?.isPremium ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.07)', color: user?.isPremium ? '#f59e0b' : '#475569', padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, border: `1px solid ${user?.isPremium ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  {user?.isPremium ? '⭐ UNLOCKED' : '🔒 PREMIUM'}
                </div>
              )}
            </div>
          ))}
        </div>

        {!user?.isPremium && (
          <button onClick={onUpgrade}
            style={{ width: '100%', marginTop: 16, padding: '13px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: 0.3 }}>
            ⭐ Upgrade to Premium — Free Demo
          </button>
        )}
      </div>
    </div>
  );
}