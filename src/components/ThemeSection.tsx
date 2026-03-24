import "./styles/ThemeSection.css";
import { useTheme } from "../context/ThemeProvider";
import { themeList } from "../theme/themes";

const ThemeSection = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section className="theme-section section-container" id="theme">
      <h2 className="theme-section-title">
        Choose a <span>theme</span>
      </h2>
      <p className="theme-section-lead">
        Pick a palette — colors update across the whole site. Your choice is
        saved for next visit.
      </p>
      <div className="theme-grid">
        {themeList.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`theme-card ${theme === t.id ? "theme-card-active" : ""}`}
            onClick={() => setTheme(t.id)}
            aria-pressed={theme === t.id}
            aria-label={`Apply ${t.label} theme`}
          >
            <div
              className="theme-card-swatches"
              data-theme-preview={t.id}
            />
            <h3>{t.label}</h3>
            <p>{t.description}</p>
            {theme === t.id && (
              <span className="theme-card-badge">Active</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ThemeSection;
