// Hook que retorna las props para CTAs de WhatsApp.
// Si el usuario YA está registrado en el gate (localStorage) → click directo al grupo
// Si NO está registrado → click abre el modal de gate para capturar lead primero
//
// Uso: <CTAButton {...useWhatsappCTA("hero_primary")}>Unirse</CTAButton>
//      <a {...useWhatsappCTA("header_button")}>Únete</a>

import { useCallback } from "react";
import { siteConfig } from "../data/siteConfig";
import { trackWhatsappClick } from "./tracking";
import { useWhatsappGate } from "./whatsappGate";

type Source = Parameters<typeof trackWhatsappClick>[0];

export function useWhatsappCTA(source: Source) {
  const { isRegistered, openGate } = useWhatsappGate();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (isRegistered) {
        // Ya registrado: dejar que href haga su trabajo (abrir WhatsApp)
        trackWhatsappClick(source);
        return;
      }

      // No registrado: prevenir navegación y abrir gate
      e.preventDefault();
      e.stopPropagation();
      openGate(source, () => {
        // Callback se ejecuta cuando completa el form
        trackWhatsappClick(source);
        window.open(siteConfig.whatsappGroupUrl, "_blank", "noopener,noreferrer");
      });
    },
    [isRegistered, source, openGate]
  );

  return {
    href: siteConfig.whatsappGroupUrl,
    target: "_blank" as const,
    rel: "noopener noreferrer",
    onClick,
  };
}
