import type { Viewport } from "next";
import { getLocaleOnServer } from "../i18n/server";
import I18nServer from "./components/i18n-server";
import BrowerInitor from "./components/browser-initor";
import SentryInitor from "./components/sentry-initor";
import Topbar from "./components/base/topbar";
import "./styles/globals.css";
import "./styles/markdown.scss";
import '@arco-themes/react-entytg/css/arco.css'
import { AxiosProvider } from "@/app/components/http/axios-provider";
import { TGAIGlobalStoreProvider } from "@/context/tgai-global-context";

export const metadata = {
  title: "TGAI",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

const LocaleLayout = ({ children }: { children: React.ReactNode }) => {
  const locale = getLocaleOnServer();

  return (
    <html lang={locale ?? "en"} className="h-full" data-theme="dark">
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body
        className="h-screen select-auto overflow-hidden bg-tgai-section-background"
        data-api-prefix={process.env.NEXT_PUBLIC_API_PREFIX}
        data-pubic-api-prefix={process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX}
        tgai-http-url={process.env.NEXT_PUBLIC_TGAI_API_PREFIX}
        tgai-ws-url={process.env.NEXT_PUBLIC_TGAI_WS_PREFIX}
        data-public-edition={process.env.NEXT_PUBLIC_EDITION}
        data-public-support-mail-login={
          process.env.NEXT_PUBLIC_SUPPORT_MAIL_LOGIN
        }
        data-public-sentry-dsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
        data-public-maintenance-notice={
          process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE
        }
        data-public-site-about={process.env.NEXT_PUBLIC_SITE_ABOUT}
      >
        <TGAIGlobalStoreProvider>
          <Topbar />
          <BrowerInitor>
            <SentryInitor>
              <I18nServer>
                <AxiosProvider>{children}</AxiosProvider>
              </I18nServer>
            </SentryInitor>
          </BrowerInitor>
        </TGAIGlobalStoreProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
