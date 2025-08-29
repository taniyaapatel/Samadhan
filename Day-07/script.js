const { useState } = React;

// --- Counter Card ---
function CounterCard() {
  const [count, setCount] = useState(0);
  const [animKey, setAnimKey] = useState(0); // to retrigger the pop animation

  const bump = (next) => {
    setCount(next);
    // retrigger the animation by changing key
    setAnimKey(prev => prev + 1);
  };

  return (
    <section className="card" aria-labelledby="counter-title">
      <div className="sparkle" aria-hidden="true"></div>
      <h2 id="counter-title">Counter</h2>
      <p className="note">Increment, decrement, or reset — state updates with a tiny pop.</p>

      <div className="count-wrap">
        <div key={animKey} className="count pop" aria-live="polite" aria-atomic="true">
          {count}
        </div>
        <span className="pill" title="Quick hint">
          Tip: Double-click + / – for ±5
        </span>
      </div>

      <div className="btns">
        <button
          className="btn"
          onClick={() => bump(count + 1)}
          onDoubleClick={() => bump(count + 5)}
        >
          + Add
        </button>

        <button
          className="btn alt"
          onClick={() => bump(count - 1)}
          onDoubleClick={() => bump(count - 5)}
        >
          – Subtract
        </button>

        <button
          className="btn ghost"
          onClick={() => bump(0)}
          aria-label="Reset counter to zero"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

// --- Live Text Preview Card ---
function LivePreviewCard() {
  const [text, setText] = useState("");
  const words = text.trim().length ? text.trim().split(/\s+/).length : 0;

  return (
    <section className="card" aria-labelledby="preview-title">
      <div className="sparkle" aria-hidden="true"></div>
      <h2 id="preview-title">Live Text Preview</h2>
      <p className="note">Type below — watch state update in real-time.</p>

      <div className="input-wrap">
        <label htmlFor="live-input">Your text</label>
        <textarea
          id="live-input"
          placeholder="Write something delightful..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="btns" style={{marginTop: 6}}>
        <button className="btn" onClick={() => setText(text.toUpperCase())}>
          UPPERCASE
        </button>
        <button className="btn alt" onClick={() => setText(text.toLowerCase())}>
          lowercase
        </button>
        <button className="btn ghost" onClick={() => setText("")}>
          Clear
        </button>
      </div>

      <div className="preview" role="status" aria-live="polite">
        {text || <span style={{color: 'var(--muted)'}}>Your live preview will appear here…</span>}
      </div>

      <p className="note" style={{marginTop: 10}}>
        {text.length} characters • {words} {words === 1 ? "word" : "words"}
      </p>
    </section>
  );
}

// --- App Shell ---
function App() {
  return (
    <main className="container">
      <header className="header">
        <span className="badge">State Management • React useState</span>
        <h1 className="title">Mini Tasks: Counter + Live Text Preview</h1>
        <p className="subtitle">Handling inputs & simple state with a cozy UI and tiny animations.</p>
      </header>

      <div className="grid">
        <CounterCard />
        <LivePreviewCard />
      </div>

      <footer className="footer">
        Built with React 18 and <code>useState</code>.
      </footer>
    </main>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
