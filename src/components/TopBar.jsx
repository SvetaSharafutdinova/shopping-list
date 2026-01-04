import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { I18nContext } from "../context/I18nContext";

function TopBar() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { lang, setLang, t } = useContext(I18nContext);

  return (
    <div className="TopBar">
      <div className="TopBarGroup">
        <span className="TopBarLabel">{t("language")}:</span>
        <select className="TopBarSelect" value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="cs">CZ</option>
          <option value="en">EN</option>
        </select>
      </div>

      <div className="TopBarGroup">
        <span className="TopBarLabel">Theme:</span>
        <button
          className="TopBarButton"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? t("dark") : t("light")}
        </button>
      </div>
    </div>
  );
}

export default TopBar;
