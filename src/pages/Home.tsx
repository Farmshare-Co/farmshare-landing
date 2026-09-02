import React, { useEffect, useState } from 'react';
import {
  Factory, Calendar, Clock, Quote, ArrowRight, Phone, FileX, AlertTriangle,
  CalendarX2, Layers, Mail, ArrowDown, ScanLine, Tags, Scissors, Store
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoBanner from '../components/LogoBanner';
import PartnerLogoBanner from '../components/PartnerLogoBanner';
import ROICalculator from '../components/ROICalculator';
import AnimatedNumber from '../components/AnimatedNumber';
import { OwnershipDiagram, NetworkDiagram } from '../components/CoordinationDiagram';
import { NETWORK_STATS, PRESS_EMAIL } from '../constants';

const testimonials = [
  {
    quote: "Scheduling has never been easier! We can manage our appointments in the office or on the go, which for our small business is a BIG deal! What really sets Farmshare apart is their team — energetic, forward-thinking, and genuinely committed to helping businesses like ours run more efficiently.",
    author: "Samantha Stallings",
    company: "The Butcher's Block",
    logo: "https://www.butchersblockva.com/mt-content/uploads/2020/11/thumbnails/butchers-block-black-grunge_m_264x300.png",
  },
  {
    quote: "Farmshare has been a game-changer for our processing operation. Their software's scheduling feature allows our customers to schedule their own appointments with ease, and we can manage our calendar and customer information without the usual hassle. This capability alone has saved us countless hours that we can use for other tasks.",
    author: "Zac Knowles",
    company: "ZK Ranches",
    logo: "/logos/zk-ranches.png",
  },
  {
    quote: "We picked up four new customers in our first month on Farmshare.",
    author: "Chelsea White",
    company: "Adams Farm",
    logo: "/logos/adams-farm.jpg",
  },
  {
    quote: "In a matter of two days, we booked 35 head of cattle, and I didn't have to do a damn thing other than click accept.",
    author: "Spencer Wirt",
    company: "6 in 1 Meats",
    logo: "/logos/6-in-1-meats.jpg",
  },
  {
    quote: "In our first week on Farmshare, we booked new customers from across Pennsylvania and surrounding states. Territory we hadn't reached on our own.",
    author: "Wade Weimer",
    company: "Weimer Meats",
    logo: "/logos/weimer.jpg",
  },
  {
    quote: "I can help more customers more efficiently. More at the same time even.",
    author: "Michelle Rowe",
    company: "Mountain View Custom Meats",
    logo: "/logos/mountain-view.webp",
  },
  {
    quote: "We are raising our prices 10 cents because Farmshare is a value-added service.",
    author: "Ethan Jones",
    company: "S&B Processing",
    logo: "/logos/sb-processing.png",
  },
];

// The intelligence layer, stated the way the deck states it.
const intelligence = [
  { icon: ScanLine, label: 'What to bring in', body: 'Which animals, from which producers, into which week of the calendar.' },
  { icon: Scissors, label: 'How to cut it', body: 'Where the yield actually went, and where it was supposed to go.' },
  { icon: Store, label: 'Who to sell it to', body: 'Which channel wants this carcass, at this weight, this week.' },
  { icon: Tags, label: 'At what price', body: 'What the cut is worth in that channel, instead of the fee set a decade ago.' },
];

const HOME_TITLE = 'Farmshare | The Coordination Layer for Independent Meat';
// Built from NETWORK_STATS so the runtime description can never drift from the
// numbers on the page. The matching literal in index.html is what crawlers and
// link previews read; update both together.
const HOME_DESCRIPTION =
  `Many plants, one network. Farmshare is the coordination layer for independent meat processing: ` +
  `${NETWORK_STATS.facilities} facilities, ${NETWORK_STATS.states} states, ` +
  `${NETWORK_STATS.producers.toLocaleString()} producers.`;

export default function Home() {
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    document.title = HOME_TITLE;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', HOME_DESCRIPTION);
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
      observer.observe(element);
    });

    const handleScroll = () => {
      setShowStickyButton(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Sticky Demo Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
          showStickyButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <a
          href="https://meetings.hubspot.com/henry-arrowood/quad-p-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-orange text-white px-6 py-3 rounded-lg hover:bg-brand-yellow transition-colors inline-flex items-center font-bold shadow-lg hover:shadow-xl"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Schedule Demo
        </a>
      </div>

      {/* ============================================
          SECTION 1: HERO
          Deliberately NOT the Mission hero. No photograph, no parallax,
          no centered essay opening. Dark, left-aligned and typographic,
          in the deck's design language, with the network figures above
          the fold. /mission makes the argument; this states the company.
          ============================================ */}
      <section className="relative bg-brand-forest text-brand-cream overflow-hidden">
        {/* sage accent bar, lifted from the deck title slide */}
        <div className="absolute top-0 left-0 h-full w-1.5 md:w-2 bg-brand-sage"></div>

        <div className="container mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-28 relative">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.24em] text-brand-sage mb-6 md:mb-8 fade-up">
              Coordination without consolidation
            </p>
            <h1 className="font-roca tracking-tight leading-[0.95] text-5xl md:text-6xl lg:text-7xl mb-6 md:mb-8 fade-up">
              Many plants, <br />one network.
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-brand-cream/80 font-medium max-w-3xl mb-8 md:mb-10 fade-up">
              Four companies run most of American beef by coordinating dozens of plants on a single
              balance sheet. Farmshare gives independent processors that same coordination through
              shared infrastructure instead of ownership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 fade-up">
              <a
                href="#platform"
                className="bg-brand-orange text-white text-lg px-8 py-4 rounded-lg hover:bg-brand-yellow transition-colors inline-flex items-center justify-center font-bold"
              >
                <ArrowDown className="mr-2 h-5 w-5" />
                See the Platform
              </a>
              <Link
                to="/mission"
                className="border-2 border-brand-cream/40 text-brand-cream text-lg px-8 py-4 rounded-lg hover:bg-brand-cream hover:text-brand-forest transition-colors inline-flex items-center justify-center font-bold"
              >
                Read the Full Argument
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* The headline, drawn. Decorative, so it is hidden from assistive tech
              and from narrow screens where it would only cost scroll. */}
          <div className="hidden lg:flex lg:col-span-5 justify-center fade-up" aria-hidden="true">
            <NetworkDiagram className="w-full max-w-[340px] h-auto text-brand-sage opacity-70" />
          </div>
          </div>
        </div>

        {/* Network figures, in the hero so they are above the fold */}
        <div className="border-t border-brand-cream/15">
          <div className="container mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-10">
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl">
              <div className="fade-up">
                <p className="text-3xl md:text-5xl font-roca text-brand-sage leading-none mb-2">
                  <AnimatedNumber target={NETWORK_STATS.facilities} />
                </p>
                <p className="text-xs md:text-sm text-brand-cream/70 font-medium">processing facilities</p>
              </div>
              <div className="fade-up">
                <p className="text-3xl md:text-5xl font-roca text-brand-sage leading-none mb-2">
                  <AnimatedNumber target={NETWORK_STATS.states} />
                </p>
                <p className="text-xs md:text-sm text-brand-cream/70 font-medium">states</p>
              </div>
              <div className="fade-up">
                <p className="text-3xl md:text-5xl font-roca text-brand-sage leading-none mb-2">
                  <AnimatedNumber target={NETWORK_STATS.producers} />
                </p>
                <p className="text-xs md:text-sm text-brand-cream/70 font-medium">producers in the network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: THE ARCHITECTURE
          Capacity got built. Coordination did not.
          ============================================ */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-orange mb-4">The Architecture</p>
            <h2 className="text-3xl md:text-4xl font-roca text-brand-green mb-5 leading-tight">
              Capacity got built. Coordination did not.
            </h2>
            <p className="text-base md:text-lg text-stone-700 leading-relaxed">
              A wave of investment put new kill floors, coolers, and fab rooms into rural America. A
              plant that opened in 2023 still runs on a paper calendar, a phone, and hand-keyed cut
              sheets. The buildings went up. The layer that makes a building productive did not.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="bg-brand-cream rounded-2xl p-7 md:p-9 fade-up">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-3">Ownership</p>
              <h3 className="text-xl md:text-2xl font-roca text-stone-700 mb-5">The Big Four</h3>
              <div className="text-stone-500 mb-5">
                <OwnershipDiagram className="w-full max-w-[220px] mx-auto h-auto" />
              </div>
              <p className="font-bold text-stone-700 mb-2">Ten plants. One balance sheet.</p>
              <p className="text-sm md:text-base text-stone-600 leading-relaxed">
                One sourcing desk, one sales organization, one price book, one information system.
                That is the advantage, and it was bought with consolidation.
              </p>
            </div>

            <div className="bg-brand-green rounded-2xl p-7 md:p-9 text-white fade-up shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-sage mb-3">Shared infrastructure</p>
              {/* Brand rule: the wordmark is the logo file, never type. */}
              <img
                src="https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content//farmshare%20(1).svg"
                alt="Farmshare"
                className="h-9 md:h-10 w-auto mb-5 brightness-0 invert"
              />
              <div className="text-brand-sage mb-5">
                <NetworkDiagram className="w-full max-w-[220px] mx-auto h-auto" />
              </div>
              <p className="font-bold text-white mb-2">Many plants. One network.</p>
              <p className="text-sm md:text-base text-brand-cream/90 leading-relaxed">
                Every plant stays independently owned. The sourcing, the pricing, the buyers, and the
                intelligence are shared. Scale without anyone selling the family business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: THE 10:1 RULE + THE INTELLIGENCE LAYER
          ============================================ */}
      <section className="py-14 md:py-20 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 md:mb-14 fade-up">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-orange mb-4">Where the money is</p>
              <h2 className="text-3xl md:text-4xl font-roca text-brand-green mb-5 leading-tight">
                Processing is not where this is won.
              </h2>
            </div>

            {/* The 10:1 idea, carried by type scale instead of figures. */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-8 mb-8 fade-up">
              <div className="bg-white rounded-2xl px-7 py-8 text-center shadow-sm">
                <p className="text-xl md:text-2xl font-roca text-stone-400 mb-2">The processing fee</p>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">where the industry competes</p>
              </div>
              <p className="text-center font-roca text-stone-400 text-lg">vs.</p>
              <div className="bg-white rounded-2xl px-7 py-8 text-center shadow-lg ring-2 ring-brand-green/20">
                <p className="text-3xl md:text-5xl font-roca text-brand-green mb-2">The animal itself</p>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-green">where the leverage has always been</p>
              </div>
            </div>

            <p className="text-base md:text-lg text-stone-700 leading-relaxed text-center max-w-2xl mx-auto mb-12 md:mb-16 fade-up">
              An animal is worth many times what it costs to process. The industry spends its energy on
              the fraction, competing on the fee. Almost nobody works the other side of that ratio,
              because getting at it takes information an independent plant has never had.
            </p>

            <div className="text-center mb-8 md:mb-10 fade-up">
              <h3 className="text-2xl md:text-3xl font-roca text-brand-green mb-3">The intelligence layer</h3>
              <p className="text-base md:text-lg text-stone-600 max-w-2xl mx-auto">
                Four decisions decide whether an animal earns what it is worth. Farmshare is building
                each one, for operations of any size.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {intelligence.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-white rounded-xl p-6 fade-up shadow-sm">
                    <Icon className="h-6 w-6 text-brand-orange mb-4" />
                    <h4 className="font-bold text-brand-green mb-2">{item.label}</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: THE FARM SHARE
          Why the company is called what it is called. This is an ethos,
          not a description of a mechanism. Nothing here claims a capability
          that has not shipped.
          ============================================ */}
      <section className="py-14 md:py-20 bg-brand-forest text-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 md:mb-14 fade-up">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-sage mb-4">The farm share</p>
              <h2 className="text-3xl md:text-4xl font-roca text-white mb-5 leading-tight">
                14 cents of every meat dollar reaches the producer.
              </h2>
              <p className="text-base md:text-lg text-brand-cream/80 leading-relaxed max-w-2xl mx-auto">
                The other 86 cents go to everything standing between the farm and the plate. Not because the
                farmer's work is worth less. Because the farmer is nowhere near the market.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 md:gap-6">
              <div className="bg-white/5 border border-brand-cream/15 rounded-xl p-6 md:p-7 fade-up">
                <h3 className="text-lg font-bold text-white mb-3">Too many steps</h3>
                <p className="text-sm md:text-base text-brand-cream/75 leading-relaxed">
                  Between the pasture and the plate sit buyers, feeders, packers, distributors, brokers,
                  and retailers. Every one of them takes a margin. None of them are the farmer.
                </p>
              </div>

              <div className="bg-white/5 border border-brand-cream/15 rounded-xl p-6 md:p-7 fade-up">
                <h3 className="text-lg font-bold text-white mb-3">Too far from the market</h3>
                <p className="text-sm md:text-base text-brand-cream/75 leading-relaxed">
                  The people who raise the food have almost no contact with the people who eat it. That
                  distance is what makes 14 cents possible, and it has been widening for decades.
                </p>
              </div>

              <div className="bg-white/5 border border-brand-cream/15 rounded-xl p-6 md:p-7 fade-up">
                <h3 className="text-lg font-bold text-white mb-3">A shorter path</h3>
                <p className="text-sm md:text-base text-brand-cream/75 leading-relaxed">
                  Farmshare exists to close that distance. Fewer hands between the farm and the plate,
                  and routes to market that do not run through the consolidated channel.
                </p>
              </div>
            </div>

            <p className="text-center text-brand-cream/60 text-sm mt-8 md:mt-10 fade-up">
              A farm share is the farmer's share of the food they grow. Everything we build is pointed
              at making it bigger.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: TO THE FULL ARGUMENT
          ============================================ */}
      <section className="py-10 md:py-12 bg-white border-b border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <p className="text-lg md:text-xl font-roca text-brand-green leading-snug mb-5">
              Thousands of independent processors, collectively operating with the intelligence of a
              Cargill. Without any one of them needing to become Cargill.
            </p>
            <Link
              to="/mission"
              className="text-brand-orange font-bold inline-flex items-center hover:text-brand-green transition-colors"
            >
              The full argument
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 6: CUSTOMER LOGOS. The network is real.
          ============================================ */}
      <LogoBanner />

      {/* ============================================
          SECTION 7: THE PLATFORM. Everything below here
          is the existing product funnel, unchanged.
          ============================================ */}
      <section id="platform" className="py-12 md:py-16 bg-brand-cream scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-3">The Platform</p>
            <h2 className="text-3xl md:text-4xl font-roca text-brand-green mb-4">
              It Starts With Running a Better Plant
            </h2>
            <p className="text-lg text-stone-600">
              A coordination layer has to be worth using on day one. Farmshare starts where every
              independent processor feels the pain, and grows from there.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          PRODUCT: PAIN — The daily grind
          ============================================ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-roca text-brand-green text-center mb-4 fade-up">Sound Familiar?</h2>
            <p className="text-xl text-stone-500 text-center mb-12 fade-up">Most processors we talk to are dealing with the same problems every single week.</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-brand-cream rounded-xl p-6 fade-up text-center">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Phone className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-brand-green mb-2">Phone Tag All Day</h3>
                <p className="text-stone-600">Hours spent calling customers back about scheduling, cut instructions, and pickup times—instead of actually processing.</p>
              </div>

              <div className="bg-brand-cream rounded-xl p-6 fade-up text-center">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FileX className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-brand-green mb-2">Paper Cut Sheets &amp; Errors</h3>
                <p className="text-stone-600">Illegible faxes, missing instructions, and mistakes that cost time and product. Customers get frustrated, your team gets blamed.</p>
              </div>

              <div className="bg-brand-cream rounded-xl p-6 fade-up text-center">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-brand-green mb-2">No-Shows &amp; Lost Revenue</h3>
                <p className="text-stone-600">Empty slots from cancellations and no-shows. No waitlist to fill them. Revenue walks out the door every week.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PRODUCT: COST — What it adds up to
          ============================================ */}
      <section className="py-12 bg-brand-green">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8 fade-up">
            <h2 className="text-3xl font-roca text-white mb-2">What It's Costing You</h2>
            <p className="text-brand-cream/70">Every week, the same problems quietly drain hours, bookings, and revenue.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="fade-up flex flex-col items-center">
              <div className="h-16 w-16 bg-brand-orange/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-brand-orange/30">
                <Clock className="h-8 w-8 text-brand-yellow" />
              </div>
              <p className="text-2xl font-bold text-white font-roca">Hours of Admin</p>
              <p className="text-brand-cream/80 font-medium mt-1">Phone tag, paper cut sheets, manual invoicing</p>
            </div>
            <div className="fade-up flex flex-col items-center">
              <div className="h-16 w-16 bg-brand-orange/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-brand-orange/30">
                <CalendarX2 className="h-8 w-8 text-brand-yellow" />
              </div>
              <p className="text-2xl font-bold text-white font-roca">Empty Slots</p>
              <p className="text-brand-cream/80 font-medium mt-1">No-shows and cancellations with no waitlist to fill them</p>
            </div>
            <div className="fade-up flex flex-col items-center">
              <div className="h-16 w-16 bg-brand-orange/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-brand-orange/30">
                <Layers className="h-8 w-8 text-brand-yellow" />
              </div>
              <p className="text-2xl font-bold text-white font-roca">Six Tools, No Source of Truth</p>
              <p className="text-brand-cream/80 font-medium mt-1">Calendar here, spreadsheet there, sticky notes everywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          PRODUCT: SOLUTION — How Farmshare fixes it
          ============================================ */}
      <section className="py-20 bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-4xl font-roca text-brand-green mb-4">One Platform. Everything You Need.</h2>
            <p className="text-xl text-stone-600">Replace your calendar, spreadsheets, cut cards, and text threads with a single dashboard built for how your plant actually runs.</p>
          </div>

          <div className="grid md:grid-cols-2 items-center gap-8 mb-20">
            <div className="fade-up">
              <div className="flex items-center space-x-4 mb-6 stagger-child">
                <Factory className="h-8 w-8 text-brand-green" />
                <h3 className="text-3xl font-roca text-brand-orange">Smart Scheduling</h3>
              </div>
              <p className="text-xl text-stone-700 leading-relaxed mb-6 stagger-child">
                Customers book their own harvest slots through your online portal. Capacity limits prevent overbooking. Drag-and-drop rescheduling keeps your week balanced. Waitlist automation fills cancellations instantly.
              </p>
            </div>
            <div className="rounded-lg shadow-[0_20px_50px_rgba(0,111,53,0.2)] overflow-hidden fade-up">
              <video
                className="w-full h-full object-cover"
                autoPlay muted loop playsInline
                disablePictureInPicture disableRemotePlayback
                preload="metadata" poster=""
              >
                <source src="https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/smart-scheduling.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="grid md:grid-cols-2 items-center gap-8 mb-20">
            <div className="order-2 md:order-1 rounded-lg shadow-[0_20px_50px_rgba(0,111,53,0.2)] overflow-hidden fade-up">
              <video
                className="w-full h-full object-cover"
                autoPlay muted loop playsInline
                disablePictureInPicture disableRemotePlayback
                preload="none" poster=""
              >
                <source src="https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/New%20cut%20sheet%20flow.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="order-1 md:order-2 fade-up">
              <div className="flex items-center space-x-4 mb-6 stagger-child">
                <Factory className="h-8 w-8 text-brand-green" />
                <h3 className="text-3xl font-roca text-brand-orange">Digital Cut Sheets</h3>
              </div>
              <p className="text-xl text-stone-700 leading-relaxed mb-6 stagger-child">
                No more illegible faxes or missed instructions. Customers submit cut selections online from reusable templates. Your team gets clean, reliable specs at the point of cut—every time.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 items-center gap-8">
            <div className="fade-up">
              <div className="flex items-center space-x-4 mb-6 stagger-child">
                <Factory className="h-8 w-8 text-brand-green" />
                <h3 className="text-3xl font-roca text-brand-orange">Automated Notifications</h3>
              </div>
              <p className="text-xl text-stone-700 leading-relaxed mb-6 stagger-child">
                Automated text and email reminders for drop-offs, pickups, and missing cut sheets. Customers stay informed without your team picking up the phone—so no-shows drop and your floor stays focused.
              </p>
            </div>
            <div className="rounded-lg shadow-[0_20px_50px_rgba(0,111,53,0.2)] overflow-hidden fade-up">
              <video
                className="w-full h-full object-cover"
                autoPlay muted loop playsInline
                disablePictureInPicture disableRemotePlayback
                preload="none" poster=""
              >
                <source src="https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/new%20customer%20notifications.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="text-center mt-12 fade-up">
            <Link
              to="/features"
              className="bg-brand-orange text-white text-lg px-8 py-4 rounded-lg hover:bg-brand-yellow transition-colors inline-flex items-center font-bold"
            >
              See All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 8: TESTIMONIALS
          ============================================ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-roca text-brand-green text-center fade-up">What Processors Are Saying</h2>
        </div>
        <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="flex w-max gap-8 animate-marquee group-hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, index) => (
              <div key={index} className="bg-brand-cream p-8 rounded-lg shadow-lg flex flex-col w-[360px] md:w-[420px] flex-shrink-0">
                <Quote className="h-8 w-8 text-brand-orange mb-4 flex-shrink-0" />
                <p className="text-lg italic text-stone-700 mb-6 leading-relaxed flex-grow">
                  {t.quote}
                </p>
                <div className="flex items-center flex-shrink-0">
                  {t.logo ? (
                    <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden p-1 mr-4">
                      <img
                        src={t.logo}
                        alt={t.company}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy" decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-brand-green flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">{t.company.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-brand-green">{t.author}</p>
                    <p className="text-stone-600">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 9: ROI CALCULATOR
          ============================================ */}
      <ROICalculator />

      {/* Partners */}
      <PartnerLogoBanner />

      {/* ============================================
          SECTION 10: BUYER CTA — Secondary audience
          ============================================ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h2 className="text-3xl md:text-4xl font-roca text-brand-green mb-4 stagger-child">Looking to Buy Local Beef?</h2>
            <p className="text-lg text-stone-600 mb-8 max-w-xl mx-auto stagger-child">
              Tell us what you're looking for — quarter, half, or whole — and we'll connect you with an independent processor in your area.
            </p>
            <Link
              to="/buy-beef"
              className="bg-brand-green text-white text-lg px-8 py-4 rounded-lg hover:bg-brand-green/90 transition-colors inline-flex items-center justify-center font-bold stagger-child"
            >
              Find Beef Near You
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 11: FINAL CTA
          ============================================ */}
      <section className="py-20 bg-brand-green">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h2 className="text-3xl md:text-4xl font-roca text-white mb-6 stagger-child">Ready to Run a Tighter Plant?</h2>
            <p className="text-xl text-brand-cream/80 mb-8 stagger-child">
              See how Farmshare can save your team hours every day. Most processors are up and running in under two weeks.
            </p>
            <a
              href="https://meetings.hubspot.com/henry-arrowood/quad-p-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-orange text-white text-lg px-8 py-4 rounded-lg hover:bg-brand-yellow transition-colors inline-flex items-center font-bold stagger-child"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 12: PRESS & MEDIA
          ============================================ */}
      <section className="py-12 bg-brand-cream border-t border-stone-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h2 className="text-xl md:text-2xl font-roca text-brand-green mb-3">Press and Media</h2>
            <p className="text-stone-600 mb-5">
              Reporters, researchers, and policy staff: reach Henry Arrowood, founder and CEO, directly.
            </p>
            <a
              href={`mailto:${PRESS_EMAIL}`}
              className="inline-flex items-center font-bold text-brand-green hover:text-brand-orange transition-colors"
            >
              <Mail className="mr-2 h-5 w-5" />
              {PRESS_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
