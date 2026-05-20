import { useCallback } from "react";
import { siteConfig } from "../data/siteConfig";
import { trackWhatsappClick } from "./tracking";
import { useToast } from "./toast";

type Source = Parameters<typeof trackWhatsappClick>[0];

export function useWhatsappCTA(source: Source) {
  const { notify } = useToast();

  const onClick = useCallback(() => {
    trackWhatsappClick(source);
    notify({
      tone: "success",
      title: "Te abrimos WhatsApp",
      message: "Aceptá la invitación al grupo para recibir la próxima fecha.",
    });
  }, [source, notify]);

  return {
    href: siteConfig.whatsappGroupUrl,
    target: "_blank" as const,
    rel: "noopener noreferrer",
    onClick,
  };
}
