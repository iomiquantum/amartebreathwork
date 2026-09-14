// MenPage — landing dedicada /hombres
// Target: hombres y personas que se identifican como masculinas en Ecuador y LATAM.

import { GenderPage } from "./gender/GenderPage";
import { MEN_CONTENT } from "./gender/genderContent";
import { PageMeta } from "../components/PageMeta";

export function MenPage() {
  return (
    <>
      <PageMeta
        title={MEN_CONTENT.seoTitle}
        description={MEN_CONTENT.seoDescription}
        path={MEN_CONTENT.route}
      />
      <GenderPage content={MEN_CONTENT} />
    </>
  );
}
