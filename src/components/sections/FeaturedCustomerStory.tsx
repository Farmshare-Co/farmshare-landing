import { Link } from 'react-router-dom';

const FAMILY_PHOTO = '/customers/weimer-family.jpg';
const LOGO = '/customers/weimer-logo-web.png';
const STORY_PATH = '/customers/weimer-meats';

const stats = [
  { value: '8', label: 'net-new beef in a single week' },
  { value: '5+', label: 'new customers a month from Facebook' },
  { value: '20-30 min', label: 'saved on the first online cutsheet' },
];

/**
 * Homepage feature for the Weimer Meats customer story.
 * Copy is Wyatt's approved Aug 12 text. Do not paraphrase it,
 * and do not turn this into a stories index.
 */
export default function FeaturedCustomerStory() {
  return (
    <section className="py-20 md:py-[88px] bg-brand-cream" aria-labelledby="featured-customer-story">
      <div className="container mx-auto px-4">
        <div className="max-w-[1120px] mx-auto">
          <div className="max-w-[40rem] mb-10 fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-orange mb-3.5">
              Customer story
            </p>
            <h2
              id="featured-customer-story"
              className="font-roca text-brand-green text-4xl md:text-[2.8rem] leading-[1.15] mb-3"
            >
              See how Weimer Meats runs both shops without a second office person.
            </h2>
            <p className="text-lg text-stone-600">
              A dual-location beef and pork processor in Pennsylvania moved scheduling and cutsheets onto Farmshare, and started booking customers from across the state.
            </p>
          </div>

          <article className="bg-white rounded-[20px] overflow-hidden shadow-[0_12px_40px_rgba(29,49,40,0.08)] fade-up">
            <img
              src={FAMILY_PHOTO}
              alt="The Weimer family standing with the Weimer Meats sign in Pennsylvania"
              width={1080}
              height={565}
              className="w-full h-auto"
              loading="lazy"
              decoding="async"
            />
            <div className="px-6 py-8 md:px-10 md:pt-9 md:pb-10">
              <img
                src={LOGO}
                alt="Weimer Meats"
                width={640}
                height={615}
                className="h-[88px] w-auto mb-4"
                loading="lazy"
                decoding="async"
              />
              <p className="font-roca text-brand-green text-2xl md:text-[2rem] leading-tight mb-3">
                Nobody else offers what we do now.
              </p>
              <p className="font-bold text-brand-forest">
                Melinda Weimer
                <span className="block font-medium text-stone-600 mt-1">
                  Weimer Meats · Pennsylvania · On Farmshare since January 2026
                </span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-7">
                {stats.map((stat) => (
                  <div key={stat.label} className="border-l-[3px] border-brand-orange pl-3">
                    <p className="font-roca text-brand-green text-[1.7rem] leading-none mb-1.5">{stat.value}</p>
                    <p className="text-[13px] text-stone-600 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                to={STORY_PATH}
                className="bg-brand-green text-white text-lg px-8 py-4 rounded-lg hover:bg-brand-green/90 transition-colors inline-flex items-center justify-center font-bold"
              >
                Read the story
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
