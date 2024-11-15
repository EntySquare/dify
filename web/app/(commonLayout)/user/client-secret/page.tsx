import React from "react";
import { ClientSecretCard } from "@/app/components/tgai-user/client-secret/client-secret-card";
const TGAIClientSecret = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <ClientSecretCard />
    </div>
  );
};

export default React.memo(TGAIClientSecret);
