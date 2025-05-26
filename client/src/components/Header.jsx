export default function Header({darkMode, setDarkMode}) {
  return (
    <div className="bg-light-subtle p-2 rounded-4 mb-2 flex-column ">
      <h3 className=" mb-4 font-monospace">✅ CheckIt</h3>
      <button
        className="btn btn-outline-secondary btn-sm mb-3 mx-auto fw-bold align-self-start"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
}
