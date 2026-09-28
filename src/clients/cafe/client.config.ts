import type { ClientConfigInput } from "@/config/schema";

/**
 * Demo client 2 of 3: a specialty roaster and all-day cafe.
 *
 * Fictional. `demo: true` keeps every page noindexed — see the note on the schema's
 * `demo` field for why fake local-business data must never reach the index.
 */
export const cafe: ClientConfigInput = {
  id: "cafe",
  businessType: "cafe",
  demo: true,

  name: "Fitzroy Ember Coffee Roasters",
  legalName: "Ember Lane Coffee Pty Ltd",
  tagline: "Roasted out the back on Gertrude Street",
  description:
    "A specialty coffee roaster and all-day cafe on Gertrude Street, Fitzroy. We roast every bean we serve, cook breakfast and lunch from 7am, supply wholesale coffee across Melbourne's inner north, and teach people how to pull a better shot.",
  foundedYear: 2014,

  site: {
    url: "https://fitzroyroasters.duckdns.org",
    locale: "en-AU",
    timezone: "Australia/Melbourne",
    titleTemplate: "%s | Fitzroy Ember Coffee Roasters",
  },

  contact: {
    phone: "+61390240188",
    phoneDisplay: "(03) 9024 0188",
    email: "hello@fitzroyroasters.duckdns.org",
    bookingUrl: "https://fitzroyroasters.duckdns.org/bookings",
    emergency: false,
  },

  address: {
    streetAddress: "214 Gertrude Street",
    suburb: "Fitzroy",
    state: "VIC",
    postcode: "3065",
    country: "AU",
    geo: { lat: -37.8012, lng: 144.9795 },
    mapUrl: "https://maps.google.com/?q=214+Gertrude+Street+Fitzroy+VIC+3065",
  },

  hours: {
    regular: [
      { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], opens: "07:00", closes: "15:30" },
      { days: ["Sat"], opens: "08:00", closes: "16:00" },
      { days: ["Sun"], opens: "08:00", closes: "15:00" },
    ],
    alwaysOpen: false,
    closures: [
      { date: "2026-12-25", name: "Christmas Day" },
      { date: "2026-12-26", name: "Boxing Day" },
      { date: "2027-01-01", name: "New Year's Day" },
    ],
  },

  serviceAreas: [
    {
      slug: "fitzroy",
      name: "Fitzroy",
      state: "VIC",
      postcode: "3065",
      geo: { lat: -37.7986, lng: 144.9784 },
      priority: 10,
      blurb:
        "Our own block. Gertrude Street runs on shift work: tradies and nurses from the Peter Mac end before 8am, gallery and studio people mid-morning, then the Brunswick Street crowd drifting east for a late lunch. The housing is terraces and the Atherton Gardens towers within the same few hundred metres, which is why the menu has a $7 egg roll on it as well as a $26 grain bowl.",
      landmarks: [
        "Rose Street Artists' Market",
        "Atherton Gardens",
        "Gertrude Contemporary",
        "Brunswick Street",
      ],
      adjacentTo: ["collingwood", "carlton"],
    },
    {
      slug: "collingwood",
      name: "Collingwood",
      state: "VIC",
      postcode: "3066",
      geo: { lat: -37.8021, lng: 144.988 },
      priority: 8,
      blurb:
        "Five minutes east and the buildings get bigger: old knitting mills and printworks turned into design studios, record labels and physio clinics. Collingwood comes to us for meetings rather than breakfast, and it is where most of our office wholesale accounts sit — a bench grinder, a two-group machine in a kitchenette, and someone nominated to keep it clean.",
      landmarks: ["Smith Street", "Johnston Street", "Collingwood Town Hall", "Victoria Park"],
      adjacentTo: ["fitzroy", "northcote"],
    },
    {
      slug: "carlton",
      name: "Carlton",
      state: "VIC",
      postcode: "3053",
      geo: { lat: -37.7983, lng: 144.9671 },
      priority: 7,
      blurb:
        "Carlton moves on the university timetable. From March the Lygon Street end fills with students who want something cheap and fast, and the Elgin Street end with academics who will sit with a filter for an hour arguing about a paper. It is also the suburb with the longest espresso memory in Melbourne, so a dark-roast regular will tell you exactly what they think of a light one.",
      landmarks: ["University of Melbourne", "Lygon Street", "Carlton Gardens", "Melbourne Museum"],
      adjacentTo: ["fitzroy"],
    },
    {
      slug: "northcote",
      name: "Northcote",
      state: "VIC",
      postcode: "3070",
      geo: { lat: -37.7699, lng: 145.0 },
      priority: 6,
      blurb:
        "Up the 86 tram line, Northcote is prams before ten and gig posters after dark. Weekends bring families down from the High Street end who buy a 1kg bag on the way out, and the venues here are small and owner-operated — one machine, one grinder, a crowd that has been coming for a decade and would notice a blend change immediately.",
      landmarks: ["High Street", "Merri Creek trail", "Northcote Town Hall", "All Nations Park"],
      // Not Fitzroy: Clifton Hill and Collingwood sit in between, so the honest route
      // between them is via Collingwood, which is the link the graph should suggest.
      adjacentTo: ["collingwood"],
    },
  ],

  services: [
    {
      slug: "dine-in-breakfast-and-lunch",
      name: "Dine-in breakfast and lunch",
      category: "dine-in",
      shortDescription:
        "All-day breakfast and lunch in Fitzroy, cooked to order from 7am on a single menu that does not switch over at 11.",
      answer:
        "Yes — we serve breakfast and lunch from 7am on weekdays and 8am on weekends, right through to the last order half an hour before close. The kitchen runs one menu all day, so eggs at 2pm are never a problem, alongside grain bowls, toasties and a rotating pasta special.",
      body: `## One menu, all day

Breakfast and lunch come off the same pass from open to last orders, so the eggs do not vanish at 11am and the grain bowl is there at 7.30 if that is what you feel like. The card is deliberately short — fourteen dishes and two specials — because a small kitchen cooking a short list to order beats a long menu held under a heat lamp.

Sourdough arrives from a wood-fired bakery in Brunswick East at 6.15 each morning. The eggs are free range from a Gippsland farm we have bought from since 2016, and the ricotta for the hotcakes is made here on Tuesdays and Fridays. The chilli oil on the mushrooms is ours as well, and there are jars on the counter when we have spare.

## What people order

Mornings run on the fried egg roll with house tomato relish, miso butter mushrooms on toast, and the semolina hotcakes, which are thick and take eleven minutes — order those first. From late morning the kitchen leans savoury: a smoked trout and freekeh bowl, a two-cheese toastie pressed hard enough to laminate, and the Wednesday pasta special, which is built around whatever the greengrocer has too much of that week.

Vegan and gluten-free versions exist across the menu rather than as a short afterthought list at the bottom, and staff know which dishes genuinely cannot be changed. We are not a nut-free kitchen — dukkah and almond praline are in daily use — so tell us at the till if that matters to you.

## The room

Forty-eight seats inside a narrow Victorian shopfront, plus sixteen in the back courtyard where the roaster vents, which is the warmest place to sit in July and the worst in February. Tables of six or more can be booked; anything smaller is walk-in, which keeps the Saturday queue moving honestly. Last orders are half an hour before close, and the pastry cabinet is usually empty well before that.`,
      keyFacts: [
        { label: "Kitchen opens", value: "7am weekdays, 8am weekends" },
        { label: "Last orders", value: "30 minutes before close" },
        { label: "Seats", value: "48 inside, 16 in the back courtyard" },
        { label: "Bookings", value: "Tables of six or more only — everything smaller is walk-in" },
        { label: "Menu size", value: "Fourteen dishes plus two specials, rewritten each season" },
        {
          label: "Dietary",
          value: "Vegan and gluten-free options throughout; not a nut-free kitchen",
        },
      ],
      faqs: [
        {
          question: "Do you take bookings for breakfast?",
          answer:
            "Only for tables of six or more, which you can request on the bookings page or by phone. Smaller groups are walk-in. Between 9.30 and 11.30 on weekends the wait is usually twenty to thirty minutes — we take a mobile number and text you when a table is ready, so you can wait at the Rose Street market rather than on the footpath.",
          tags: ["bookings"],
        },
        {
          question: "Does breakfast stop at a certain time?",
          answer:
            "No. One menu runs from open until last orders, so breakfast dishes are available at 2pm and the grain bowls are there at 7.30am. The only items that genuinely run out are the pastries and the Wednesday pasta special, both made in limited numbers each morning.",
          tags: ["menu"],
        },
        {
          question: "Can you cater for coeliac and vegan diners?",
          answer:
            "Most dishes have a gluten-free or vegan version and the floor staff know which ones cannot be adapted. We are also honest about cross-contamination: the kitchen handles flour, dairy and nuts all day, so we prepare coeliac orders carefully but cannot offer a dedicated allergen-free line.",
          tags: ["dietary"],
        },
      ],
      relatedServices: ["specialty-coffee-and-single-origin", "private-events-and-function-hire"],
      areaPages: { enabled: false },
    },

    {
      slug: "specialty-coffee-and-single-origin",
      name: "Specialty coffee and single-origin roasts",
      category: "coffee",
      shortDescription:
        "Drum-roasted behind glass at 214 Gertrude Street and cupped the next morning, then poured over the counter or bagged to take home.",
      answer:
        "Yes — every coffee we serve is roasted out the back on a 15kg Probat drum roaster. There is one espresso blend on the main grinder, a decaf on the second, and two single origins rotating through filter each week. Retail bags carry a roast date, and we grind to order.",
      body: `## The roastery

The Probat UG15 sits behind a glass wall at the back of the shop and runs Tuesday and Thursday mornings before the lunch rush. Batches are 9 to 11kg, charged around 195C, with first crack usually landing between 8:45 and 9:30 depending on density and moisture. Development is logged as a ratio rather than a fixed time — roughly 20 to 22 per cent for the espresso blend, closer to 17 for the filter lots, which keeps the acidity intact.

Every batch is cupped the following morning on the same three-bowl table, against the last two roasts of the same coffee. If a batch is flat it goes into staff drinks and gets re-profiled, not onto the shelf.

## Espresso

The house blend, Ember, is a pulped-natural Brazilian from Cerrado Mineiro with a washed Colombian from Huila — a bit of body and cocoa from the first, red apple and a clean finish from the second. It is dialled at 20g in, 42g out, 27 to 30 seconds, and it is built to hold up under a lot of milk because that is what most of Gertrude Street orders. Decaf is a Swiss Water Colombian and lives on its own grinder, not a shared hopper.

## Filter

Two single origins are open at any time, one brighter and one sweeter, brewed as a V60 to order or as batch at 55g per litre. A washed Ethiopian from Guji has been the jasmine-and-bergamot end of the pair for most of this year; the other rotates through Kenyan SL28 lots, Rwandan bourbon and the occasional natural-process Colombian when one is genuinely clean rather than merely fruity.

## Buying beans

Bags are 250g or 1kg, stamped with the roast date and the recipe we use in the shop. Espresso is sold from day seven, when the carbon dioxide has settled enough to stop the shot gushing; filter goes out from day five. We grind to order on an EK43 if you tell us the brew method, though whole bean keeps a week longer and we will say so before we grind it.`,
      keyFacts: [
        { label: "Roast days", value: "Tuesday and Thursday, 15kg Probat UG" },
        { label: "Batch size", value: "9–11kg green, cupped the next morning" },
        { label: "Espresso recipe", value: "20g in, 42g out, 27–30 seconds" },
        { label: "Filter on offer", value: "Two single origins weekly, V60 or batch brew" },
        { label: "Rest before sale", value: "Espresso from day seven, filter from day five" },
        { label: "Retail sizes", value: "250g and 1kg, ground to order or whole bean" },
      ],
      faqs: [
        {
          question: "What is in the house espresso blend?",
          answer:
            "Ember is a two-origin blend: a pulped-natural Brazilian from Cerrado Mineiro for body and cocoa, and a washed Colombian from Huila for red-apple acidity and a clean finish. The components change with the harvest, usually twice a year, and we cup the replacement against the outgoing lot before it goes on the grinder.",
          tags: ["espresso"],
        },
        {
          question: "How long will the beans stay fresh?",
          answer:
            "Espresso tastes best between one and four weeks off roast; filter opens up a little sooner and fades a little faster. Keep the bag sealed at room temperature, not in the fridge, and buy 250g at a time unless you are drinking more than a kilogram a month. The roast date is on every bag so you can judge for yourself.",
          tags: ["freshness"],
        },
        {
          question: "Do you run a coffee subscription?",
          answer:
            "Yes — fortnightly or monthly, 250g or 1kg, either fixed on the house blend or set to follow whichever single origin is open that week. It ships the afternoon of a roast day and you can pause it from the account link in any dispatch email, which matters more than it sounds if you travel.",
          tags: ["subscription"],
        },
      ],
      relatedServices: [
        "wholesale-coffee-supply",
        "barista-training-workshops",
        "dine-in-breakfast-and-lunch",
      ],
      areaPages: { enabled: false },
    },

    {
      slug: "wholesale-coffee-supply",
      name: "Wholesale coffee supply",
      category: "trade",
      shortDescription:
        "Wholesale coffee for inner-north cafes, restaurants and offices: 6kg minimum, twice-weekly delivery, dial-in support included.",
      answer:
        "Yes. We supply roasted coffee to cafes, restaurants and offices across Melbourne's inner north, with a 6kg minimum order and deliveries twice a week. Onboarding includes a free dial-in on your own grinder, two hours of staff training, and an account contact who still works a shift behind the machine.",
      body: `## How an account starts

An enquiry gets you a tasting at the roastery, on your water if you bring a bottle of it, across the house blend and whatever single origins are open. From there we send a 6kg trial and dial it in on site — on your grinder, your machine, your milk — because a recipe that works on our bench is close to meaningless on a different burr set.

The trial runs a fortnight. If it holds up, the account opens on 14-day invoicing with a standing order you can change up to 24 hours before a delivery run. Nothing is locked in: there is no minimum term and no exclusivity clause, because an account that stays out of habit rather than because the coffee is good is not worth having.

## Delivery

Two runs a week. Tuesday covers Fitzroy, Collingwood and Carlton by cargo bike, which is faster than a van on Smith Street and means small emergency top-ups are genuinely possible. Friday goes north up the 86 line to Northcote, Thornbury and Preston by van. Orders placed before 2pm the day before make the next run; anything further out goes overnight courier, roasted the same week.

## What comes with the coffee

Two hours of barista training for your staff at open, repeated free whenever you have significant turnover. A grinder on loan for accounts over 20kg a week, serviced by us. A referral to the technician we use for machine work, because we do not pretend to be a service department. Recipe cards printed for your bench, and a quarterly visit to re-check extraction as the humidity changes and your burrs wear.

## Blend changes

Harvest changes are announced three weeks ahead with a sample of the incoming lot, so you can taste it and adjust before it turns up in a delivery. If it does not work on your setup we will keep you on the outgoing component while stock lasts and help you find the next recipe. Surprises on a Monday morning are how accounts get lost.`,
      keyFacts: [
        { label: "Minimum order", value: "6kg per delivery, any mix of blend and single origin" },
        {
          label: "Delivery days",
          value: "Tuesday (inner north by cargo bike), Friday (north by van)",
        },
        { label: "Order cut-off", value: "2pm the day before a run" },
        {
          label: "Included support",
          value: "On-site dial-in, two hours of staff training, quarterly recheck",
        },
        { label: "Loan grinder", value: "Provided and serviced for accounts over 20kg a week" },
        { label: "Terms", value: "14-day invoicing, no minimum term, no exclusivity" },
      ],
      priceFrom: {
        amount: 34,
        currency: "AUD",
        qualifier: "per kg, house espresso blend, 6kg minimum",
      },
      faqs: [
        {
          question: "What is the minimum wholesale order?",
          answer:
            "Six kilograms per delivery, which you can split across the house blend, decaf and whichever single origins are roasting that week. Most small cafes sit between 8 and 15kg a week; offices with one machine usually land on 3kg a fortnight, which we handle as a standing order that meets the minimum across two drops.",
          tags: ["wholesale"],
        },
        {
          question: "How quickly can a new account start?",
          answer:
            "About two weeks from the first tasting. Roughly: tasting in week one, a 6kg trial dialled in on your grinder a few days later, then the account opens on the next scheduled run. If you are replacing a supplier mid-week we can bring the first delivery forward, though the dial-in visit still needs to be booked around roast days.",
          tags: ["wholesale", "onboarding"],
        },
        {
          question: "Do you supply a grinder with the coffee?",
          answer:
            "For accounts using more than 20kg a week we provide a grinder on loan and cover its servicing and burr replacement. Below that we will help you choose and buy one, and dial it in, but we do not lend equipment against small volumes — the arithmetic only works if it is honest.",
          tags: ["equipment"],
        },
        {
          question: "What if the coffee tastes different between deliveries?",
          answer:
            "Call us and we will come out. Small shifts usually come from burr wear, water hardness or a batch sitting in the bag for longer than usual, and all three are fixable on your bench in twenty minutes. If the roast itself has drifted we will say so — we keep the cupping notes for every batch and can taste the two side by side with you.",
          tags: ["quality"],
        },
      ],
      relatedServices: ["specialty-coffee-and-single-origin", "barista-training-workshops"],
      areaPages: {
        enabled: true,
        titlePattern: "Wholesale coffee supply in {area}",
        intros: {
          fitzroy:
            "Most of our Fitzroy accounts are within a five-minute cargo-bike ride of the roastery, so a bag ordered at 9am is on your bench before the lunch rush. It also means we can walk over and re-dial a grinder the morning the humidity turns, rather than booking you in for next week.",
          collingwood:
            "Collingwood wholesale splits in two: converted mills full of studios and agencies ordering 3kg for an office setup, and Smith Street venues pulling two hundred shots a day through a three-group. Both sit on the same Tuesday run, which crosses Johnston Street before the traffic builds.",
          carlton:
            "Carlton accounts live on the university calendar. Cafes around Lygon and Elgin Streets can double their volume in March and go quiet through January, so we write them a flexible schedule instead of a fixed weekly drop, and hold extra green through O-Week rather than letting them run dry.",
          northcote:
            "High Street venues tend to be small and owner-operated — one machine, one grinder, and regulars who would notice a blend change within a day. Northcote accounts usually want a house espresso they can keep for years plus a 250g filter bag for the retail shelf, delivered before 8am on Fridays.",
        },
      },
    },

    {
      slug: "barista-training-workshops",
      name: "Barista training workshops",
      category: "training",
      shortDescription:
        "Small-group barista workshops in the Fitzroy roastery: home espresso, milk texturing and filter brewing, six people maximum.",
      answer:
        "Yes — we run three-hour barista workshops in the roastery for a maximum of six people, with one machine between two. The home espresso class covers grind, dose, extraction and milk texturing; the filter class covers V60, AeroPress and batch brew. Staff training for wholesale accounts is separate and included.",
      body: `## Home espresso, three hours

Saturdays at 4pm, once the floor is clear. Six people, three machines, so you are on the group head for most of the session rather than watching. We start with grind and dose because that is where nearly every bad shot at home begins, pull deliberately bad extractions so you can taste channelling and over-extraction rather than read about them, then work forwards to a repeatable recipe on the gear you actually own.

The second half is milk. Texturing to a wet-paint consistency, when to drop the jug, how to pour a rosetta and — more usefully — how to pour a flat white that does not collapse before it reaches the table. You will go through about two litres each and we would rather you wasted it here.

## Filter and brew methods, two hours

Sunday mornings before open. Ratios, grind size, water temperature and agitation across V60, AeroPress and a Clever dripper, brewed side by side from the same coffee so the differences are obvious. We finish on batch brew, because a well-dialled batch at 55g per litre beats a rushed pourover and almost nobody believes that until they taste it.

## Cafe and staff training

For wholesale accounts, two hours on your own bench at open is included with the account and repeated free when you turn over staff. Venues that are not buying our coffee can book the same session at an hourly rate — we will still dial your grinder, and we will not spend the time selling you beans.

## Booking

Classes are paid at booking and released a month ahead. Reschedule up to 72 hours before with no charge; inside that we will try to fill your place from the waitlist before we keep the fee. Everyone leaves with a 250g bag, a recipe card from their own session, and the dial-in notes we wrote down while they worked.`,
      keyFacts: [
        { label: "Class size", value: "Six people maximum, one machine between two" },
        { label: "Home espresso class", value: "Saturdays 4–7pm, three hours" },
        { label: "Filter class", value: "Sundays 9–11am, two hours" },
        { label: "Included", value: "250g bag, recipe card, your own dial-in notes" },
        {
          label: "Cafe staff training",
          value: "Two hours on your bench, free with a wholesale account",
        },
        { label: "Reschedule", value: "Free up to 72 hours before the class" },
      ],
      priceFrom: {
        amount: 130,
        currency: "AUD",
        qualifier: "per person, three-hour home espresso class",
      },
      faqs: [
        {
          question: "Do I need any experience to come along?",
          answer:
            "None. Roughly half of each class has owned a machine for a week and half have owned one for years and never got a shot they liked. We ask what gear you have at booking and group the bench accordingly, so nobody spends three hours on a problem that does not apply to their setup.",
          tags: ["training"],
        },
        {
          question: "What should I bring, and what do I take home?",
          answer:
            "Bring photos of your grinder, machine and portafilter basket, and your beans if you are fighting a specific problem. You leave with a 250g bag, a written recipe from your own session — dose, yield, time and grind setting — and notes on what to change first if your water at home behaves differently from ours.",
          tags: ["training"],
        },
        {
          question: "Can you train our cafe staff on site?",
          answer:
            "Yes, and on your own machine rather than ours, which is the only version worth doing. Wholesale accounts get two hours at open included, repeated free after staff turnover. Other venues can book the same session hourly; we dial the grinder while we are there and leave recipe cards for the bench.",
          tags: ["training", "wholesale"],
        },
      ],
      relatedServices: ["specialty-coffee-and-single-origin", "wholesale-coffee-supply"],
      areaPages: {
        enabled: true,
        titlePattern: "Barista training in {area}",
        intros: {
          fitzroy:
            "Fitzroy classes are mostly locals who bought a machine, then discovered that owning one and using one are separate skills. We run them on Saturday afternoons after close, on the same two-group we serve the Gertrude Street morning queue on, and you walk home afterwards.",
          collingwood:
            "A lot of Collingwood bookings are studios and small offices sending two or three staff to learn the kitchenette machine properly, rather than home enthusiasts. For groups like that we will run a shortened weekday session timed so you are back down Smith Street before five.",
          carlton:
            "Carlton bookings skew towards students and share houses who bought one machine between four, so those classes spend longer on grind adjustment and on getting a drinkable shot out of an entry-level grinder before anyone is told to spend money upgrading anything.",
          northcote:
            "Northcote classes tend to be weekend home-espresso people with a good setup and one stubborn problem — channelling, or milk that never sits flat. Bring photos of your grinder and basket and we will work the session around your actual gear instead of demonstrating on ours.",
        },
      },
    },

    {
      slug: "private-events-and-function-hire",
      name: "Private events and function hire",
      category: "venue",
      shortDescription:
        "Hire the Fitzroy shopfront and courtyard for launches, workshops and wakes, with a barista on the machine all evening.",
      answer:
        "Yes — the shopfront and courtyard can be hired after 4pm on weekdays and from 4.30pm on Sundays, seating forty or holding sixty standing. Hire includes a barista on the espresso machine, the sound system and food from our own kitchen. Book at least three weeks ahead.",
      body: `## The space

Two connected rooms and a courtyard. The front room seats twenty-four at the long tables, the back room another sixteen with the roaster behind glass as a backdrop, and the courtyard takes the overflow with heaters in winter. Standing, the whole site holds sixty comfortably and seventy uncomfortably, and we will tell you which one you are booking.

Weekday evenings from 4pm and Sundays from 4.30pm. We do not hire out Saturdays — it is the day the cafe pays for itself.

## What gets used for what

Book launches and exhibition openings take the front room and the courtyard, standing, with food passed rather than plated. Workshops and team days take the back room, where there is a projector, a whiteboard and enough power outlets for fifteen laptops. Wakes and birthdays usually take the whole site seated, and for those we will move the retail shelving out and put the long tables end to end.

## Food and coffee

Catering comes from the same kitchen and the same suppliers as the day menu: grazing boards, a hot dish with two salads, or pastries and sandwiches for a morning event. There is a barista on the machine for the full hire, which is the part people remember, and a filter brew bar as an optional extra for coffee-focused events.

## The practical bits

Neighbours on three sides means amplified music stops at 10pm and everyone is out by 10.30. We are not licensed, so alcohol runs either through a temporary limited licence arranged with your caterer or as a BYO arrangement we set up in advance — ask early, because the paperwork takes a fortnight. A 20 per cent deposit holds the date and is refundable up to fourteen days out.`,
      keyFacts: [
        { label: "Capacity", value: "40 seated, 60 standing across two rooms and the courtyard" },
        { label: "Available", value: "Weekdays from 4pm, Sundays from 4.30pm — no Saturdays" },
        { label: "Includes", value: "Barista for the full hire, sound system, projector, staff" },
        { label: "Music curfew", value: "Amplified music stops at 10pm, site clear by 10.30pm" },
        {
          label: "Alcohol",
          value: "Unlicensed — temporary limited licence or BYO, arranged in advance",
        },
        { label: "Deposit", value: "20 per cent, refundable up to 14 days before the event" },
      ],
      priceFrom: {
        amount: 750,
        currency: "AUD",
        qualifier: "minimum spend, weekday evening up to 40 guests",
      },
      faqs: [
        {
          question: "Is the venue licensed for alcohol?",
          answer:
            "No. For private functions we either arrange a temporary limited licence through the caterer or set up a BYO arrangement with a responsible-service condition, both of which need about a fortnight of notice. Plenty of events here run dry on the filter bar and a decent non-alcoholic list instead.",
          tags: ["events"],
        },
        {
          question: "What is included in the hire fee?",
          answer:
            "Exclusive use of both rooms and the courtyard, a barista on the espresso machine for the whole hire, floor staff, the sound system and the projector in the back room, plus setup and pack-down. Food and any extras such as the filter brew bar are quoted on top and count towards the minimum spend.",
          tags: ["events", "pricing"],
        },
        {
          question: "Is the space accessible?",
          answer:
            "There is a 60mm step at the Gertrude Street door and we keep a portable ramp behind the counter — tell us in advance and it will be down before guests arrive. The front room, back room and courtyard are all level once you are inside, and there is an accessible toilet off the courtyard.",
          tags: ["access"],
        },
      ],
      relatedServices: ["dine-in-breakfast-and-lunch", "barista-training-workshops"],
      areaPages: { enabled: false },
    },
  ],

  faqs: [
    {
      question: "Do you take bookings?",
      answer:
        "For tables of six or more, yes — through the bookings page or by phone. Smaller tables are walk-in, including weekends, because holding tables for two makes the queue worse for everybody. Barista classes and private functions are booked separately and both need payment or a deposit to hold the date.",
      tags: ["bookings"],
    },
    {
      question: "What dietary options are on the menu?",
      answer:
        "Vegan and gluten-free versions run across the menu rather than as a short list at the end, and the floor staff know which dishes cannot be adapted. We use oat, soy and lactose-free milk at no extra charge. The kitchen handles flour, dairy and nuts all day, so we take allergy orders seriously but cannot promise a dedicated allergen-free bench.",
      tags: ["dietary"],
    },
    {
      question: "Are dogs allowed?",
      answer:
        "In the courtyard and at the footpath tables, yes, and there are water bowls at both. Food-safety rules keep dogs out of the two indoor rooms, assistance animals excepted. The courtyard is where the roaster vents, so it is warm in winter and shaded by the fig in summer, which most dogs seem to prefer anyway.",
      tags: ["dogs"],
    },
    {
      question: "Can I work on a laptop, and is there wifi?",
      answer:
        "Free wifi, and the password is on the sugar jar. Laptops are welcome before 10.30am and after 1.30pm on weekdays, with power points along the back room wall. During weekend brunch we ask for the tables back — a single laptop on a four-seater at 10am on a Sunday costs the kitchen a service, and we would rather ask than put up a sign.",
      tags: ["wifi", "laptops"],
    },
    {
      question: "Where can I park?",
      answer:
        "There is 2P metered parking along Gertrude Street and permit-only zones in the side streets, which are patrolled seriously — check the signs rather than the cars. The 86 tram stops outside the door, Parliament station is a fifteen-minute walk up Gertrude, and there are bike hoops directly out the front.",
      tags: ["parking"],
    },
    {
      question: "Where does your coffee come from?",
      answer:
        "Green coffee comes through two Melbourne importers, mostly from Colombia, Brazil, Ethiopia, Kenya and Rwanda, with the producer, region and process printed on every bag. We pay above the C-market reference price on every lot and will tell you what we paid for a coffee if you ask at the counter. What we cannot honestly claim is direct trade: we visit origin rarely and we are not going to dress that up.",
      tags: ["sourcing"],
    },
    {
      question: "Do you post beans?",
      answer:
        "Yes, anywhere in Australia. Orders placed before 11am on a Tuesday or Thursday go out the same afternoon on the roast they were dispatched from; anything later waits for the next roast day rather than shipping stale. Express post is free over $60 and flat-rate below it. We do not ship internationally.",
      tags: ["shipping"],
    },
  ],

  brand: {
    primary: "#7c3f21",
    accent: "#4f7351",
    fontPair: "serif-editorial",
    radius: "sm",
    logoText: "Fitzroy Ember",
  },

  social: {
    instagram: "https://www.instagram.com/fitzroyember",
    facebook: "https://www.facebook.com/fitzroyember",
  },

  analytics: {
    consentMode: "advanced",
  },

  ai: {
    preset: "open",
  },

  trust: {
    abn: "58 217 904 336",
    reviews: {
      rating: 4.7,
      count: 412,
      source: "Google reviews",
      emitSchema: false,
    },
  },
};
