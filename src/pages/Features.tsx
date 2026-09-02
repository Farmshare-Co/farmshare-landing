import React, { useEffect, useRef, useState } from 'react';
import { Calendar, CalendarClock, FileText, MessageSquare, Bell, Users, ClipboardList, Receipt, UserCircle, BarChart3, Smartphone, Boxes, ChefHat, ScanBarcode, Printer, Beef, Repeat, Plug } from 'lucide-react';

export default function Features() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [activeTab, setActiveTab] = useState('scheduling');

  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = 'Meat Processing Software Features — Scheduling, Cut Sheets & More | Farmshare';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'See how Farmshare streamlines every step of your operation — from auto-scheduling and digital cut sheets to customer messaging, job tracking, and invoicing.');
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

  const features = {
    scheduling: {
      title: 'Smart Scheduling',
      icon: CalendarClock,
      description: 'Save time and increase throughput with Farmshare\'s smart calendar system. Customers book their own harvest slots online, capacity limits prevent overbooking, and waitlist automation fills cancellations instantly.',
      bullets: [
        'Self-Serve Booking: Customers request slots directly through your online scheduling portal',
        'Capacity-Aware Calendar: Set daily limits by species or inspection level to prevent overbooking',
        'Drag-and-Drop Rescheduling: Balance your weekly workload by moving jobs with a click',
        'Waitlist Backfill: Automatically notify waitlisted customers when a slot opens up'
      ],
      video: 'https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/smart-scheduling.mp4'
    },
    cutsheets: {
      title: 'Digital Cut Sheets',
      icon: FileText,
      description: 'Ditch the paper. Customers submit their cut selections online from reusable templates. Your team gets clean, reliable instructions at the point of cut\u2014every time.',
      bullets: [
        'Reusable Templates: Customers duplicate past cut sheets with one click',
        'Processor-Defined Logic: Enforce business rules to prevent impossible or conflicting selections',
        'Custom Configuration: Tailor layout, categories, extras, and trim to match your workflow',
        'Print Anywhere: View and print cut sheets from the office or the cut room'
      ],
      video: 'https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/New%20cut%20sheet%20flow.mp4'
    },
    notifications: {
      title: 'Automated Notifications',
      icon: Bell,
      description: 'Stop chasing customers by phone. Farmshare sends automatic text and email updates at every stage\u2014so your team stays focused on processing, not communicating.',
      bullets: [
        'Drop-off & Pickup Reminders: Customers get notified automatically with dates and instructions',
        'Missing Info Alerts: Flag missing cut sheets or incomplete orders before they become problems',
        'Status Updates: Customers know when their animal is harvested, hanging, cut, and ready',
        'Custom Templates: Save time with reusable message formats for common touchpoints'
      ],
      video: 'https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/new%20customer%20notifications.mp4'
    },
    portal: {
      title: 'Customer Portal',
      icon: Users,
      description: 'Your customers get their own portal to book, submit cut sheets, and track order status\u2014all from their phone. Free for every producer and end customer on your plant.',
      bullets: [
        'Self-Service Booking: Producers pick available dates and submit requests without calling',
        'Digital Cut Sheet Submission: Customers fill out selections online instead of faxing or handwriting',
        'Order Status Tracking: Real-time visibility into where their animal is in the process',
        'No Cost to Customers: The portal is free for every producer when their processor is on Farmshare'
      ],
      video: 'https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/new%20producer%20portal.mp4'
    },
    tracking: {
      title: 'Job Tracking',
      icon: ClipboardList,
      description: 'Track every animal from drop-off to pickup. Farmshare keeps your team aligned with clear status stages and full visibility from a single dashboard.',
      bullets: [
        'Status Stages: Every job moves through Scheduled \u2192 Dropped Off \u2192 Harvested \u2192 Hanging \u2192 Cut \u2192 Packaged \u2192 Ready for Pickup \u2192 Complete',
        'Single Dashboard: See all active jobs, their status, and what needs attention today',
        'Tracking Numbers: Every animal gets a unique ID from arrival to pickup',
        'Team Alignment: Everyone from the kill floor to the front office sees the same data'
      ],
      video: 'https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/job-tracking.mp4'
    },
    invoicing: {
      title: 'Invoicing',
      icon: Receipt,
      description: 'Invoices are generated automatically from hanging weights and cut sheet selections. No manual math, no transcription errors, no double entry.',
      bullets: [
        'Auto-Calculated: Charges computed from actual carcass weight, slaughter fee, and processing fee',
        'Line Item Detail: Every charge tied to real weights and customer selections',
        'Finalize & Send: Review, approve, and send invoices to customers in one click',
        'Accounting Export: Export billing and payment data to QuickBooks or your accounting system'
      ],
      video: 'https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/invoicing.mp4'
    },
    profiles: {
      title: 'Customer Profiles',
      icon: UserCircle,
      description: 'Every customer gets a complete profile with their full history\u2014jobs, cut preferences, weights, and payments. Your office team never has to dig through files again.',
      bullets: [
        'Full Job History: See every past and current job for any customer at a glance',
        'Cut Preferences: Know what each customer typically orders before they even submit',
        'Weight & Yield Records: Historical hanging weights, yield percentages, and trends',
        'Payment History: Track invoices, balances, and payment status per customer'
      ],
      video: 'https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/customer-profiles.mp4'
    },
    reporting: {
      title: 'Reporting',
      icon: BarChart3,
      description: 'See how your plant is performing at a glance. Farmshare tracks throughput, species mix, and customer trends so you can make smarter decisions about your operation.',
      bullets: [
        'Weekly Throughput: Monitor how many head you\'re processing week over week',
        'Species Breakdown: See your mix of beef, hog, lamb, and other species over time',
        'Customer Trends: Identify your most active customers and seasonal patterns',
        'Yield Tracking: Compare hanging weights and cut yields across jobs'
      ],
      video: 'https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/New%20demo%20videos/reporting.mp4'
    }
  };

  // Inventory Management v2. In shaping and being demoed, not generally
  // available, so every line here describes the module as it is being built
  // rather than promising a switch a customer can flip today.
  const inventoryCapabilities = [
    {
      icon: Boxes,
      title: 'Products, Priced and Costed',
      body: 'SKUs seed themselves from your cut sheet catalog, with sub-SKUs where you need them. Set retail and wholesale price, and cost to manufacture, so margin is visible product by product. On-hand quantity and low-stock alerts come with it.'
    },
    {
      icon: ChefHat,
      title: 'Recipes for Finished Products',
      body: 'Define the inputs to a finished product by amount, weight, or percentage. Ingredients decrement as the batch runs, and the system checks whether you can actually make the batch before anyone starts it.'
    },
    {
      icon: ScanBarcode,
      title: 'Batch and Lot Tracking',
      body: 'Batches and lots tracked back to the supplier they came from. When a recall question comes, the answer is a lookup instead of a search through paperwork.'
    },
    {
      icon: Printer,
      title: 'Packing Station',
      body: 'One view that puts yield, invoicing, and labeling together, printing labels as the work happens instead of reconciling all three afterward.'
    },
    {
      icon: Beef,
      title: 'Per-Primal Box Beef',
      body: 'Scan each piece in and out rather than eyeballing what came out of a hundred pound box. Yield on boxed beef stops being an estimate.'
    },
    {
      icon: Repeat,
      title: 'Further Processing Orders',
      body: 'Start from the output you need, say 100 pounds of brats, and wind back to what is already in inventory and what still has to be sourced.'
    },
    {
      // Integrations, not one integration. Farmshare is the layer between the
      // systems a plant already runs. QuickBooks push is the furthest along and
      // is the concrete example; the online store connection and the plant
      // system translation layer are in flight, so they are named as in
      // development and no third-party system is claimed as shipped.
      icon: Plug,
      title: 'Works With the Systems You Already Run',
      body: 'A plant does not get to throw out its accounting, its online store, or the system on the kill floor. Farmshare is built to sit between them so the same numbers are not keyed twice. QuickBooks is furthest along: map SKUs to your accounts once, then push inventory and sales activity across without re-keying it. In development now are a store connection that turns wholesale orders into pick lists, and a translation layer for the plant systems already in place.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
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

      <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden">
        <div
          ref={parallaxRef}
          className="parallax-bg"
          style={{
            backgroundImage: 'url("/hero-facility.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-brand-cream/70"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-7xl mb-4 md:mb-6 lg:mb-8 leading-tight text-brand-green font-roca tracking-tight stagger-child">
              Everything You Need to Run a Tighter Plant
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-stone-600 mb-6 lg:mb-8 font-medium stagger-child">
              From scheduling to invoicing, see how Farmshare streamlines every step of your operation.
            </p>
            <a
              href="https://meetings.hubspot.com/henry-arrowood/quad-p-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-orange text-white text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-brand-yellow transition-colors inline-flex items-center font-bold stagger-child"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Smart Features — tabbed breakdown right after hero */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-roca text-brand-green text-center mb-12">Everything Your Plant Needs in One System</h2>

            {/* Feature Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Object.entries(features).map(([key, feature]) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      activeTab === key
                        ? 'bg-brand-orange text-white'
                        : 'bg-brand-cream text-stone-700 hover:bg-brand-orange/10'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    <span className="font-medium">{feature.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Feature Content */}
            {Object.entries(features).map(([key, feature]) => (
              <div
                key={key}
                className={`transition-all duration-300 ${
                  activeTab === key ? 'opacity-100' : 'hidden opacity-0'
                }`}
              >
                <div className="bg-brand-cream rounded-lg overflow-hidden shadow-lg p-8">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-brand-green mb-4 flex items-center">
                      <feature.icon className="h-6 w-6 mr-2 text-brand-orange" />
                      {feature.title}
                    </h3>
                    <p className="text-stone-700">{feature.description}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="relative h-[300px] rounded-lg overflow-hidden">
                      <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster=""
                      >
                        <source src={feature.video} type="video/mp4" />
                      </video>
                    </div>

                    <ul className="space-y-4">
                      {feature.bullets.map((bullet, index) => {
                        const [title, description] = bullet.split(': ');
                        return (
                          <li key={index} className="flex flex-col">

                            <span className="font-bold text-brand-green">{title}</span>
                            <span className="text-stone-700">{description}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          INVENTORY AND FURTHER PROCESSING
          Everything above this point sells saved hours. This is the first
          surface that is about what the animal is worth instead of what the
          admin costs, so it is framed on yield and revenue.
          Deliberately NOT the page lead. Inventory is not a universal pitch,
          and overselling it to a plant that wanted custom-work labeling has
          already cost us an account. It sits here, mid page, clearly marked
          as an additional surface for plants doing retail, wholesale, or
          further processing, and clearly marked as still rolling out.
          ============================================ */}
      <section id="inventory" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 fade-up">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-3">
                For plants doing retail, wholesale, or further processing
              </p>
              <h2 className="text-3xl md:text-4xl font-roca text-brand-green mb-4">
                Get More Out of the Same Animal
              </h2>
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed">
                Everything above this saves your team hours. This part is about revenue. An animal is
                worth many times what it costs to process it, and most of that value is decided after
                the carcass is broken down. Inventory and further processing put numbers on that side
                of the ledger: what you made, what it cost to make, and what it is actually worth.
              </p>
            </div>

            {/* Status is stated plainly. This module is in shaping and being
                demoed; it is not something a plant can switch on today. */}
            <div className="bg-brand-cream border border-stone-200 rounded-lg px-6 py-5 mb-10 fade-up">
              <p className="text-sm md:text-base text-stone-700 leading-relaxed">
                <span className="font-bold text-brand-green">Where this stands.</span>{' '}
                Inventory Management v2 is in shaping now and being demoed with processors. It is
                rolling out plant by plant as pieces are ready, not switched on across every account.
                If it is a fit for your operation, ask to see it on your demo and we will show you
                what is live and what is still being built.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {inventoryCapabilities.map((item, index) => {
                const Icon = item.icon;
                // An odd number of cards would leave a half-empty final row.
                const isLoneLastCard =
                  index === inventoryCapabilities.length - 1 &&
                  inventoryCapabilities.length % 2 === 1;
                return (
                  <div
                    key={item.title}
                    className={`bg-brand-cream rounded-lg p-6 fade-up ${isLoneLastCard ? 'md:col-span-2' : ''}`}
                  >
                    <Icon className="h-7 w-7 text-brand-orange mb-4" />
                    <h3 className="text-lg font-bold text-brand-green mb-2">{item.title}</h3>
                    <p className="text-stone-700 leading-relaxed">{item.body}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-10 fade-up">
              <a
                href="https://meetings.hubspot.com/henry-arrowood/quad-p-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-green text-white text-lg px-8 py-4 rounded-lg hover:bg-brand-green/90 transition-colors inline-flex items-center font-bold"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Ask About Inventory on Your Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Your Customers Will Love It Too */}
      <section className="py-20 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-roca text-brand-green text-center mb-4 fade-up">Your Customers Will Love It Too</h2>
            <p className="text-xl text-stone-600 text-center mb-12 fade-up">When booking, cut sheets, and updates all live on their phone, your customers stop calling—and start coming back.</p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center fade-up">
                <Smartphone className="h-12 w-12 text-brand-orange mx-auto mb-6" />
                <h3 className="text-xl font-bold text-brand-green mb-4">Booked in Two Minutes</h3>
                <p className="text-stone-700">Producers see your real availability and grab a slot from their phone—no phone tag, no waiting until office hours.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg text-center fade-up">
                <ClipboardList className="h-12 w-12 text-brand-orange mx-auto mb-6" />
                <h3 className="text-xl font-bold text-brand-green mb-4">Cut Sheets Without the Phone Call</h3>
                <p className="text-stone-700">Customers submit cut selections from their phone, on their own time. Reusable templates remember their preferences—no faxes, no rewrites, no errors at drop-off.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg text-center fade-up">
                <Bell className="h-12 w-12 text-brand-orange mx-auto mb-6" />
                <h3 className="text-xl font-bold text-brand-green mb-4">Always In the Loop</h3>
                <p className="text-stone-700">Text and email updates at every stage—hanging, cut, ready for pickup. They never call to check status again.</p>
              </div>
            </div>
            <p className="text-center text-stone-500 mt-8 fade-up">Free for producers and end customers when their processor is on Farmshare.</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center fade-up">
          <h2 className="text-2xl md:text-3xl font-roca text-brand-orange mb-4 md:mb-6 stagger-child">Ready to Run a Tighter Plant?</h2>
          <p className="text-base md:text-xl text-stone-700 mb-6 md:mb-8 stagger-child">
            Most plants are up and running in under two weeks. See how Farmshare can work for yours.
          </p>
          <a
            href="https://meetings.hubspot.com/henry-arrowood/quad-p-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-orange text-white text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-brand-yellow transition-colors inline-flex items-center font-bold stagger-child"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Schedule Your Demo
          </a>
        </div>
      </div>
    </div>
  );
}
