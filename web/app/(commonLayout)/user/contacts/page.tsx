import React from "react";

import { ContactsCard } from "@/app/components/tgai-user/contacts/contacts-card";

const TGAIContacts = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <ContactsCard />
    </div>
  );
};

export default React.memo(TGAIContacts);
