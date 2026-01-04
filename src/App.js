import React, { useEffect, useState } from "react";
import ShoppingListOverviewRoute from "./routes/ShoppingListOverviewRoute";
import ShoppingListDetailRoute from "./routes/ShoppingListDetailRoute";

function App() {
  const [route, setRoute] = useState({ name: "overview", listId: null });

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "cs");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  if (route.name === "detail") {
    return (
      <ShoppingListDetailRoute
        listId={route.listId}
        onBack={() => setRoute({ name: "overview", listId: null })}
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  return (
    <ShoppingListOverviewRoute
      onOpenList={(list) => setRoute({ name: "detail", listId: list.id })}
      theme={theme}
      setTheme={setTheme}
      lang={lang}
      setLang={setLang}
    />
  );
}

export default App;
