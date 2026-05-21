// MenPage — landing dedicada /hombres
// Target: hombres y personas que se identifican como masculinas en Ecuador y LATAM.

import { GenderPage } from "./gender/GenderPage";
import { MEN_CONTENT } from "./gender/genderContent";

export function MenPage() {
  return <GenderPage content={MEN_CONTENT} />;
}
