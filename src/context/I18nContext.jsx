import React, { createContext, useMemo, useState } from "react";

const MESSAGES = {
  cs: {
    appTitle: "Nákupní seznamy",
    list: "Seznamy",
    detail: "Detail",
    includeArchived: "Zobrazit včetně archivovaných",
    onlyActive: "Zobrazit jen aktivní",
    addNewList: "+ Přidat nový seznam",
    delete: "Smazat",
    cancel: "Zrušit",
    close: "Zavřít",
    create: "Vytvořit",
    archived: "Archivovaný",
    items: "Položky",
    roleOwner: "vlastník",
    roleMember: "člen",
    charts: "Statistika",
    done: "Hotovo",
    todo: "Nehotovo",
    showDone: "Zobrazit hotové",
    hideDone: "Skrýt hotové",
    light: "Light",
    dark: "Dark",
    language: "Jazyk",
    emptyLists: "Žádné nákupní seznamy k zobrazení.",
    deleteTitle: "Smazat seznam",
    deleteQuestion: "Opravdu chcete smazat seznam"
  },
  en: {
    appTitle: "Shopping lists",
    list: "Lists",
    detail: "Detail",
    includeArchived: "Include archived",
    onlyActive: "Show only active",
    addNewList: "+ Add new list",
    delete: "Delete",
    cancel: "Cancel",
    close: "Close",
    create: "Create",
    archived: "Archived",
    items: "Items",
    roleOwner: "owner",
    roleMember: "member",
    charts: "Statistics",
    done: "Done",
    todo: "To do",
    showDone: "Show done",
    hideDone: "Hide done",
    light: "Light",
    dark: "Dark",
    language: "Language",
    emptyLists: "No shopping lists to display.",
    deleteTitle: "Delete list",
    deleteQuestion: "Do you really want to delete"
  }
};

export const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "cs");

  const t = useMemo(() => {
    const dict = MESSAGES[lang] || MESSAGES.cs;
    return (key) => dict[key] ?? key;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: (next) => {
        localStorage.setItem("lang", next);
        setLang(next);
      },
      t
    }),
    [lang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
