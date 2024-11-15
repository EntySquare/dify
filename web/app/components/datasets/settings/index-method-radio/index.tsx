"use client";
import { useTranslation } from "react-i18next";
import s from "./index.module.css";
import classNames from "../../../../../utils/classnames";
import type { DataSet } from "../../../../../models/datasets";

const itemClass = `
  w-full sm:w-[234px] p-3 rounded-xl bg-gray-25 dark:bg-tgai-input-background border border-gray-100 border-stone-700 cursor-pointer
`;
const radioClass = `
  w-4 h-4 border-[2px] border-gray-200 dark:border-stone-600 rounded-full
`;
type IIndexMethodRadioProps = {
  value?: DataSet["indexing_technique"];
  onChange: (v?: DataSet["indexing_technique"]) => void;
  disable?: boolean;
  itemClassName?: string;
};

const IndexMethodRadio = ({
  value,
  onChange,
  disable,
  itemClassName,
}: IIndexMethodRadioProps) => {
  const { t } = useTranslation();
  const options = [
    {
      key: "high_quality",
      text: t("datasetSettings.form.indexMethodHighQuality"),
      desc: t("datasetSettings.form.indexMethodHighQualityTip"),
      icon: "high-quality",
    },
    {
      key: "economy",
      text: t("datasetSettings.form.indexMethodEconomy"),
      desc: t("datasetSettings.form.indexMethodEconomyTip"),
      icon: "economy",
    },
  ];

  return (
    <div
      className={classNames(
        s.wrapper,
        "flex justify-between w-full flex-wrap gap-y-2",
      )}
    >
      {options.map((option) => (
        <div
          key={option.key}
          className={classNames(
            itemClass,
            itemClassName,
            s.item,
            "dark:hover:!bg-zinc-700 dark:hover:!border-tgai-primary-3",
            option.key === value && s["item-active"],
            option.key === value && "dark:!bg-zinc-700 dark:!border-tgai-primary dark:hover:!border-tgai-primary",
            disable && s.disable,
          )}
          onClick={() => {
            if (!disable) onChange(option.key as DataSet["indexing_technique"]);
          }}
        >
          <div className="flex items-center mb-1">
            <div className={classNames(s.icon, s[`${option.icon}-icon`])} />
            <div className="grow text-sm text-tgai-text-1">{option.text}</div>
            <div className={classNames(radioClass, s.radio, option.key === value && "dark:!border-tgai-primary")} />
          </div>
          <div className="pl-9 text-xs text-tgai-text-3 leading-[18px]">
            {option.desc}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndexMethodRadio;
