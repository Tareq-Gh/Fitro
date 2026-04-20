import { createContext, useState, useEffect } from "react";
import { en } from "../i18n/en";
import { ar } from "../i18n/ar";

const dicts = { en, ar };

export const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem("fitro_lang") ?? "en",
  );

  function setLang(newLang) {
    localStorage.setItem("fitro_lang", newLang);
    setLangState(newLang);
  }

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang]);

  const dict = dicts[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  function t(key) {
    return key.split(".").reduce((obj, k) => obj?.[k], dict) ?? key;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
}
