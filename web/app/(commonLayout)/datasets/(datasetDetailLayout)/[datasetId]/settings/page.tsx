import React from "react";
import {
  getLocaleOnServer,
  useTranslation as translate,
} from "../../../../../../i18n/server";
import Form from "../../../../../components/datasets/settings/form";

const Settings = async () => {
  const locale = getLocaleOnServer();
  const { t } = await translate(locale, "dataset-settings");

  return (
    <div className="bg-white dark:bg-tgai-panel-background h-full overflow-y-auto tgai-custom-scrollbar">
      <div className="px-6 py-3">
        <div className="mb-1 text-lg font-semibold text-tgai-text-1">
          {t("title")}
        </div>
        <div className="text-sm text-tgai-text-3">{t("desc")}</div>
      </div>
      <Form />
    </div>
  );
};

export default Settings;
