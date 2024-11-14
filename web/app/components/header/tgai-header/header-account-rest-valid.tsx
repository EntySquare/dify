"use client";

import { TGAIGet } from "@/service/http";
import classNames from "@/utils/classnames";
import dayjs from "dayjs";
import useSWR from "swr";

export const HeaderAccountRestValid = () => {
  const { data } = useSWR(["/manage/checkExpiration"], () =>
    TGAIGet<number>("/manage/checkExpiration"),
  );

  return (
    <>
      {data && (
        <div
          className={classNames(
            "font-bold text-tgai-text-1"
          )}
        >
          <span className="text-tgai-primary">账户有效期至:</span>
          {dayjs(data.data * 1000).format("YYYY年MM月DD日 hh:mm:ss")}
        </div>
      )}
    </>
  );
};
