import { useEffect, useState, useRef } from 'react';
import { useSpeechToText } from './hooks/useSpeechToText';
import ChatMessage from './components/ChatMessage';
import VoiceButton from './components/VoiceButton';

function App() {
  
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  

  const {
    isSupported,
    isListening,
    transcript,
    error: speechError,
    start,
    stop,
  } = useSpeechToText();

  
  useEffect(() => {
    if (transcript) {
      setCity(transcript);
    }
  }, [transcript]);

  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const handleSubmit = async (cityOverride) => {
    const targetCity = (cityOverride || city || '').trim();
    if (!targetCity) return;

    setError('');
    setWeather(null);
    setLoadingWeather(true);
    setLoadingAI(false);

    addMessage('user', `Query: ${targetCity}`);

    try {
      // Weather (with Gemini city extraction in backend)
      const weatherRes = await fetch(
        `/api/weather?city=${encodeURIComponent(targetCity)}`
      );
      const weatherData = await weatherRes.json();

      if (!weatherRes.ok) {
        throw new Error(weatherData.error || 'Weather fetch failed');
      }

      setWeather(weatherData);
      setLoadingWeather(false);
      setLoadingAI(true);

      // (Gemini 2.5)
      const suggestRes = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: weatherData.city,
          country: weatherData.country,
          weather: {
            temp: weatherData.temp,
            feels_like: weatherData.feels_like,
            description: weatherData.description,
            humidity: weatherData.humidity,
            wind_speed: weatherData.wind_speed,
          },
        }),
      });

      const suggestData = await suggestRes.json();
      if (!suggestRes.ok) {
        throw new Error(suggestData.error || 'AI suggestion failed');
      }

      addMessage('assistant', suggestData.suggestions);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
      addMessage('assistant', `Error: ${err.message || 'Something went wrong'}`);
    } finally {
      setLoadingWeather(false);
      setLoadingAI(false);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleVoiceClick = () => {
  if (isListening) {
    stop();
    return;
  }

  
  const hasLatin = /[A-Za-z]/.test(city);

  const langCode = hasLatin ? 'en-US' : 'ja-JP';
  start(langCode);
};

  return (
    <div
      style={{
        minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(to bottom right, #020617, #020617)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.5rem 0.75rem',
    overflow: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
    maxWidth: '430px',              // phone-ish width
    backgroundColor: '#1b1e2aff',
    borderRadius: '1.75rem',
    padding: '1.5rem',
    boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    margin: 'auto',

        }}
      >
        <header style={{ marginBottom: '0.1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
            Weather Activity Chatbot
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
            Speak or type in English or Japanese. I’ll figure out the city,
            check the weather, and suggest what you can do.
          </p>
        </header>

        <form
  onSubmit={onFormSubmit}
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  }}
>
  {/* Input + Go button */}
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    <input
      type="text"
      placeholder="What’s the weather in Osaka?"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      style={{
        flex: 1,
        padding: '0.6rem 0.8rem',
        borderRadius: '0.75rem',
        border: '1px solid #4b5563',
        backgroundColor: '#020617',
        color: 'white',
        fontSize: '0.9rem',
      }}
    />
    <button
      type="submit"
      style={{
        padding: '0.6rem 1.1rem',
        borderRadius: '0.75rem',
        border: '1px solid #4b5563',
        backgroundColor: '#2563eb',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '0.9rem',
      }}
    >
      Go
    </button>
  </div>

  {/* Big centered mic button */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      marginTop: '0.25rem',
      marginBottom: '0.25rem',
    }}
  >
    <VoiceButton
      isSupported={isSupported}
      isListening={isListening}
      onClick={handleVoiceClick}
    />
  </div>

  {/* Optional speech error below the mic */}
  {speechError && (
    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#f97316' }}>
      {speechError}
    </div>
  )}
</form>

        {weather && (
          <section
            style={{
              padding: '0.75rem 1rem',
      borderRadius: '1rem',
      backgroundColor: '#020617',
      border: '1px solid #374151',
      fontSize: '0.9rem',
            }}
          >
            <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
              {weather.city}, {weather.country}
            </div>
            <div>
              {weather.description} — {weather.temp}°C (feels like{' '}
              {weather.feels_like}°C)
            </div>
            <div style={{ color: '#9ca3af', marginTop: '0.25rem' }}>
              Humidity: {weather.humidity}% · Wind: {weather.wind_speed} m/s
            </div>
          </section>
        )}

        {(loadingWeather || loadingAI) && (
  <div style={{ fontSize: '0.85rem', color: '#a5b4fc' }}>
    {loadingWeather && 'Checking the skies... '}
    {loadingAI && "Cooking up weather-smart plans..."}
  </div>
)}

        {error && (
          <div style={{ color: '#f97316', fontSize: '0.9rem' }}>{error}</div>
        )}

        <section
          style={{
            flex: 1,
    borderRadius: '1.25rem',
    backgroundColor: '#020617',
    border: '1px solid #374151',
    padding: '0.75rem',
    overflowY: 'auto',
    maxHeight: '50vh',
          }}
        >
          {messages.length === 0 && (
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Try speaking: 「今大阪の天気はどうですか？」 or
              “What can I do in Tokyo today?”.
            </p>
          )}
          {messages.map((m, idx) => (
            <ChatMessage key={idx} role={m.role} text={m.text} />
          ))}
        </section>

        <footer style={{ fontSize: '0.8rem', color: '#6b7280' }}>
          
        </footer>
      </div>
    </div>
  );
}

export default App;
