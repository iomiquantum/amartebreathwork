// WomenPage — landing dedicada /mujeres
// Target: mujeres y personas con ciclo en Ecuador y LATAM.

import { GenderPage } from "./gender/GenderPage";
import { WOMEN_CONTENT } from "./gender/genderContent";

export function WomenPage() {
  return <GenderPage content={WOMEN_CONTENT} />;
}
