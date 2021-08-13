import { FC } from "react";
import { DefaultSeo } from "next-seo";
import config from "../../config/seo.json";

const SEO: FC = () => {
  return <DefaultSeo {...config} />;
};

export default SEO;
