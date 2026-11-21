"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export type TurnstileHandle = {
  /** Returns a fresh token, executing the widget if needed. */
  getToken: () => Promise<string | null>;
  reset: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          size?: "normal" | "compact" | "flexible" | "invisible";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          appearance?: "always" | "execute" | "interaction-only";
          execution?: "render" | "execute";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      execute: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
  }
}

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Turnstile failed to load.")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load."));
    document.head.appendChild(script);
  });
}

export const TurnstileWidget = forwardRef<
  TurnstileHandle,
  {
    className?: string;
    /** visible checkbox vs invisible/managed */
    mode?: "managed" | "invisible";
  }
>(function TurnstileWidget({ className, mode = "managed" }, ref) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const resolversRef = useRef<Array<(token: string | null) => void>>([]);
  const [ready, setReady] = useState(false);

  const flush = useCallback((token: string | null) => {
    tokenRef.current = token;
    const resolvers = resolversRef.current.splice(0);
    for (const resolve of resolvers) resolve(token);
  }, []);

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      setReady(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        await loadTurnstileScript();
        if (cancelled || !containerRef.current || !window.turnstile) return;

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          size: mode === "invisible" ? "invisible" : "flexible",
          appearance: mode === "invisible" ? "execute" : "always",
          execution: mode === "invisible" ? "execute" : "render",
          callback: (token) => flush(token),
          "error-callback": () => flush(null),
          "expired-callback": () => {
            tokenRef.current = null;
          },
        });
        widgetIdRef.current = id;
        setReady(true);
      } catch (error) {
        console.error(error);
        setReady(false);
      }
    })();

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      flush(null);
    };
  }, [siteKey, mode, flush]);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        tokenRef.current = null;
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
      async getToken() {
        if (!siteKey) {
          // Dev without Turnstile configured — allow submits.
          return "";
        }
        if (!ready || !widgetIdRef.current || !window.turnstile) {
          return null;
        }

        const existing =
          tokenRef.current ||
          window.turnstile.getResponse(widgetIdRef.current) ||
          null;
        if (existing) return existing;

        return new Promise<string | null>((resolve) => {
          resolversRef.current.push(resolve);
          try {
            window.turnstile?.execute(widgetIdRef.current!);
          } catch {
            // Managed widgets may already have a response after interaction.
            const fallback =
              window.turnstile?.getResponse(widgetIdRef.current!) ?? null;
            if (fallback) {
              flush(fallback);
            } else {
              // Wait briefly for callback; otherwise fail.
              setTimeout(() => {
                if (resolversRef.current.includes(resolve)) {
                  flush(
                    window.turnstile?.getResponse(widgetIdRef.current!) ?? null,
                  );
                }
              }, 4_000);
            }
          }
        });
      },
    }),
    [siteKey, ready, flush],
  );

  if (!siteKey) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      data-turnstile-ready={ready ? "true" : "false"}
    />
  );
});
