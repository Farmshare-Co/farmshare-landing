import React, { useEffect, useRef, useState } from 'react';
import {
  Factory, Calendar, Clock, Quote, ArrowRight, Phone, FileX, AlertTriangle,
  CalendarX2, Layers, Network, Sparkles, Link2, Mail, ArrowDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoBanner from '../components/LogoBanner';
import PartnerLogoBanner from '../components/PartnerLogoBanner';
import ROICalculator from '../components/ROICalculator';
import AnimatedNumber from '../components/AnimatedNumber';
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

const beliefs = [
  {
    icon: Network,
    iconBg: 'bg-brand-green/10',
    iconColor: 'text-brand-green',
    title: 'The Network Wins',
    body: "One processor can't supply a restaurant chain. Fifty on shared infrastructure can. Independent meat wins by coordinating as one, not by out-competing the Big Four on their own terms.",
  },
  {
    icon: Sparkles,
    iconBg: 'bg-brand-orange/10',
    iconColor: 'text-brand-orange',
    title: 'Intelligence Is the Other Half',
    body: "The Big Four know what to buy, how to cut it, where to sell every piece, and at what price. That is intelligence. Independent processors don't have it yet. Farmshare is building it for them.",
  },
  {
    icon: Link2,
    iconBg: 'bg-brand-yellow/10',
    iconColor: 'text-brand-yellow',
    title: 'Neither Works Alone',
    body: 'Scale without intelligence is a big dumb machine. Intelligence without scale stays on a whiteboard. Farmshare is the coordination layer that gives independents both.',
  },
];

const HOME_TITLE = 'Farmshare | The Operating System for Independent Meat';
const HOME_DESCRIPTION =
  'Farmshare is the coordination layer for independent meat processing. 44 facilities, 27 states, 9,500 producers. Scheduling, cut sheets, and market intelligence.';

export default function Home() {
  const parallaxRef = useRef<HTMLDivElement>(null);
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
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
      }

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
          SECTION 1: HERO — Lead with the thesis
          ============================================ */}
      <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
        <div
          ref={parallaxRef}
          className="parallax-bg"
          style={{
            backgroundImage: 'url(/hero-mission.png)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 to-brand-cream/80"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-7xl mb-6 lg:mb-8 leading-tight text-brand-green font-roca tracking-tight stagger-child">
              Independent Meat Is Better.<br className="hidden md:block" /> It Should Win.
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-stone-700 mb-8 font-medium stagger-child">
              Four companies control 85% of beef processing in America. Their advantage is not quality.
              It is scale and intelligence. Farmshare is the coordination layer that gives independent
              processors both.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center stagger-child">
              <Link
                to="/mission"
                className="bg-brand-green text-white text-lg px-8 py-4 rounded-lg hover:bg-brand-green/90 transition-colors inline-flex items-center justify-center font-bold"
              >
                Read Our Mission
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#platform"
                className="bg-white text-brand-green text-lg px-8 py-4 rounded-lg hover:bg-brand-cream transition-colors inline-flex items-center justify-center font-bold border-2 border-brand-green"
              >
                <ArrowDown className="mr-2 h-5 w-5" />
                I Run a Plant
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: THE NETWORK TODAY — proof of scale
          ============================================ */}
      <section className="py-12 md:py-16 bg-brand-green">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-10 fade-up">
            <h2 className="text-2xl md:text-3xl font-roca text-white mb-3">The Network Today</h2>
            <p className="text-brand-cream/80 max-w-2xl mx-auto">
              Not a plan. Independent plants running on shared infrastructure right now, in every
              region of the country.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="fade-up">
              <p className="text-5xl md:text-6xl font-roca text-brand-yellow mb-2">
                <AnimatedNumber target={NETWORK_STATS.facilities} />
              </p>
              <p className="text-brand-cream/90 font-medium">processing facilities</p>
            </div>
            <div className="fade-up">
              <p className="text-5xl md:text-6xl font-roca text-brand-yellow mb-2">
                <AnimatedNumber target={NETWORK_STATS.states} />
              </p>
              <p className="text-brand-cream/90 font-medium">states</p>
            </div>
            <div className="fade-up">
              <p className="text-5xl md:text-6xl font-roca text-brand-yellow mb-2">
                <AnimatedNumber target={NETWORK_STATS.producers} />
              </p>
              <p className="text-brand-cream/90 font-medium">producers served</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 3: THE PROBLEM
          ============================================ */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-roca text-brand-orange text-center mb-10 md:mb-14 fade-up">
            The Problem
          </h2>

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
              The largest packers do not dominate because they produce better meat. They dominate because
              they coordinate at scale, with intelligence. Independent processors produce the quality and
              traceability consumers want, but they are fragmented, disconnected, and running blind.
              Meanwhile, demand for local meat is surging and new USDA-funded capacity is coming online.
              The opportunity has never been bigger. The infrastructure, and the intelligence, to seize it
              has not existed.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 4: WHAT WE BELIEVE
          ============================================ */}
      <section className="py-12 md:py-16 lg:py-20 bg-brand-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-roca text-brand-orange text-center mb-10 md:mb-14 fade-up">
            What We Believe
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {beliefs.map((belief) => {
              const Icon = belief.icon;
              return (
                <div key={belief.title} className="bg-white rounded-xl p-6 md:p-8 text-center fade-up shadow-sm">
                  <div className={`h-14 w-14 ${belief.iconBg} rounded-full flex items-center justify-center mx-auto mb-5`}>
                    <Icon className={`h-7 w-7 ${belief.iconColor}`} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-brand-green mb-3">{belief.title}</h3>
                  <p className="text-sm md:text-base text-stone-600 leading-relaxed">{belief.body}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10 md:mt-12 fade-up">
            <Link
              to="/mission"
              className="text-brand-green font-bold inline-flex items-center hover:text-brand-orange transition-colors"
            >
              Where this goes next: read the full mission
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 5: PULL QUOTE
          ============================================ */}
      <section className="py-12 md:py-16 bg-brand-green">
        <div className="container mx-auto px-4">
          <p className="max-w-3xl mx-auto text-center text-xl md:text-2xl lg:text-3xl font-roca text-white leading-snug">
            Thousands of independent processors, collectively operating with the intelligence of a Cargill.
            Without any one of them needing to become Cargill.
          </p>
        </div>
      </section>

      {/* ============================================
          SECTION 6: CUSTOMER LOGOS — the network is real
          ============================================ */}
      <LogoBanner />

      {/* ============================================
          SECTION 7: THE PLATFORM — everything below here
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
