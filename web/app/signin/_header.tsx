"use client";
import React from "react";
import { useContext } from "use-context-selector";
import { RiTwitterXLine } from "@remixicon/react";
import I18n from "../../context/i18n";
import Select from "@/app/components/base/select/locale";
import { HeaderThemeSwitcher } from "../components/header/tgai-header/header-theme-switcher";
import { languages } from "@/i18n/language";
import { Locale } from "@/i18n";

const Header = () => {
  const { locale, setLocaleOnClient } = useContext(I18n);

  return (
    <div className="flex items-center justify-end p-6 w-full">
      {/* <TGAILogo className="text-tgai-text-1 h-16 w-auto" /> */}
      {/* <RiTwitterXLine className={'text-tgai-text-1 size-14'} /> */}
      <HeaderThemeSwitcher className="h-16 w-16" />

      <Select
        value={locale}
        items={languages.filter((item) => item.supported)}
        onChange={(value) => {
          setLocaleOnClient(value as Locale, false);
        }}
      />
    </div>
  );
};

export default Header;
