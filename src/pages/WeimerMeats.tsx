import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const FAMILY_PHOTO = '/customers/weimer-family.jpg';
const LOGO = '/customers/weimer-logo-web.png';
const DIRECTORY_PATH = '/find-a-processor/weimer-meats-bradenville-pa';
const DEMO_URL = 'https://meetings.hubspot.com/henry-arrowood/schedule-demo';

// Kept character-for-character identical to the /customers/weimer-meats
// entry in scripts/seo-build.mjs. Change both together.
// House style: no em dashes or en dashes in outward-facing copy.
// Body copy below is Wyatt's approved Aug 12 text, verbatim.
const WEIMER_STORY_TITLE = 'Weimer Meats | Farmshare customer story';
const WEIMER_STORY_DESCRIPTION =
  'A dual-location beef and pork processor in Pennsylvania moved scheduling and cutsheets onto Farmshare, and started booking customers from across the state.';

const stats = [
  {
    value: '8',
    label: 'net-new beef booked in a single week through the scheduling link',
  },
  {
    value: '5+',
    label: 'new customers a month from Facebook, especially for hogs',
  },
  {
    value: '20-30 min',
    label: 'saved on the first online buyer cutsheet versus the old process',
  },
];

const results = [
  '8 net-new beef booked in a single week through the scheduling link, including 5 from a brand-new customer and 3 from a customer she had not worked with in over a year.',
  '5+ new customers a month from Facebook, especially for hogs.',
  'Reach expanded from local to customers across Pennsylvania and surrounding states.',
  'The first online buyer cutsheet saved 20 to 30 minutes versus the old process.',
  'Ran both locations solo after her secretary left.',
  'A nearby processor is looking to hand his business to Weimer because her shop now runs efficiently enough to take it on.',
  'Producers now reach out to Weimer because of the software itself, including one with 16 head for the coming winter who found her through the online booking link.',
];

const quotes: { text: string; name: string; detail?: string }[] = [
  {
    text: 'Using Farmshare has expanded our reach beyond our local community to customers throughout Pennsylvania and surrounding states.',
    name: 'Melinda Weimer',
    detail: 'Weimer Meats',
  },
  {
    text: "I learned something about beef, and I've been doing beef all my life.",
    name: 'A Weimer customer',
    detail: 'Filling out a cutsheet for the first time',
  },
  {
    text: "I see the Farmshare app you're using and it looks amazing. I have 16 head that are ready in Dec/January.",
    name: 'A producer reaching out to Weimer Meats for the first time',
  },
];

export default function WeimerMeats() {
  useEffect(() => {
    document.title = WEIMER_STORY_TITLE;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') ?? null;
    metaDescription?.setAttribute('content', WEIMER_STORY_DESCRIPTION);

    return () => {
      if (metaDescription && previousDescription !== null) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, []);

  return (
    <article>
      <header className="pt-12 md:pt-14 pb-2">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[1120px]">
            <nav aria-label="Breadcrumb" className="text-[13px] text-stone-600 mb-7">
              <ol className="flex flex-wrap items-center">
                <li>
                  <Link to="/" className="hover:text-brand-green transition-colors">
                    Home
                  </Link>
                </li>
                <li className="flex items-center text-stone-700" aria-current="page">
                  <span className="mx-2 text-stone-400" aria-hidden="true">
                    /
                  </span>
                  Weimer Meats
                </li>
              </ol>
            </nav>

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-orange mb-3.5">
              Customer story
            </p>
            <h1 className="font-roca text-brand-green text-[2.2rem] md:text-5xl lg:text-[3.6rem] leading-[1.12] max-w-[18ch] mb-4">
              Nobody else offers what we do now.
            </h1>
            <p className="font-bold text-brand-forest">
              Melinda Weimer
              <span className="block font-medium text-stone-600 mt-1">Weimer Meats</span>
            </p>
            <p className="text-lg text-stone-600 max-w-[40rem] mt-[18px]">
              Dual-location beef and pork processor (USDA + Custom), Pennsylvania. On Farmshare since January 2026.
            </p>

            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5 mt-[22px]">
              <img
                src={LOGO}
                alt="Weimer Meats"
                width={640}
                height={615}
                className="h-[72px] w-auto"
              />
              <span className="border border-brand-green/25 bg-brand-green/[0.06] text-brand-green font-bold text-[13px] px-3 py-1.5 rounded-full">
                USDA + Custom
              </span>
              <span className="border border-brand-green/25 bg-brand-green/[0.06] text-brand-green font-bold text-[13px] px-3 py-1.5 rounded-full">
                Beef and pork
              </span>
              <span className="border border-brand-green/25 bg-brand-green/[0.06] text-brand-green font-bold text-[13px] px-3 py-1.5 rounded-full">
                Pennsylvania
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-10 lg:px-16 pt-7 pb-2">
          <div className="max-w-[1120px]">
            <img
              src={FAMILY_PHOTO}
              alt="The Weimer family standing with the Weimer Meats sign in Pennsylvania"
              width={1080}
              height={565}
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </header>

      <section className="bg-brand-forest text-brand-cream mt-12 py-12 md:py-14" aria-label="Results at a glance">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[1120px] grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-roca text-brand-yellow text-5xl md:text-[3.4rem] leading-none mb-2.5">{stat.value}</p>
                <p className="text-base text-brand-cream max-w-[22ch]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-[72px]">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[1120px] grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-roca text-brand-green text-[1.6rem] md:text-[2rem] mb-4">The challenge</h2>
              <p className="text-[17px] leading-relaxed text-stone-700">
                Weimer's reach was mostly local, scheduling and cutsheets ran on paper and phone calls, and Melinda was running the shop largely on her own after losing her office help. Growing the business meant more phone tag, not more customers.
              </p>
            </div>
            <div>
              <h2 className="font-roca text-brand-green text-[1.6rem] md:text-[2rem] mb-4">With Farmshare</h2>
              <p className="text-[17px] leading-relaxed text-stone-700">
                Melinda put her online scheduling link on Facebook and sent it at drop-off, moved buyer cutsheets online, and turned on automated notifications. Customers now book themselves and pick their own cuts, and she runs both locations without a second office person.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-[72px]">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[1120px]">
            <h2 className="font-roca text-brand-green text-[1.6rem] md:text-[2rem] mb-7">Results</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {results.map((item) => (
                <li key={item} className="relative pl-7 text-base text-stone-700">
                  <span
                    className="absolute left-0 top-[0.55em] h-2.5 w-2.5 rounded-full bg-brand-orange"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-[72px]">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[1120px]">
            <h2 className="font-roca text-brand-green text-[1.6rem] md:text-[2rem] mb-9">In their words</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {quotes.map((quote) => (
                <blockquote
                  key={quote.name}
                  className="bg-brand-cream rounded-2xl px-6 pt-7 pb-6 flex flex-col gap-4 m-0"
                >
                  <p className="text-[17px] text-brand-forest flex-1">“{quote.text}”</p>
                  <footer className="text-sm font-bold text-brand-green">
                    {quote.name}
                    {quote.detail ? (
                      <span className="block font-medium text-stone-600">{quote.detail}</span>
                    ) : null}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:pt-[72px] md:pb-20">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[1120px] grid grid-cols-1 md:grid-cols-[160px_1fr] gap-8 md:gap-10 items-start">
            <img
              src={LOGO}
              alt="Weimer Meats logo"
              width={640}
              height={615}
              className="h-[140px] w-auto"
              loading="lazy"
              decoding="async"
            />
            <div>
              <h2 className="font-roca text-brand-green text-[1.6rem] md:text-[2rem] mb-4">About Weimer Meats</h2>
              <p className="text-[17px] leading-relaxed text-stone-700 max-w-[40rem]">
                Weimer Meats is a family-run beef and pork processor in Pennsylvania serving custom and USDA customers across the region.
              </p>
              <Link
                to={DIRECTORY_PATH}
                className="inline-flex items-center font-bold text-brand-green hover:text-brand-orange transition-colors mt-6"
              >
                Visit their directory listing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-green text-brand-cream py-16 md:py-[72px] text-center">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-roca text-brand-cream text-3xl md:text-[2.6rem] leading-tight mb-3">
              See what Farmshare can do for your shop.
            </h2>
            <p className="text-lg text-brand-cream/90 mb-7">
              Independent processors use Farmshare to let customers book themselves, pick their own cuts, and keep the office work off the phone.
            </p>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-orange text-white text-lg px-8 py-4 rounded-lg hover:bg-brand-yellow transition-colors inline-flex items-center justify-center font-bold"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
