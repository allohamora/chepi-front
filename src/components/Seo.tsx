import { FC } from 'react';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { absoluteImage, absolute } from 'src/utils/path';
import { Lang, supportedLangs } from 'src/services/pizza/types';
import { useRouter } from 'next/dist/client/router';
import { join } from 'src/utils/url';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
}

const langToLocale = (lang: Lang) => {
  switch (lang) {
    case 'en':
      return 'en_US';
    case 'ru':
      return 'ru_RU';
    case 'uk':
      return 'uk_UA';
    default:
      return 'en_US';
  }
};

export const Seo: FC<SEOProps> = ({ title, description, image = absoluteImage('/logo.png') }) => {
  const { lang: currentLang } = useTranslation();
  const { asPath } = useRouter();
  const path = asPath.split('?')[0];
  const url = absolute(path);

  return (
    <Head>
      <title>{`${title} | Chepi`}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />

      <link rel="canonical" href={url} />
      {supportedLangs
        .filter((lang) => lang !== currentLang)
        .map((lang) => (
          <link key={`alternative-${lang}`} href={absolute(join(lang, path))} hrefLang={langToLocale(lang)} />
        ))}

      <meta name="og:url" content={url} />
      <meta name="og:site_name" content="Chepi" />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:image" content={image} />
      <meta name="og:type" content="website" />
      {supportedLangs.map((lang) => (
        <meta
          key={`og:locale-${lang}`}
          name={lang === currentLang ? 'og:locale' : 'og:locale:alternate'}
          content={langToLocale(lang)}
        />
      ))}

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="robots" content="index, follow" />
    </Head>
  );
};
