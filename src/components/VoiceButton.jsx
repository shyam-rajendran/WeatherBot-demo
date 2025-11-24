// src/components/VoiceButton.jsx
export default function VoiceButton({ isSupported, isListening, onClick }) {
  if (!isSupported) {
    return (
      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
        🎤 Voice input not supported in this browser.
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '88px',
        height: '88px',
        borderRadius: '50%',
        border: '2px solid #4b5563',
        backgroundColor: isListening ? '#22c55e' : '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
        cursor: 'pointer',
        outline: 'none',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease',
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(2px) scale(0.97)';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.35)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.45)';
      }}
    >
      <span
        style={{
          fontSize: '2rem',
          color: isListening ? '#052e16' : '#111827',
        }}
      >
        🎙️
      </span>
    </button>
  );
}
