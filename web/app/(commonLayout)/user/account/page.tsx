import React from "react";
import { AccountCard } from "@/app/components/tgai-user/account/account-card";
const TGAIAccount = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <AccountCard />
    </div>
  );
};

export default React.memo(TGAIAccount);
