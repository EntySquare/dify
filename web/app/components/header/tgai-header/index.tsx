"use client";

import Image from "next/image";
import { HeaderUserProfile } from "./header-user-profile";
import { HeaderAccountRestValid } from "./header-account-rest-valid";
import { HeaderThemeSwitcher } from "./header-theme-switcher";
import classNames from "@/utils/classnames";
import { TGAILogo } from "@/app/components/base/logo/tgai-logo";

type TGAIHeaderProps = {
  className?: string;
};

export function TGAIHeader({ className }: TGAIHeaderProps) {

  return (
    <header
      className={classNames(
        "w-full flex items-center justify-between h-[60px] border-b shadow-xs px-8 bg-tgai-panel-background border-b-tgai-panel-border dark:border-b-stone-600",
        className,
      )}
    >
      <TGAILogo
        className={classNames(
          " h-full w-auto py-1 text-tgai-text-1",
        )}
      />
      <div className="flex flex-row gap-8 items-center">
        <HeaderAccountRestValid />
        <HeaderThemeSwitcher />
        <HeaderUserProfile />
      </div>
    </header>
  );
}
