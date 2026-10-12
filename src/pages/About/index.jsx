/* eslint-disable react/prop-types */
import './index.scss';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Mail, Smartphone, Star } from 'lucide-react';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import SearchDemo from './SearchDemo';
import packageJson from '../../../package.json';
import { useTranslation } from 'react-i18next';

const links = [
  { href: 'https://github.com/pricescrawler/content-api-example', label: 'Use the example' },
  { href: 'https://github.com/pricescrawler/content-base', label: 'content-base on GitHub' },
  { href: 'https://github.com/pricescrawler/documentation', label: 'Documentation' }
];

const pipelineStages = [
  {
    description: 'Disabled stores answer empty without touching the site.',
    title: 'Catalog active?'
  },
  { description: 'MongoDB or in-memory, per locale, catalog and query.', title: 'Cache' },
  {
    description: 'Search by query, by URL, and refresh list items.',
    isYourCode: true,
    title: 'Store parser'
  },
  { description: 'Regular, campaign and unit price as numbers.', title: 'Normalized prices' },
  { description: 'Saved in the background on every live search.', title: 'History' },
  {
    description: 'Failures become empty results and a broken-parser signal.',
    title: 'Metrics and errors'
  }
];

const dependencySnippet = `<dependency>
  <groupId>io.github.pricescrawler.content</groupId>
  <artifactId>prices-crawler-content-controller</artifactId>
</dependency>`;

const serviceSnippet = `@Service
@Qualifier("pt.mystore")
public class MyStoreProductService extends BaseProductService {
    protected Mono<SearchProductsDto> searchItemLogic(FilterProductByQueryDto f) { … }
    protected Mono<SearchProductDto> searchItemByProductUrlLogic(FilterProductByUrlDto f) { … }
    protected Mono<ProductListItemDto> updateItemLogic(ProductListItemDto item) { … }
}`;

function SectionTitle({ children }) {
  return <h2 className={'text-xl font-bold tracking-tight'}>{children}</h2>;
}

function CodeBlock({ code }) {
  return (
    <pre
      className={
        'overflow-x-auto rounded-lg border bg-muted/40 p-4 font-mono text-xs leading-relaxed'
      }
    >
      {code}
    </pre>
  );
}

function ExtensionStep({ children, number, title }) {
  return (
    <li className={'grid grid-cols-[2rem_minmax(0,1fr)] gap-4'}>
      <span
        className={
          'flex h-8 w-8 items-center justify-center rounded-full border-2 border-foreground font-mono text-sm font-semibold'
        }
      >
        {number}
      </span>
      <div className={'flex min-w-0 flex-col gap-2'}>
        <h3 className={'font-semibold'}>{title}</h3>
        {children}
      </div>
    </li>
  );
}

function Hero() {
  return (
    <section className={'grid items-center gap-10 md:grid-cols-2'}>
      <div className={'flex flex-col gap-5'}>
        <span className={'font-mono text-xs uppercase tracking-wider text-muted-foreground'}>
          Open-source framework · Reactive Spring Boot · MIT
        </span>
        <h1 className={'text-4xl font-extrabold tracking-tight text-balance sm:text-5xl'}>
          Compare prices from <mark className={'bg-yellow-300 px-1 text-black'}>any store</mark>.
          Write only the parser.
        </h1>
        <p className={'text-muted-foreground'}>
          content-base is a Java framework for building price APIs. Caching, price history, product
          lists, failure detection and the REST API come built in. Each store is one class.
        </p>
        <div className={'flex flex-wrap gap-2'}>
          {links.map(({ href, label }, index) => (
            <a
              href={href}
              key={href}
              rel={'noopener noreferrer'}
              target={'_blank'}
            >
              <Button variant={index === 0 ? 'default' : 'outline'}>{label}</Button>
            </a>
          ))}
        </div>
      </div>
      <SearchDemo />
    </section>
  );
}

function Pipeline() {
  return (
    <section className={'flex flex-col gap-4'}>
      <div className={'flex flex-wrap items-baseline justify-between gap-2'}>
        <SectionTitle>What happens on every search</SectionTitle>
        <code className={'text-xs text-muted-foreground'}>BaseProductService</code>
      </div>
      <ol className={'grid grid-cols-2 gap-3 md:grid-cols-3'}>
        {pipelineStages.map(({ description, isYourCode, title }, index) => (
          <li
            className={`pipeline-stage flex flex-col gap-1 rounded-lg border bg-muted/40 p-3 ${
              isYourCode ? 'border-dashed' : ''
            }`}
            key={title}
            style={{ '--i': index }}
          >
            <span
              className={`w-fit font-mono text-[10px] font-semibold uppercase tracking-wider ${
                isYourCode ? 'bg-yellow-300 px-1.5 text-black' : 'text-muted-foreground'
              }`}
            >
              {isYourCode ? 'Your code' : 'Framework'}
            </span>
            <span className={'text-sm font-semibold'}>{title}</span>
            <span className={'text-xs text-muted-foreground'}>{description}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Extension() {
  return (
    <section className={'flex flex-col gap-5'}>
      <SectionTitle>Add a store in 3 steps</SectionTitle>
      <ol className={'flex flex-col gap-5'}>
        <ExtensionStep
          number={1}
          title={'Add the dependency'}
        >
          <CodeBlock code={dependencySnippet} />
        </ExtensionStep>
        <ExtensionStep
          number={2}
          title={'Write one class per store'}
        >
          <CodeBlock code={serviceSnippet} />
        </ExtensionStep>
        <ExtensionStep
          number={3}
          title={'Register the catalog'}
        >
          <p className={'text-sm text-muted-foreground'}>
            Add a <code>locale</code> and a <code>catalog</code> document in MongoDB with the same
            key, <code>pt.mystore</code>. The store then shows up in the web app and the mobile app,
            and you can switch it on or off without a deploy.
          </p>
        </ExtensionStep>
      </ol>
    </section>
  );
}

function ProjectInfo() {
  const { t } = useTranslation();
  const email = `mailto:${import.meta.env.VITE_EMAIL}`;
  const donateUrl = import.meta.env.VITE_DONATE_URL;
  const mobileAppUrl = import.meta.env.VITE_MOBILE_APP_URL;

  return (
    <section className={'mx-auto flex w-full max-w-2xl flex-col gap-4'}>
      <Card>
        <CardContent className={'p-5 flex items-center justify-between'}>
          <span className={'text-sm text-muted-foreground'}>{t('pages.about.version')}</span>
          <span className={'font-mono text-sm font-semibold bg-muted px-2 py-0.5 rounded'}>
            v{packageJson.version}
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className={'p-5 flex items-center justify-between'}>
          <div className={'flex items-center gap-2 text-sm'}>
            <Mail
              className={'text-muted-foreground'}
              size={16}
            />
            <span className={'text-muted-foreground'}>{t('pages.about.contact')}</span>
          </div>
          <a
            className={'text-sm font-medium hover:underline'}
            href={email}
          >
            E-mail
          </a>
        </CardContent>
      </Card>

      {mobileAppUrl && (
        <Card>
          <CardContent className={'p-5 flex flex-col items-center gap-4'}>
            <div className={'flex items-center gap-2 self-start'}>
              <Smartphone
                className={'text-muted-foreground'}
                size={16}
              />
              <span className={'text-sm font-medium'}>{t('menu.mobile-app')}</span>
            </div>
            <a
              className={'text-sm font-medium hover:underline flex items-center gap-1'}
              href={mobileAppUrl}
            >
              Google Play
              <ExternalLink size={12} />
            </a>
            <QRCodeSVG
              bgColor={'transparent'}
              imageSettings={{ excavate: true, height: 24, src: '/logo.png', width: 24 }}
              level={'H'}
              size={140}
              value={mobileAppUrl}
            />
          </CardContent>
        </Card>
      )}

      {donateUrl && (
        <div className={'text-center'}>
          <a
            href={donateUrl}
            rel={'noopener noreferrer'}
            target={'_blank'}
          >
            <Button className={'gap-2'}>
              <Star size={14} />
              {t('general.donate')}
            </Button>
          </a>
        </div>
      )}
    </section>
  );
}

function About() {
  return (
    <div className={'max-w-5xl mx-auto px-4 py-10 flex flex-col gap-16'}>
      <Hero />
      <Pipeline />
      <Extension />
      <ProjectInfo />
    </div>
  );
}

export default About;
