import React, { useEffect } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NETWORK_STATS, PRESS_EMAIL } from '../constants';

/**
 * Quiet press page. Deliberately NOT linked from the header, footer, or
 * sitemap, and marked noindex, so it can sit here until it is needed.
 *
 * To publish an announcement, add an entry to `announcements` below.
 * Everything else on the page is evergreen boilerplate a reporter can quote.
 */
type Announcement = {
  date: string;
  title: string;
  summary: string;
  href?: string;
};

const announcements: Announcement[] = [];

export default function Newsroom() {
  useEffect(() => {
    document.title = 'Newsroom | Farmshare';

    const description =
      'Company information and press contact for Farmshare, the coordination layer for independent meat processing.';
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') ?? null;
    metaDescription?.setAttribute('content', description);

    // Keep this page out of search results until Farmshare decides otherwise.
    const robots = document.querySelector('meta[name="robots"]');
    const previousRobots = robots?.getAttribute('content') ?? null;
    robots?.setAttribute('content', 'noindex, follow');

    return () => {
      if (metaDescription && previousDescription !== null) {
        metaDescription.setAttribute('content', previousDescription);
      }
      if (robots && previousRobots !== null) {
        robots.setAttribute('content', previousRobots);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream">
      <section className="py-14 md:py-20 bg-white border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-3">Newsroom</p>
            <h1 className="text-4xl md:text-5xl font-roca text-brand-green tracking-tight mb-6">
              Company Information and Press Contact
            </h1>
            <p className="text-lg text-stone-700 leading-relaxed">
              Farmshare is the coordination layer for independent meat processing. The platform runs
              scheduling, digital cut sheets, customer communication, and invoicing for independent
              plants, and connects those plants into a network that can reach markets none of them
              could reach alone.
            </p>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-roca text-brand-green mb-6">Company Facts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <p className="text-4xl font-roca text-brand-green mb-1">{NETWORK_STATS.facilities}</p>
                <p className="text-stone-600 text-sm">plants</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <p className="text-4xl font-roca text-brand-green mb-1">{NETWORK_STATS.states}</p>
                <p className="text-stone-600 text-sm">states</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <p className="text-4xl font-roca text-brand-green mb-1">
                  {NETWORK_STATS.producers.toLocaleString()}
                </p>
                <p className="text-stone-600 text-sm">producers</p>
              </div>
            </div>

            <dl className="bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-4 text-stone-700">
              <div className="sm:flex sm:gap-4">
                <dt className="font-bold text-brand-green sm:w-40 flex-shrink-0">Legal entity</dt>
                <dd>Farmshare, Co., a Delaware corporation</dd>
              </div>
              <div className="sm:flex sm:gap-4">
                <dt className="font-bold text-brand-green sm:w-40 flex-shrink-0">Headquarters</dt>
                <dd>Denver, Colorado</dd>
              </div>
              <div className="sm:flex sm:gap-4">
                <dt className="font-bold text-brand-green sm:w-40 flex-shrink-0">Founder and CEO</dt>
                <dd>Henry Arrowood</dd>
              </div>
              <div className="sm:flex sm:gap-4">
                <dt className="font-bold text-brand-green sm:w-40 flex-shrink-0">What it does</dt>
                <dd>
                  Software and network infrastructure for independent custom meat processors:
                  scheduling, digital cut sheets, customer communication, invoicing, and market
                  intelligence.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-12 md:py-16 bg-white border-t border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-roca text-brand-green mb-6">Announcements</h2>
            {announcements.length === 0 ? (
              <p className="text-stone-600">
                No announcements at this time. For anything time sensitive, email us directly.
              </p>
            ) : (
              <div className="space-y-6">
                {announcements.map((item) => (
                  <article key={item.title} className="border-l-4 border-brand-orange pl-5">
                    <p className="text-sm text-stone-500 mb-1">{item.date}</p>
                    <h3 className="text-lg font-bold text-brand-green mb-2">{item.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{item.summary}</p>
                    {item.href && (
                      <a
                        href={item.href}
                        className="inline-flex items-center font-bold text-brand-green hover:text-brand-orange transition-colors mt-2"
                      >
                        Read more
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-roca text-brand-green mb-4">Press Contact</h2>
            <p className="text-stone-700 mb-5">
              Henry Arrowood, Founder and CEO. Email is the fastest way to reach us.
            </p>
            <a
              href={`mailto:${PRESS_EMAIL}`}
              className="bg-brand-green text-white px-6 py-3 rounded-lg hover:bg-brand-green/90 transition-colors inline-flex items-center font-bold"
            >
              <Mail className="mr-2 h-5 w-5" />
              {PRESS_EMAIL}
            </a>
            <p className="text-stone-600 mt-8">
              More on why Farmshare exists is on the{' '}
              <Link to="/mission" className="text-brand-orange font-bold hover:underline">
                mission page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
