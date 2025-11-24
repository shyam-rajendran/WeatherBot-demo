export default function ChatMessage({ role, text }) {
  const isUser = role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '0.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          backgroundColor: isUser ? '#2563eb' : '#e5e7eb',
          color: isUser ? 'white' : 'black',
          whiteSpace: 'pre-wrap',
          fontSize: '0.95rem',
        }}
      >
        {text}
      </div>
    </div>
  );
}
