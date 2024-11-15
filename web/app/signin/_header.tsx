"use client";
import React from "react";
import { useContext } from "use-context-selector";
import Select from "../components/base/select/locale";
import { languages } from "../../i18n/language";
import { type Locale } from "../../i18n";
import I18n from "../../context/i18n";
import { TGAILogo } from "@/app/components/base/logo/tgai-logo";
import { HeaderThemeSwitcher } from "../components/header/tgai-header/header-theme-switcher";

const Header = () => {
  const { locale, setLocaleOnClient } = useContext(I18n);

  return (
    <div className="flex items-center justify-between p-6 w-full">
      <TGAILogo className="text-tgai-text-1 h-16 w-auto" />
      <HeaderThemeSwitcher className="h-16 w-16" />

      {/* <Select
      value={locale}
      items={languages.filter(item => item.supported)}
      onChange={(value) => {
        setLocaleOnClient(value as Locale)
      }}
    /> */}
    </div>
  );
};

export default Header;
