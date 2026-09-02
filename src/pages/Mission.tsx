import React, { useEffect, useRef } from 'react';
import { Calendar, Mail, Users, Factory, Link2, Network, TrendingUp, Sparkles } from 'lucide-react';
import AnimatedNumber from '../components/AnimatedNumber';
import { NETWORK_STATS } from '../constants';

const MISSION_TITLE = 'Our Mission - The Operating System for Independent Meat | Farmshare';
// The hero paragraph and the runtime meta description are the same sentence, so
// they render from one constant and a copy edit can never leave one behind.
// A THIRD copy is the literal in scripts/seo-build.mjs, which is what the
// prerendered /mission page serves to crawlers and link previews. This string
// is kept character-for-character identical to it; change both together.
// House style: no em dashes in outward-facing copy.
const MISSION_DESCRIPTION =
  'Four companies control 85% of beef processing in America. Their advantage is not quality. ' +
  'It is scale and intelligence. Farmshare is building both for independent processors.';

const stages = [
  {
    icon: Factory,
    title: 'Act 1: The Operational Platform',
    badge: 'Built',
    badgeBg: 'bg-brand-green/10',
    badgeText: 'text-brand-green',
    iconBg: 'bg-brand-green',
    description: 'The platform that grows plants\' revenue. Online scheduling, automated notifications, digital cut sheets, job tracking, and invoicing replace the phone tag and paperwork chaos. Farmshare drives new customer acquisition. Staff focus on the meat, not the admin.',
  },
  {
    icon: Sparkles,
    title: 'Act 2: Plant Intelligence',
    badge: 'Building',
    badgeBg: 'bg-brand-orange/10',
    badgeText: 'text-brand-orange',
    iconBg: 'bg-brand-orange',
    description: 'The intelligence that grows plants\' profit. This act is inventory and further processing: what you make from the carcass, what it cost you to make it, and which channel it goes to. Per-product cost to manufacture, so margin is visible instead of assumed. Recipes and batches. Yield counted rather than estimated. And the integrations that keep a plant\'s systems all carrying the same numbers.',
  },
  {
    icon: TrendingUp,
    title: 'Act 3: Market-Making',
    badge: 'The Vision',
    badgeBg: 'bg-stone-200',
    badgeText: 'text-stone-600',
    iconBg: 'bg-stone-400',
    description: 'The network that shifts the power. Independents stop being price-takers. Processors coordinate forward-selling, aggregated purchasing, and carcass-balancing across plants. Producers reach the markets the Big Four used to control, carrying proof of what they raised and a real price to hold it against. Market-making is not the end of the story. The farm share is. Every act is aimed at the same result: more of each meat dollar landing with the people who do the work.',
  },
];

export default function Mission() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = MISSION_TITLE;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', MISSION_DESCRIPTION);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    const handleScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.5}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* ============================================
          HERO
          ============================================ */}
      <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden">
        <div
          ref={parallaxRef}
          className="parallax-bg"
          style={{ backgroundImage: 'url(/hero-mission.png)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-brand-cream/70"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-7xl mb-4 md:mb-6 lg:mb-8 leading-tight text-brand-green font-roca tracking-tight stagger-child">
              Independent Meat Is Better. It Should Win.
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-stone-600 mb-6 lg:mb-8 font-medium stagger-child">
              {MISSION_DESCRIPTION}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          THE PROBLEM: Stats row + short context
          ============================================ */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-roca text-brand-orange text-center mb-10 md:mb-14 fade-up">The Problem</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10 md:mb-14">
            <div className="text-center fade-up">
              <p className="text-5xl md:text-6xl font-roca text-brand-green mb-2">
                <AnimatedNumber target={85} suffix="%" />
              </p>
              <p className="text-stone-600 text-sm md:text-base">of U.S. beef processing controlled by four companies</p>
            </div>
            <div className="text-center fade-up">
              <p className="text-5xl md:text-6xl font-roca text-brand-green mb-2">
                <AnimatedNumber target={5000} suffix="+" />
              </p>
              <p className="text-stone-600 text-sm md:text-base">independent processors serving growing local demand</p>
            </div>
            <div className="text-center fade-up">
              <p className="text-5xl md:text-6xl font-roca text-brand-green mb-2">
                <AnimatedNumber target={14} suffix="¢" />
              </p>
              <p className="text-stone-600 text-sm md:text-base">of every meat dollar makes it back to the producer</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center fade-up">
            <p className="text-base md:text-lg text-stone-700 leading-relaxed">
              The largest packers don't dominate because they produce better meat. They dominate because they coordinate at scale, with intelligence. Independent processors produce the quality and traceability consumers want, but they're fragmented, disconnected, and running blind. Meanwhile, demand for local meat is surging and new processing capacity is coming online. The opportunity has never been bigger. What hasn't existed is the infrastructure to seize it, or the intelligence to aim it.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          VIDEO: Henry's Story
          ============================================ */}
      <section className="py-8 md:py-12 lg:py-16 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 md:mb-8 fade-up">
              <h2 className="text-2xl md:text-3xl font-roca text-brand-orange mb-2">Our Founder's Story</h2>
              <p className="text-sm md:text-base text-stone-600">
                Henry Arrowood, founder of Farmshare, speaking at the PLA BeefTech Producer Summit on why Farmshare exists.
              </p>
            </div>
            <div className="h-[250px] md:h-[350px] lg:h-[450px] rounded-lg shadow-[0_20px_50px_rgba(0,111,53,0.2)] overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/XtJwE05TqHE"
                title="Our Founder's Story | Farmshare"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          WHAT WE BELIEVE: The Trinity
          ============================================ */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-roca text-brand-orange text-center mb-10 md:mb-14 fade-up">What We Believe</h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-brand-cream rounded-xl p-6 md:p-8 text-center fade-up">
              <div className="h-14 w-14 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Network className="h-7 w-7 text-brand-green" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-brand-green mb-3">The Network Wins</h3>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                One processor can't supply a restaurant chain. Fifty on shared infrastructure can. Independent meat wins by coordinating as one, not by out-competing the Big Four on their own terms.
              </p>
            </div>

            <div className="bg-brand-cream rounded-xl p-6 md:p-8 text-center fade-up">
              <div className="h-14 w-14 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Sparkles className="h-7 w-7 text-brand-orange" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-brand-green mb-3">Intelligence Is the Other Half</h3>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                Four decisions determine whether an animal earns what it is worth: what to bring in, how to cut it, who to sell it to, at what price. The Big Four answer all four with better information than anyone else has. That's intelligence. Independent processors don't have it yet. Farmshare is building each one for them.
              </p>
            </div>

            <div className="bg-brand-cream rounded-xl p-6 md:p-8 text-center fade-up">
              <div className="h-14 w-14 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Link2 className="h-7 w-7 text-brand-yellow" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-brand-green mb-3">Neither Works Alone</h3>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                Scale without intelligence is a big dumb machine. Intelligence without scale stays on a whiteboard. Farmshare is the coordination layer that gives independents both.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PULL QUOTE DIVIDER
          ============================================ */}
      <section className="py-12 md:py-16 bg-brand-green">
        <div className="container mx-auto px-4">
          <p className="max-w-3xl mx-auto text-center text-xl md:text-2xl lg:text-3xl font-roca text-white leading-snug">
            Thousands of independent processors, collectively operating with the intelligence of a Cargill. Without any one of them needing to become Cargill.
          </p>
        </div>
      </section>

      {/* ============================================
          WHERE WE'RE GOING: Acts timeline
          ============================================ */}
      <section className="py-12 md:py-16 lg:py-20 bg-brand-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-roca text-brand-orange text-center mb-4 fade-up">Where We're Going</h2>
          <p className="text-base md:text-lg text-stone-600 text-center mb-12 md:mb-16 max-w-2xl mx-auto fade-up">
            Three acts: revenue, then profit, then market power. Each builds on the last, from today's platform to tomorrow's market-making network. All three are pointed at the same end: a bigger share of every meat dollar reaching the producer.
          </p>

          <div className="max-w-3xl mx-auto relative">
            {/* Timeline connector line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-green via-brand-orange via-70% to-stone-300 hidden md:block"></div>

            {stages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <div key={i} className={`relative flex items-start gap-5 md:gap-8 fade-up ${i < stages.length - 1 ? 'mb-8 md:mb-12' : ''}`}>
                  {/* Icon circle (sits on the timeline line) */}
                  <div className={`flex-shrink-0 h-12 w-12 md:h-16 md:w-16 ${stage.iconBg} rounded-full flex items-center justify-center z-10 shadow-lg`}>
                    <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>

                  {/* Content card */}
                  <div className="bg-white rounded-xl p-5 md:p-7 shadow-lg flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-brand-green">{stage.title}</h3>
                      <span className={`${stage.badgeBg} ${stage.badgeText} font-bold px-3 py-0.5 rounded-full text-xs uppercase tracking-wide`}>
                        {stage.badge}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-stone-600 leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          THE FARM SHARE
          Sits immediately before "A Third Option for Producers" on purpose:
          this section is the stake (what a farm share is, how small it is, and
          the three things that move it), and the Third Option section is what
          a producer actually does about it. Same reader, setup then answer.
          It also gives the 14 cents stat in the Problem row a meaning, which
          it did not have before.

          Copy rules, learned the hard way:
          - The distance between farm and market is STRUCTURAL. Do not name
            trades as margin-takers. Feeders and distributors are Farmshare
            partners and customers. An earlier draft listed them and was cut.
          - Per-animal records ship today. Everything past that is directional
            and has to read that way.
          - Plant count comes from NETWORK_STATS, never typed inline.
          ============================================ */}
      <section className="py-12 md:py-16 lg:py-20 bg-brand-forest text-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 md:mb-14 fade-up">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-sage mb-4">The farm share</p>
              <h2 className="text-3xl md:text-4xl font-roca text-white mb-5 leading-tight">
                About 14 cents of every meat dollar reaches the producer.
              </h2>
              <p className="text-base md:text-lg text-brand-cream/80 leading-relaxed">
                A farm share is the farmer's share of the food they grow. Today it is roughly 14 cents on
                the dollar. The other 86 cents pay for the real work of getting an animal from a pasture
                to a plate, done by real businesses. The problem isn't that anyone is taking too much.
                The problem is structural. The farmer is nowhere near the market, and can't see it,
                reach it, or price against it. Farmshare exists to close that distance. Three things move
                a farm share, and the network is being built around all three.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 md:gap-6">
              <div className="bg-white/5 border border-brand-cream/15 rounded-xl p-6 md:p-7 fade-up">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-sage mb-3">Traceability</p>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">Prove what it is</h3>
                <p className="text-sm md:text-base text-brand-cream/75 leading-relaxed">
                  A producer can't be paid for a claim they can't prove. Grass finished, no antibiotics,
                  one ranch, one animal: those are worth money only when the record survives the cut
                  floor. Farmshare keeps a record for every animal that moves through a plant today.
                  Carrying that record intact all the way to the buyer is what the network is being
                  built to do.
                </p>
              </div>

              <div className="bg-white/5 border border-brand-cream/15 rounded-xl p-6 md:p-7 fade-up">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-sage mb-3">Market access</p>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">Reach the buyers that pay</h3>
                <p className="text-sm md:text-base text-brand-cream/75 leading-relaxed">
                  One plant running fifty head a week can't fill a grocery program, a restaurant group,
                  or an institutional contract. Those buyers need volume, consistency, and one point of
                  contact. {NETWORK_STATS.facilities} plants coordinating on shared infrastructure can
                  supply what none of them could supply alone, and not one of them has to merge, sell,
                  or give up its name to do it.
                </p>
              </div>

              <div className="bg-white/5 border border-brand-cream/15 rounded-xl p-6 md:p-7 fade-up">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-sage mb-3">Price discovery</p>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">See what it's worth</h3>
                <p className="text-sm md:text-base text-brand-cream/75 leading-relaxed">
                  Independents negotiate blind. There's no published price for a grass finished carcass
                  sold into a regional restaurant group, so every plant and every producer guesses alone.
                  A network recording real sales across many plants builds the benchmark independents
                  have never had. Knowing the number is most of the work of getting it.
                </p>
              </div>
            </div>

            <p className="text-center text-brand-cream/60 text-sm md:text-base mt-8 md:mt-10 fade-up">
              Proof, reach, and price are the whole argument. Everything Farmshare builds is pointed at
              making the farm share bigger.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          THIRD OPTION FOR PRODUCERS
          ============================================ */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14 fade-up">
            <h2 className="text-2xl md:text-3xl font-roca text-brand-orange mb-4">A Third Option for Producers</h2>
            <p className="text-base md:text-lg text-stone-600">
              Producers with cattle to sell have had two options. Farmshare creates a third.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-brand-cream rounded-xl p-6 md:p-8 fade-up">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Option 1</p>
              <h3 className="text-lg md:text-xl font-bold text-stone-700 mb-3">Sale Barn</h3>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                Commodity price. No control. No relationship with the end buyer.
              </p>
            </div>

            <div className="bg-brand-cream rounded-xl p-6 md:p-8 fade-up">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Option 2</p>
              <h3 className="text-lg md:text-xl font-bold text-stone-700 mb-3">Fee-for-Service + DIY</h3>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                Keep ownership. Now you're marketing quarters, halves, and wholes yourself. That's a different job than raising cattle, and one most producers didn't sign up for.
              </p>
            </div>

            <div className="bg-brand-green rounded-xl p-6 md:p-8 text-white fade-up shadow-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-orange mb-3">The Third Option</p>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">Local Processor + Network Intelligence</h3>
              <p className="text-sm md:text-base text-brand-cream/90 leading-relaxed">
                Keep title past the plant door. The processor does the work, the network finds the buyer, and you get paid on how the beef actually sells. This is the option Farmshare is building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA
          ============================================ */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-roca text-brand-green mb-6">
                Join the Network
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="https://meetings.hubspot.com/henry-arrowood/quad-p-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-green text-white p-6 rounded-lg hover:bg-brand-green/90 transition-colors text-center group transform hover:-translate-y-1 duration-300"
              >
                <div className="mb-3">
                  <Calendar className="h-8 w-8 mx-auto group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold mb-2">Schedule a Demo</h3>
                <p className="text-brand-cream/90 text-sm">See how Farmshare can transform your operation</p>
              </a>

              <a
                href="mailto:sales@farmshare.co"
                className="bg-brand-orange text-white p-6 rounded-lg hover:bg-brand-yellow transition-colors text-center group transform hover:-translate-y-1 duration-300"
              >
                <div className="mb-3">
                  <Mail className="h-8 w-8 mx-auto group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold mb-2">Partner with Farmshare</h3>
                <p className="text-white/90 text-sm">Explore partnership opportunities</p>
              </a>

              <a
                href="https://db9j5.share.hsforms.com/2nger3sAIT7OL3VHUjHxxWw"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-cream border-2 border-brand-green text-brand-green p-6 rounded-lg hover:bg-brand-green hover:text-white transition-colors text-center group transform hover:-translate-y-1 duration-300"
              >
                <div className="mb-3">
                  <Users className="h-8 w-8 mx-auto group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold mb-2">Refer a Processor</h3>
                <p className="group-hover:text-white/90 transition-colors text-sm">Help grow the network</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
