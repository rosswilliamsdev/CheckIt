export default function Header({darkMode, setDarkMode}) {
  return (
    <div className="bg-light-subtle p-2 rounded-4 mb-2 flex-column justify-content-center ">
      <h3 className="text-center mb-4 font-monospace">✅ CheckIt</h3>
      <button
        className="btn btn-outline-secondary btn-sm mb-3 d-block mx-auto fw-bold"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
}
