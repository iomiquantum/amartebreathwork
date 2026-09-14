// WomenPage — landing dedicada /mujeres
// Target: mujeres y personas con ciclo en Ecuador y LATAM.

import { GenderPage } from "./gender/GenderPage";
import { WOMEN_CONTENT } from "./gender/genderContent";
import { PageMeta } from "../components/PageMeta";

export function WomenPage() {
  return (
    <>
      <PageMeta
        title={WOMEN_CONTENT.seoTitle}
        description={WOMEN_CONTENT.seoDescription}
        path={WOMEN_CONTENT.route}
      />
      <GenderPage content={WOMEN_CONTENT} />
    </>
  );
}
