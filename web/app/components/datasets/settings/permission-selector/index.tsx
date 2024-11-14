import { useTranslation } from "react-i18next";
import cn from "classnames";
import React, { useMemo, useState } from "react";
import { useDebounceFn } from "ahooks";
import { RiArrowDownSLine } from "@remixicon/react";
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from "../../../base/portal-to-follow-elem";
import Avatar from "../../../base/avatar";
import SearchInput from "../../../base/search-input";
import { Check } from "../../../base/icons/src/vender/line/general";
import { Users01, UsersPlus } from "../../../base/icons/src/vender/solid/users";
import type { DatasetPermission } from "../../../../../models/datasets";
import { useAppContext } from "../../../../../context/app-context";
import type { Member } from "../../../../../models/common";
import { useTGAIGlobalStore } from "@/context/tgai-global-context";
import { Theme } from "@/types/app";
export type RoleSelectorProps = {
  disabled?: boolean;
  permission?: DatasetPermission;
  value: string[];
  memberList: Member[];
  onChange: (permission?: DatasetPermission) => void;
  onMemberSelect: (v: string[]) => void;
};

const PermissionSelector = ({
  disabled,
  permission,
  value,
  memberList,
  onChange,
  onMemberSelect,
}: RoleSelectorProps) => {
  const { t } = useTranslation();
  const { userProfile } = useAppContext();
  const [open, setOpen] = useState(false);

  const [keywords, setKeywords] = useState("");
  const [searchKeywords, setSearchKeywords] = useState("");
  const { run: handleSearch } = useDebounceFn(
    () => {
      setSearchKeywords(keywords);
    },
    { wait: 500 },
  );
  const handleKeywordsChange = (value: string) => {
    setKeywords(value);
    handleSearch();
  };
  const selectMember = (member: Member) => {
    if (value.includes(member.id))
      onMemberSelect(value.filter((v) => v !== member.id));
    else onMemberSelect([...value, member.id]);
  };

  const selectedMembers = useMemo(() => {
    return [
      userProfile,
      ...memberList
        .filter((member) => member.id !== userProfile.id)
        .filter((member) => value.includes(member.id)),
    ]
      .map((member) => member.name)
      .join(", ");
  }, [userProfile, value, memberList]);

  const showMe = useMemo(() => {
    return (
      userProfile.name.includes(searchKeywords) ||
      userProfile.email.includes(searchKeywords)
    );
  }, [searchKeywords, userProfile]);

  const filteredMemberList = useMemo(() => {
    return memberList.filter(
      (member) =>
        (member.name.includes(searchKeywords) ||
          member.email.includes(searchKeywords)) &&
        member.id !== userProfile.id &&
        ["owner", "admin", "editor", "dataset_operator"].includes(member.role),
    );
  }, [memberList, searchKeywords, userProfile]);

  const theme = useTGAIGlobalStore((state) => state.theme);

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement="bottom-start"
      offset={4}
    >
      <div className="relative">
        <PortalToFollowElemTrigger
          onClick={() => !disabled && setOpen((v) => !v)}
          className="block"
        >
          {permission === "only_me" && (
            <div
              className={cn(
                "flex items-center px-3 py-[6px] rounded-lg bg-gray-100 dark:bg-tgai-input-background cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-600",
                open && "bg-gray-200 dark:bg-zinc-600",
                disabled &&
                  "hover:!bg-gray-100 dark:hover:!bg-tgai-input-background !cursor-default",
              )}
            >
              <Avatar
                name={userProfile.name}
                className="shrink-0 mr-2"
                size={24}
              />
              <div className="grow mr-2 text-tgai-text-1 text-sm leading-5">
                {t("datasetSettings.form.permissionsOnlyMe")}
              </div>
              {!disabled && (
                <RiArrowDownSLine className="shrink-0 w-4 h-4 text-tgai-text-2" />
              )}
            </div>
          )}
          {permission === "all_team_members" && (
            <div
              className={cn(
                "flex items-center px-3 py-[6px] rounded-lg bg-gray-100 dark:bg-tgai-input-background cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-600",
                open && "bg-gray-200 dark:bg-zinc-600",
              )}
            >
              <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-lg bg-[#EEF4FF]">
                <Users01 className="w-3.5 h-3.5 text-[#444CE7]" />
              </div>
              <div className="grow mr-2 text-tgai-text-1 text-sm leading-5">
                {t("datasetSettings.form.permissionsAllMember")}
              </div>
              {!disabled && (
                <RiArrowDownSLine className="shrink-0 w-4 h-4 text-tgai-text-2" />
              )}
            </div>
          )}
          {permission === "partial_members" && (
            <div
              className={cn(
                "flex items-center px-3 py-[6px] rounded-lg bg-gray-100 dark:bg-tgai-input-background cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-600",
                open && "bg-gray-200 dark:bg-zinc-600",
              )}
            >
              <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-lg bg-[#EEF4FF]">
                <Users01 className="w-3.5 h-3.5 text-[#444CE7]" />
              </div>
              <div
                title={selectedMembers}
                className="grow mr-2 text-tgai-text-1 text-sm leading-5 truncate"
              >
                {selectedMembers}
              </div>
              {!disabled && (
                <RiArrowDownSLine className="shrink-0 w-4 h-4 text-tgai-text-2" />
              )}
            </div>
          )}
        </PortalToFollowElemTrigger>
        <PortalToFollowElemContent className="z-[1002]">
          <div className="relative w-[480px] bg-white dark:bg-tgai-section-background rounded-lg border-[0.5px] border-gray-200 dark:border-stone-600 shadow-lg dark:shadow-stone-800">
            <div className="p-1">
              <div
                className="pl-3 pr-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-600 cursor-pointer"
                onClick={() => {
                  onChange("only_me");
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    name={userProfile.name}
                    className="shrink-0 mr-2"
                    size={24}
                  />
                  <div className="grow mr-2 text-tgai-text-1 text-sm leading-5">
                    {t("datasetSettings.form.permissionsOnlyMe")}
                  </div>
                  {permission === "only_me" && (
                    <Check className="w-4 h-4 text-tgai-primary" />
                  )}
                </div>
              </div>
              <div
                className="pl-3 pr-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-600 cursor-pointer"
                onClick={() => {
                  onChange("all_team_members");
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="mr-2 flex items-center justify-center w-6 h-6 rounded-lg bg-[#EEF4FF]">
                    <Users01 className="w-3.5 h-3.5 text-[#444CE7]" />
                  </div>
                  <div className="grow mr-2 text-tgai-text-1 text-sm leading-5">
                    {t("datasetSettings.form.permissionsAllMember")}
                  </div>
                  {permission === "all_team_members" && (
                    <Check className="w-4 h-4 text-tgai-primary" />
                  )}
                </div>
              </div>
              <div
                className="pl-3 pr-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-600 cursor-pointer"
                onClick={() => {
                  onChange("partial_members");
                  onMemberSelect([userProfile.id]);
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "mr-2 flex items-center justify-center w-6 h-6 rounded-lg bg-[#FFF6ED]",
                      permission === "partial_members" && "!bg-[#EEF4FF]",
                    )}
                  >
                    <UsersPlus
                      className={cn(
                        "w-3.5 h-3.5 text-[#FB6514]",
                        permission === "partial_members" && "!text-[#444CE7]",
                      )}
                    />
                  </div>
                  <div className="grow mr-2 text-tgai-text-1 text-sm leading-5">
                    {t("datasetSettings.form.permissionsInvitedMembers")}
                  </div>
                  {permission === "partial_members" && (
                    <Check className="w-4 h-4 text-tgai-primary" />
                  )}
                </div>
              </div>
            </div>
            {permission === "partial_members" && (
              <div className="max-h-[360px] border-t-[1px] border-gray-100 dark:border-stone-700 p-1 overflow-y-auto tgai-custom-scrollbar">
                <div className="sticky left-0 top-0 p-2 pb-1 bg-white dark:bg-tgai-section-background">
                  <SearchInput
                    white={theme === Theme.light}
                    dark={theme === Theme.dark}
                    value={keywords}
                    onChange={handleKeywordsChange}
                  />
                </div>
                {showMe && (
                  <div className="pl-3 pr-[10px] py-1 flex gap-2 items-center rounded-lg">
                    <Avatar
                      name={userProfile.name}
                      className="shrink-0"
                      size={24}
                    />
                    <div className="grow">
                      <div className="text-[13px] text-tgai-text-2 font-medium leading-[18px] truncate">
                        {userProfile.name}
                        <span className="text-xs text-tgai-text-3 font-normal">
                          {t("datasetSettings.form.me")}
                        </span>
                      </div>
                      <div className="text-xs text-tgai-text-3 leading-[18px] truncate">
                        {userProfile.email}
                      </div>
                    </div>
                    <Check className="shrink-0 w-4 h-4 text-tgai-primary opacity-30" />
                  </div>
                )}
                {filteredMemberList.map((member) => (
                  <div
                    key={member.id}
                    className="pl-3 pr-[10px] py-1 flex gap-2 items-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600 cursor-pointer"
                    onClick={() => selectMember(member)}
                  >
                    <Avatar name={member.name} className="shrink-0" size={24} />
                    <div className="grow">
                      <div className="text-[13px] text-tgai-text-2 font-medium leading-[18px] truncate">
                        {member.name}
                      </div>
                      <div className="text-xs text-tgai-text-3 leading-[18px] truncate">
                        {member.email}
                      </div>
                    </div>
                    {value.includes(member.id) && (
                      <Check className="shrink-0 w-4 h-4 text-tgai-primary" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </PortalToFollowElemContent>
      </div>
    </PortalToFollowElem>
  );
};

export default PermissionSelector;
