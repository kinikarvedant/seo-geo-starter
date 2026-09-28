import type { ClientConfigInput } from "@/config/schema";

/**
 * Demo client: a fictional 24/7 plumbing and gasfitting business in Northcote.
 *
 * Fictional on purpose — `demo: true` forces noindex — but every technical claim in the
 * prose is meant to survive a licensed plumber reading it. The phone number sits in the
 * (03) 90xx range, which is not issued to subscribers, so nobody real gets called.
 */
export const plumber: ClientConfigInput = {
  id: "plumber",
  businessType: "plumber",
  demo: true,

  name: "Merri Creek Plumbing & Gas",
  legalName: "Merri Creek Plumbing & Gas Pty Ltd",
  tagline: "24/7 emergency plumbers for Melbourne's inner north",
  description:
    "A family-run plumbing and gasfitting business based in Northcote, on call around the clock for burst pipes, blocked drains, hot water failures and gas leaks across Melbourne's inner northern suburbs.",
  foundedYear: 2009,

  site: {
    url: "https://northcoteplumbing.duckdns.org",
    titleTemplate: "%s | Merri Creek Plumbing & Gas",
  },

  contact: {
    phone: "+61390428817",
    phoneDisplay: "(03) 9042 8817",
    email: "service@northcoteplumbing.duckdns.org",
    bookingUrl: "https://northcoteplumbing.duckdns.org/contact",
    emergency: true,
  },

  address: {
    streetAddress: "14 Separation Street",
    suburb: "Northcote",
    state: "VIC",
    postcode: "3070",
    geo: { lat: -37.7716, lng: 145.0013 },
  },

  /**
   * Genuinely 24/7, so `regular` stays empty: the schema's superRefine only demands
   * `regular` entries when `alwaysOpen` is false, and listing opening hours next to an
   * alwaysOpen flag would put two contradictory claims into the LocalBusiness JSON-LD.
   */
  hours: {
    regular: [],
    alwaysOpen: true,
  },

  serviceAreas: [
    {
      slug: "northcote",
      name: "Northcote",
      postcode: "3070",
      geo: { lat: -37.7699, lng: 145.0 },
      priority: 10,
      blurb:
        "Our home suburb, and a street map of Victorian and Edwardian weatherboards with original earthenware sewers running out under mature street trees. Most callouts here are root intrusion at a clay joint, galvanised water service at the end of its life, or a 1980s rear extension plumbed into a stack that was never sized for a second bathroom.",
      landmarks: [
        "Northcote Town Hall",
        "Westgarth Theatre",
        "All Nations Park",
        "Merri Creek Trail",
      ],
      adjacentTo: ["thornbury", "fairfield", "brunswick"],
    },
    {
      slug: "thornbury",
      name: "Thornbury",
      postcode: "3071",
      geo: { lat: -37.7565, lng: 145.0022 },
      priority: 9,
      blurb:
        "Interwar Californian bungalows and brick veneers, now interleaved with townhouse rows built across old back yards. That subdivision is what we see most: four or five dwellings sharing one water service, one sewer connection and a single grated driveway drain, so a leak or a blockage in one unit becomes a question of whose pipe it is.",
      landmarks: ["High Street shops", "Penders Park", "Thornbury station", "Merri Creek"],
      adjacentTo: ["northcote", "preston", "fairfield"],
    },
    {
      slug: "brunswick",
      name: "Brunswick",
      postcode: "3056",
      geo: { lat: -37.767, lng: 144.96 },
      priority: 8,
      blurb:
        "Single-fronted worker cottages on tight blocks with no side access, plus warehouse conversions and apartment buildings on shared risers. Access shapes every job here: gear comes through the hallway, drains are cleared from the boundary trap or roof vent, and half the kitchen wastes are still 65mm and caked with decades of fat.",
      landmarks: ["Sydney Road", "Barkly Square", "Jewell station", "Brunswick Baths"],
      adjacentTo: ["northcote"],
    },
    {
      slug: "preston",
      name: "Preston",
      postcode: "3072",
      geo: { lat: -37.741, lng: 145.014 },
      priority: 8,
      blurb:
        "Post-war brick veneer and ex-Housing Commission houses on wide blocks, much of it plumbed once in the 1950s and barely touched since. Galvanised water services are still in the ground here, laundries sit out in detached garages at the end of long unlagged runs, and back-yard granny flats added decades later are usually teed off the original service with no isolation of their own.",
      landmarks: ["Preston Market", "Northland", "Bell station", "Darebin Creek Trail"],
      adjacentTo: ["thornbury"],
    },
    {
      slug: "fairfield",
      name: "Fairfield",
      postcode: "3078",
      geo: { lat: -37.778, lng: 145.019 },
      priority: 7,
      blurb:
        "Edwardian and interwar homes stepping down the slope towards the Yarra, many on cut-and-fill sites. Slope is the theme: drains with too much fall and dropped joints, stormwater cross-connected into the sewer, and streets near the park where a summer storm surcharges the overflow relief gully long before any pipe breaks.",
      landmarks: [
        "Fairfield Park Boathouse",
        "Station Street village",
        "Yarra Bend Park",
        "Darebin Creek",
      ],
      adjacentTo: ["northcote", "thornbury"],
    },
  ],

  services: [
    {
      slug: "emergency-plumber",
      name: "24/7 emergency plumber",
      category: "emergency",
      shortDescription:
        "Emergency plumber on call 24 hours across Melbourne's inner north, on site in about an hour for a fixed callout fee.",
      answer:
        "Call Merri Creek Plumbing & Gas on (03) 9042 8817 at any hour — a licensed plumber answers, not a call centre, and we are usually on site anywhere in Melbourne's inner north within 60 minutes. Burst pipes, sewer overflows, gas leaks and total hot water failures are made safe on the first visit.",
      body: `## What happens when you ring

The phone goes to a plumber on shift, not a message service. We triage before we leave — where the water is coming from, whether you can reach the meter, whether anything electrical is wet — because two minutes of advice often stops most of the damage before we arrive. If it is safe, we will talk you through shutting the water off at the meter on the front boundary, or isolating one fixture at its stop tap so the rest of the house keeps working.

## Make safe first, repair second

An after-hours call has two stages. The first is making the property safe: capping a split pipe, isolating a leaking hot water unit, clearing a sewer overflow away from the building, or shutting down and tagging a gas appliance. The second is the permanent repair, which occasionally has to wait for a supplier to open if the fitting is an odd size or an old imperial thread. We tell you which stage you are paying for before we start, and no make-safe work gets thrown away when we come back to finish.

## Gas escapes

If you can smell gas, do not touch light switches or anything electrical near the meter. Open the windows, turn the gas off at the meter handle if you can reach it safely, get everyone outside, then ring us. We hold a gas servicing endorsement alongside the plumbing licence, so the leak test, the appliance check and the reconnection are all done by the same person on the same visit.

## What the van carries

The vans are stocked for the calls that actually come in overnight: copper and PEX in the common sizes, compression and press fittings, gate and ball valves, flexible connectors, tempering valves, universal thermostats and elements, pan collars and cistern parts, and an electric eel for a drain that cannot wait until morning. That stock is the reason most overnight jobs finish as one visit instead of two.`,
      keyFacts: [
        {
          label: "Typical response",
          value: "Under 60 minutes to Northcote, Thornbury, Brunswick, Preston and Fairfield",
        },
        { label: "Availability", value: "24 hours, seven days, public holidays included" },
        {
          label: "After-hours callout",
          value: "$99 fixed, covering travel and the first 30 minutes on site",
        },
        {
          label: "Workmanship warranty",
          value: "6 years on our labour, plus the manufacturer's warranty on any parts supplied",
        },
        {
          label: "Payment",
          value: "Card, bank transfer or PayID on completion, with no deposit for emergency work",
        },
        { label: "Licence", value: "VBA plumbing licence 104562, fully insured" },
      ],
      priceFrom: {
        amount: 99,
        currency: "AUD",
        qualifier: "after-hours callout, first 30 minutes",
      },
      faqs: [
        {
          question: "How fast can you actually get here at 2am?",
          answer:
            "Most nights we are at the door within 45 to 60 minutes, because the on-call plumber works out of Northcote rather than a depot on the other side of town. If we are already on a job we tell you an honest time when you ring instead of a hopeful one, and you get a text when the van leaves.",
          tags: ["response-time"],
        },
        {
          question: "Is this an emergency, or can it wait until morning?",
          answer:
            "Treat it as an emergency if water is running where you cannot stop it, sewage is coming up inside the house, you can smell gas, or you have no water at all. A dripping tap, one slow drain, a running cistern or a hot water unit that still makes lukewarm water can safely wait for a booked weekday visit — and we will say so on the phone.",
          tags: ["triage"],
        },
        {
          question: "My insurer wants a report on the damage. Can you provide one?",
          answer:
            "Yes. On emergency jobs we photograph the failure before we touch it, note what we did to make it safe, and record moisture readings where a wall, cabinet or floor has been wet. That, with the invoice and any pipe we cut out, is normally everything an insurer asks for. We can email it straight to your assessor.",
          tags: ["insurance"],
        },
      ],
      relatedServices: ["burst-pipes-leak-detection", "blocked-drains", "hot-water-systems"],
      areaPages: {
        enabled: true,
        titlePattern: "24/7 emergency plumber in {area}",
        intros: {
          northcote:
            "Our on-call plumber lives a few minutes from Northcote Town Hall, so a 2am burst in a Westgarth weatherboard is usually a sub-30-minute run for us. Many of these houses still have the original water service teed off under the floor, with the shut-off a plug cock near the front fence rather than a modern meter tap, and we know where to look for it in the dark.",
          thornbury:
            "Thornbury's newer townhouse rows commonly share one water service and one sewer connection between four or five dwellings, so shutting off a leak in unit three can take the whole block's water with it. We isolate at your own stop tap and sub-meter first, keep the neighbours on, then work out whose pipe has actually failed.",
          brunswick:
            "Half of Brunswick's single-fronted cottages have no side or rear access at all, so every bit of gear comes down the hallway. We arrive with barrow-sized equipment and floor protection rather than a trailer that will not fit past the front gate, and after midnight we know which Sydney Road side streets are blocked off and which are not.",
          preston:
            "Preston's post-war brick veneers keep the hot water unit and much of the water service down an exposed side path, where a cold snap or a knocked, poorly lagged run splits overnight. Those long side runs also mean a leak can go unheard until it reaches the garage slab, so we bring listening gear on emergency calls here as standard.",
          fairfield:
            "Fairfield sits on the slope down to the Yarra, and after a summer downpour the low streets near the boathouse see stormwater surcharge back up through overflow relief gullies rather than anything actually breaking. We come with a pump as well as a jetter, because on this side of Darebin Creek the 3am emergency is usually water arriving, not escaping.",
        },
      },
    },
    {
      slug: "blocked-drains",
      name: "Blocked drains",
      category: "drains",
      shortDescription:
        "Same-day blocked drain clearing in Melbourne's inner north, with high-pressure jetting and a CCTV camera inspection on every job.",
      answer:
        "Ring us and we will clear a blocked drain the same day, usually within two hours. We jet the line rather than punching a hole through the blockage, then run a CCTV camera its full length so you can see exactly what caused it — tree roots, a cracked clay joint or set fat — before any repair is quoted.",
      body: `## Why drains block in the inner north

Most homes between Northcote and Preston are still served by their original 100mm vitrified clay sewer, laid in short lengths with mortar or rubber-ring joints. Clay does not corrode, which is why it is still in the ground after a century, but every joint is a seam that roots can find once the ground dries out and the mortar shrinks. Add a row of mature street trees and you have the classic inner-north blockage: a fine root mat through a joint three or four metres from the house, catching paper until nothing moves.

Kitchen lines fail differently. Fat and food waste cool and set on the pipe wall, narrowing the bore over years until one big Sunday roast finishes it. Stormwater blocks with leaf litter and silt, and often with roots as well, where a downpipe joins an old agricultural line under the garden.

## Clear it, then look at it

We clear with a high-pressure water jetter and a root-cutting head, working from an inspection opening near the boundary, or from a gully or roof vent where there is no opening. Jetting scours the pipe wall back to full bore instead of leaving a hole in the middle of the blockage, and that is the difference between a drain that runs for years and one that blocks again in six weeks.

Once it is running we put a CCTV camera down the line and record the lot. The camera head carries a sonde, so we can mark the position and depth of a defect on the surface with a locator, which matters enormously if the fix involves digging. You get the footage and a plain-language read of it: what is a genuine defect, and what is simply an old pipe looking old.

## Repair options once we know

Root intrusion at a single joint can often be cut, jetted and then sealed with a short cured-in-place patch, with no excavation at all. A pipe that has dropped, lost part of its invert or collapsed needs that section opened up and relaid in PVC, and we will say so plainly rather than selling a patch that is going to fail. Long runs of tired clay can be relined end to end where digging up an established garden is the worse option.

Worth knowing: the sewer drain inside your property boundary is yours to maintain, and the main in the street belongs to the water authority — Yarra Valley Water in this part of Melbourne. If the camera shows the problem is in their asset, we tell you, help you log it, and you are not paying us to fix their pipe.`,
      keyFacts: [
        {
          label: "Response",
          value: "Same day for blocked toilets and sewer overflows, next morning for slow drains",
        },
        {
          label: "Clearing from",
          value: "$280 including the camera inspection, with standard access",
        },
        {
          label: "CCTV inspection",
          value: "Included on every clearing job, footage emailed the same day",
        },
        {
          label: "Equipment",
          value: "5,000 psi jetter, root-cutting heads, located CCTV camera with sonde",
        },
        {
          label: "Guarantee",
          value: "12 months on a cleared line where the camera shows no structural defect",
        },
      ],
      priceFrom: {
        amount: 280,
        currency: "AUD",
        qualifier: "clearing plus camera, standard access",
      },
      faqs: [
        {
          question: "The toilet is overflowing right now. What do I do first?",
          answer:
            "Stop flushing and stop using water anywhere in the house — every sink and shower drains into the same blocked line. Then go outside and find the overflow relief gully, the grate lower than your floor level near the house. If it is spilling, that grate is doing its job and keeping sewage out of the building, so clear anything sitting on top of it and leave it alone until we arrive.",
          tags: ["emergency"],
        },
        {
          question: "Why does my drain keep blocking in the same spot?",
          answer:
            "Because the roots are still there. Cutting and jetting removes what has grown inside the pipe, but not the crack or open joint the roots came through, and in damp ground they regrow in months. If the camera shows a single defect, patching or relining that section is what actually ends it. If the whole run is failing, repeat clearing is just rent.",
          tags: ["tree-roots"],
        },
        {
          question: "Can you clear it without digging up the yard?",
          answer:
            "Nearly always, yes. Jetting and camera work are done through an existing opening, so a normal clearing job disturbs nothing. Digging only comes into it when the camera finds a collapse or a badly dropped section, and even then a cured-in-place patch avoids excavation in a lot of cases. We show you the footage before anyone suggests a shovel.",
          tags: ["excavation"],
        },
      ],
      relatedServices: ["emergency-plumber", "burst-pipes-leak-detection", "bathroom-renovations"],
      areaPages: {
        enabled: true,
        titlePattern: "Blocked drain clearing in {area}",
        intros: {
          northcote:
            "The plane trees along High Street and the liquidambars through Northcote's side streets are doing real damage to century-old earthenware sewers, and we camera more root intrusion here than anywhere else we work. Nine times in ten the blockage sits at a joint a few metres out from the house, under the nature strip rather than under your floor.",
          thornbury:
            "In Thornbury we spend nearly as much time on shared driveway drains as on house sewers. A row of townhouses behind one crossover usually drains to a single grated channel that silts up with leaf litter and belongs to nobody in particular. We camera the line, show you where it actually goes, and sort out whether it is a body corporate job before anyone pays an invoice.",
          brunswick:
            "Brunswick's terraces front straight onto the footpath, so there is often no inspection opening in a yard to work from and we clear through the boundary trap or the roof vent instead. Kitchen wastes here are frequently still 65mm and fat-caked after decades of rentals, which jetting scours back to full bore where a rod would just punch through.",
          preston:
            "Preston's 1960s clay sewers travel a long way to the boundary across those deep blocks, and the ornamental pears planted along the streets have found every joint on the way. Length brings a second problem: a slow drain out here is often a sag rather than a blockage, and the camera and locator settle which it is in one visit instead of three guesses.",
          fairfield:
            "On Fairfield's sloping, cut-and-fill blocks the trouble is usually the opposite of a flat run — sections of old drain with too much fall and dropped joints, so solids race ahead of the water and pile up downstream. We also find stormwater wrongly connected into the sewer here, which surcharges the line every time it rains hard.",
        },
      },
    },
    {
      slug: "hot-water-systems",
      name: "Hot water repairs and replacement",
      category: "hot-water",
      shortDescription:
        "Hot water repairs and same-day replacement across the inner north: gas, electric, continuous flow and heat pump, tempering valve included.",
      answer:
        "No hot water is more often a failed element, thermostat or ignition than a dead unit, so we diagnose before quoting a replacement. The common parts ride on the van, which means most repairs finish on the first visit. When a cylinder genuinely is finished, we can usually supply and install the replacement the same day.",
      body: `## Repair or replace

A storage unit that has stopped making hot water is not automatically finished. On an electric tank the usual suspects are the element, the thermostat, or a safety cut-out that has tripped behind the cover plate, and all three are a parts-and-labour job rather than a new unit. On a gas tank it is more often the thermocouple, the ignition or a fouled burner. What does end a tank's life is the cylinder: once the sacrificial anode has been consumed the steel starts to go, and a tank weeping from a seam or rusting out at the base is a replacement.

Two symptoms people regularly misread. Water trickling from a valve on the wall is usually the temperature-pressure relief valve doing exactly its job, or an aged expansion control valve, not a split tank. And hot water that runs out much faster than it used to is frequently a failed lower element on a twin-element tank, so only the top third of the cylinder is heating.

## Storage versus continuous flow

A storage tank heats a fixed volume and holds it hot, which suits a household running on off-peak electricity or wanting a simple, cheap-to-replace unit — but when it is empty, you wait. A continuous flow gas unit heats only what you draw, never runs out, and takes far less space, which is why it wins on small inner-north blocks. The trade-off is flow rate: a 26 litre-per-minute unit will run roughly two winter showers at once, and more than that wants a larger unit or two in tandem. It also needs a gas supply that can feed it, so we check meter capacity and line size before quoting. A big continuous flow unit on an undersized run is how you end up with a shower that goes cold the moment the heater fires.

Heat pumps are the third option and genuinely efficient in Melbourne's climate, but they need outdoor space, a condensate drain and somewhere to sit where the compressor will not sit under a neighbour's bedroom window three metres away. On the right house they are excellent. On a terrace with no side access they are not.

## Tempering valves and the paperwork

Any new or replacement unit serving a bathroom has to deliver no more than 50 degrees at that outlet, which means a tempering valve on the hot outlet, set and commissioned. It is a scald-prevention rule, and it is one of the reasons a bargain unit fitted by an unlicensed mate is a liability rather than a saving. We fit and set the valve, renew the relief and expansion valves with the unit instead of reusing tired ones, take the old tank away, and issue the compliance paperwork for the installation.`,
      keyFacts: [
        {
          label: "Types we work on",
          value: "Electric and gas storage, continuous flow, solar-boosted and heat pump",
        },
        {
          label: "Same-day replacement",
          value: "Available for common sizes if you ring before about 1pm",
        },
        {
          label: "Diagnosis fee",
          value: "Standard callout, credited against the repair if you go ahead",
        },
        {
          label: "Tempering valve",
          value: "Fitted and set on every replacement so bathroom outlets stay at 50 degrees",
        },
        { label: "Old unit removal", value: "Included, and taken away for scrap metal recycling" },
        {
          label: "Warranty",
          value: "Manufacturer warranty on the unit, 6 years on our installation work",
        },
      ],
      faqs: [
        {
          question: "How long should a hot water system last?",
          answer:
            "A storage tank, gas or electric, gives eight to twelve years in Melbourne water, and longer if the sacrificial anode is replaced around the five-year mark. A continuous flow unit fifteen to twenty. If yours is over ten and the repair is a significant fraction of a replacement, we will tell you the honest numbers and let you choose.",
          tags: ["lifespan"],
        },
        {
          question: "Can I buy the unit myself and just pay you to install it?",
          answer:
            "Yes, and we will still do a compliant install with a new tempering valve and relief valves. Two warnings. Most manufacturers handle warranty differently for units bought outside their trade channel, so check before you order. And we cannot install a second-hand unit or anything not approved for sale here, because we sign the compliance paperwork.",
          tags: ["supply"],
        },
        {
          question: "Why is my hot water lukewarm instead of hot?",
          answer:
            "Three usual causes. A tempering valve drifting or failing, which limits everything from that outlet regardless of tank temperature. A failed lower element, so the cylinder only heats part-way. Or a crossed connection at a worn mixer tap letting cold bleed into the hot line, which typically shows up at one fixture rather than the whole house.",
          tags: ["diagnosis"],
        },
      ],
      relatedServices: ["gas-fitting", "emergency-plumber", "bathroom-renovations"],
    },
    {
      slug: "burst-pipes-leak-detection",
      name: "Burst pipes and leak detection",
      category: "emergency",
      shortDescription:
        "Burst pipe repairs at any hour, plus non-invasive leak detection with acoustic and thermal gear before anything gets opened up.",
      answer:
        "Turn the water off at the meter, then ring us — we repair burst pipes 24 hours a day across the inner north. For a leak you cannot see, acoustic listening equipment and thermal imaging narrow it down to within a few centimetres, so we open one small section of wall, floor or slab rather than guessing twice.",
      body: `## The pipes that actually burst around here

Housing age decides the failure. Pre-war homes often still have galvanised steel somewhere in the water service, and galvanised fails from the inside out: the bore silts up with rust until pressure and a corroded thread finish it, usually at a fitting rather than mid-length. Post-war copper fails differently, with pinholes from erosion at tight bends, or from stray current where an electrical earth has been run through the pipework. Modern PEX and poly almost never fail in the pipe itself; when they leak it is nearly always a crimp or compression joint that was never quite right.

A burst behind a wall or under a slab does not always announce itself as water. The first sign is more often a bill that has jumped, a patch of floor warm underfoot, a musty smell in one room, or a meter still ticking with every tap in the house closed. That meter test is the one worth doing yourself: shut every outlet, then watch the smallest dial for a couple of minutes. If it moves, water is going somewhere it should not.

## Finding it without wrecking the house

We start with isolation, closing sections off at stop taps to establish which run is losing water, then bring in the gear. Acoustic ground microphones and a listening stick pick up the hiss of pressurised water escaping, which is remarkably precise on metal pipe. Thermal imaging maps the warm plume from a hot water line under tiles or screed. A tracer-gas test handles the awkward ones, where a line is empty or the loss is too small to hear. What you get at the end is a mark on the floor, not a demolition.

## Repair, test, and the report

Once the section is exposed we cut back to sound pipe, repair in like or better material, pressure test the run before anything is closed up, and record the moisture readings. Where a wall, cabinet or floor has been wet long enough to matter we say so, because that part is an insurance conversation rather than a plumbing one, and a dated report with photographs and test results is what makes the claim straightforward. If a length of galvanised has gone we will quote replacing that run in copper instead of patching one thread and waiting for the next failure — and we will show you the section we cut out so you can see why.`,
      keyFacts: [
        {
          label: "Leak detection from",
          value: "$320 for the first hour, including acoustic and thermal testing",
        },
        {
          label: "Emergency repairs",
          value: "24 hours, with the water back on before we leave wherever possible",
        },
        {
          label: "Accuracy",
          value: "Hidden leaks pinpointed to within a few centimetres before any cutting",
        },
        {
          label: "Pressure test",
          value: "Every repaired run tested before it is closed up or re-sheeted",
        },
        {
          label: "Insurance report",
          value: "Photos, moisture readings and test results supplied on request",
        },
      ],
      priceFrom: { amount: 320, currency: "AUD", qualifier: "leak detection, first hour on site" },
      faqs: [
        {
          question: "My water bill has tripled but I cannot see a leak. Worth investigating?",
          answer:
            "Yes, and usually urgently — a concealed leak wastes water constantly and quietly rots whatever it is sitting against. Do the meter test first: all taps off, watch the smallest dial. If it creeps, ring us. Keep the bill, too, because water retailers often have a concession for a genuine concealed leak once it is repaired and documented.",
          tags: ["water-bill"],
        },
        {
          question: "Can you find a leak under a concrete slab without breaking it up?",
          answer:
            "Finding it, yes. Acoustic detection and thermal imaging locate slab leaks from the surface, and we mark the spot to within a few centimetres. Repairing it does mean opening a small section of slab at that point, but the difference between a 300mm cut and a hallway of broken concrete is entirely down to locating it properly first.",
          tags: ["slab-leak"],
        },
        {
          question: "Do I have to replace all the galvanised pipe at once?",
          answer:
            "No, and you rarely should. We replace failed runs in copper as they come up, usually starting with the main service and anything buried or hard to reach later. If you are already opening walls for a renovation, that is the moment to do the rest cheaply. Piecemeal patching of old threads is the only approach we argue against.",
          tags: ["galvanised"],
        },
      ],
      relatedServices: ["emergency-plumber", "hot-water-systems", "blocked-drains"],
    },
    {
      slug: "gas-fitting",
      name: "Gas fitting",
      category: "gas",
      shortDescription:
        "Licensed gasfitting in Melbourne's inner north: cooktops, heaters, gas hot water and new lines, with a compliance certificate every time.",
      answer:
        "We are licensed gasfitters as well as plumbers, so cooktop and oven connections, heater installs and servicing, gas hot water, new lines and leak testing all come from one trade. Every job is pressure tested with a manometer and finished with a Victorian gas compliance certificate lodged in your name.",
      body: `## What a compliance certificate is, and why you want one

In Victoria a licensed gasfitter lodges a compliance certificate with the Victorian Building Authority for gasfitting work above the prescribed value, and you receive a copy. It is not paperwork for its own sake. It is the record that a licensed person did the work and tested it, it is what an insurer asks for after an incident, and it is what a buyer's inspector looks for when a cooktop has clearly been changed at some point. We issue one for every gas job, including the small ones where it is not strictly required, and we lodge it rather than handing you a form to chase.

## Appliances and connections

Cooktops and ovens are mostly straightforward, but the detail decides whether they are safe. An appliance isolation valve of the right size, somewhere you can actually reach it. A bayonet or rigid connection to suit the appliance. The correct injectors if the unit came configured for LPG. And a clearance check against combustible surfaces in a joinery cutout that was drawn long before anyone thought about a flame. Space heaters and ducted systems get all of that plus flue and combustion checks.

Open-flued heaters deserve their own paragraph. A heater that draws combustion air from the room and vents up a flue can spill its exhaust back inside if the flue is blocked, or if a rangehood, bathroom fan or a tightly sealed modern house is pulling harder than the flue can push. That is the carbon monoxide risk behind the warnings every winter. Testing for it means a negative pressure test with the house's fans running, plus spillage and CO readings at the appliance, and it is exactly why every open-flued heater should be serviced every two years. If one fails, we condemn and disconnect it. There is no halfway position on that.

## New lines, meters and pressure

Running gas to a new kitchen, a heater at the far end of the house or an outdoor barbecue point is a sizing exercise before it is a plumbing one. Every appliance has a consumption in megajoules per hour, every length of pipe has a pressure drop set by its diameter, length and fittings, and each appliance needs its rated inlet pressure with everything else in the house firing at once. Get that wrong and you have appliances that run rich, lock out, or behave perfectly until the ducted heater kicks in. We size the run, test the installation with a manometer, purge and commission each appliance, and check the meter has the capacity before adding load to it.`,
      keyFacts: [
        {
          label: "Licence",
          value: "Type A gasfitting with servicing endorsement, VBA licence 104562",
        },
        {
          label: "Compliance certificate",
          value: "Issued and lodged with the VBA on every gas job we do",
        },
        {
          label: "CO testing",
          value: "Negative pressure and spillage test with every open-flued heater service",
        },
        {
          label: "Heater servicing",
          value: "Every two years, and we will send a reminder if you want one",
        },
        {
          label: "Gas leaks",
          value: "Attended 24 hours; appliances isolated and tested before we leave",
        },
      ],
      faqs: [
        {
          question: "Can I connect my own gas cooktop or heater?",
          answer:
            "Plugging an appliance into an existing bayonet point is fine, which is what those points are for. Anything else is licensed work: hard-piping a cooktop, altering or extending a gas line, converting an appliance between natural gas and LPG, or installing a flue. An unlicensed gas connection is also the sort of thing an insurer will lean on after a fire.",
          tags: ["diy"],
        },
        {
          question: "How do I know if my gas heater is safe to use this winter?",
          answer:
            "You cannot tell by looking, which is the problem with carbon monoxide. Warning signs worth acting on are soot or scorching around the heater, a yellow lazy flame instead of a crisp blue one, a strange smell when it runs, or headaches and drowsiness in the room that lift when you go outside. An open-flued heater older than about fifteen years and never serviced should be tested before it is lit.",
          tags: ["carbon-monoxide"],
        },
        {
          question: "Do I need compliance certificates when I sell the house?",
          answer:
            "You do not need to produce a certificate for every old appliance, but any gasfitting done while you owned the property should have one, and buyers increasingly ask. If work was done without a certificate the fix is an inspection and test by a licensed gasfitter now, rather than an awkward discovery during the settlement period.",
          tags: ["selling"],
        },
      ],
      relatedServices: ["hot-water-systems", "emergency-plumber"],
    },
    {
      slug: "bathroom-renovations",
      name: "Bathroom renovations and rough-in",
      category: "renovations",
      shortDescription:
        "Bathroom and laundry plumbing from strip-out to fit-off: rough-in, floor wastes and tapware, staged around your tiler and waterproofer.",
      answer:
        "We do the plumbing half of a bathroom renovation in two stages: rough-in, where hot, cold and waste are set out and pressure tested before the walls close, and fit-off, where tapware, toilet and shower go on after tiling. The set-out stage is what decides whether the finished room works.",
      body: `## Rough-in is where a bathroom is won or lost

Before a sheet of plasterboard goes on, every outlet has to be in its final position: the mixer at the right height for the basin that was actually ordered, the shower rail and rose set off the tiled finish rather than the framing, the cistern connection on the side that model takes it from, and the pan connection at the exact set-out of the pan chosen. Changing any of it after tiling means cutting tiles. So we ask for the real fixture schedule, model numbers rather than "a wall-hung basin", and set out to that.

Falls and wastes are the other half of it. A shower floor needs consistent fall to the waste with no flat spot for water to sit in, which makes waste position, screed depth and the door threshold something to agree with the tiler rather than assume. A hobless shower needs the floor recessed at framing stage, and that is a carpenter conversation that has to happen before the plumber arrives. Every tiled wet area needs a puddle flange bonded into the waterproof membrane at each floor waste, which is the detail that stops water tracking under the screed and appearing in the next room six months later.

## Working with the waterproofer and the tiler

The order that works is strip-out, rough-in and pressure test, frame and sheet, waterproof, tile, fit-off. We test the pipework before it is covered and leave it under pressure, so anything disturbed during framing shows up then rather than behind finished tiles. Waterproofing is signed off to AS 3740 by whoever applies it, and our part is making sure wastes and flanges are ready for the membrane instead of holding it up for a day.

## Fit-off, and the details that protect the room

At fit-off we set the mixers, hang the pan, connect the shower and vanity, and commission the lot under pressure. Two things we insist on. A pressure limiting valve, so fixtures see no more than 500 kPa: most tapware warranties are void above that, and high static pressure is what shreds cartridges. And genuine access to an in-wall cistern, either through a removable flush plate or a panel, because a concealed cistern with no way in is a future wall demolition. If the new layout moves a toilet more than a metre or so, we check the existing stack and available fall first, since a pan that has to drain uphill is not a problem you can tile over.`,
      keyFacts: [
        {
          label: "Scope",
          value:
            "Strip-out, rough-in, pressure test and fit-off for bathrooms, ensuites and laundries",
        },
        {
          label: "Time on site",
          value: "Roughly a day for rough-in and a day for fit-off, a few weeks apart",
        },
        {
          label: "Pressure test",
          value: "Rough-in left under test pressure until the sheeting goes on",
        },
        {
          label: "Pressure limiting valve",
          value: "Fitted so every fixture stays at or below 500 kPa",
        },
        {
          label: "Quoting",
          value: "Fixed price from your plan and fixture schedule after a site visit",
        },
      ],
      faqs: [
        {
          question: "Can I move the toilet to the other side of the room?",
          answer:
            "Usually, but the answer depends on what is under the floor. On a timber subfloor there is room to re-route the pan connection and keep proper fall. On a slab it means cutting concrete to reach the drain, which is doable but changes the budget. Either way we check the distance and fall back to the stack before you commit to the layout.",
          tags: ["layout"],
        },
        {
          question: "Should I buy the tapware or will you supply it?",
          answer:
            "Either works. If you buy it, order early and send us the spec sheets before rough-in, because set-out depends on the actual model. If we supply it, you get trade pricing and one point of contact for a warranty claim. Whichever way, check the WELS rating and avoid anything you cannot get a cartridge for in five years.",
          tags: ["fixtures"],
        },
        {
          question: "How long will the bathroom be out of action?",
          answer:
            "Two to four weeks for a typical inner-north bathroom, of which our plumbing is about two days. The waiting is tiling, waterproofing cure times and trade sequencing. We schedule rough-in and fit-off around the tiler so the room is not sitting idle waiting on us, and we tell you at quote which weeks you will be without it.",
          tags: ["timeline"],
        },
      ],
      relatedServices: ["hot-water-systems", "blocked-drains", "gas-fitting"],
    },
  ],

  faqs: [
    {
      question: "Are you licensed and insured?",
      answer:
        "Yes. We hold a Victorian Building Authority plumbing licence, number 104562, with a gasfitting and gas servicing endorsement, and $20 million public liability cover. The number is on the van, on every invoice and on every compliance certificate we lodge, and you are welcome to check it on the VBA's public register before we start work.",
      tags: ["trust"],
    },
    {
      question: "Is it cheaper to wait until the morning?",
      answer:
        "After hours you pay the $99 callout plus a higher hourly rate between 6pm and 7am and across the weekend, so non-urgent work genuinely costs less booked into a weekday, and we will say on the phone which yours is. Where the building is getting wet or the family has no washing facilities, one night of damage outruns the surcharge comfortably.",
      tags: ["pricing", "after-hours"],
    },
    {
      question: "Do you give an arrival window, or do I lose the whole day?",
      answer:
        "Booked jobs get a two-hour window, and the plumber texts when he is on his way, so nobody sits at home from eight in the morning. If the job before yours turns into something larger, we ring you with a revised time rather than letting your window quietly pass.",
      tags: ["booking"],
    },
    {
      question: "How do I turn the water off while I wait for a plumber?",
      answer:
        "Find the water meter, usually in a small box near the front boundary, and turn the tap on the house side of it clockwise until it stops. That isolates the whole property. If it is only hot water leaking, there is also a shut-off on the cold inlet at the top of the hot water unit — close that, and switch the unit's power or gas off as well so it is not heating an empty cylinder.",
      tags: ["emergency", "diy"],
    },
    {
      question: "What payment methods do you take?",
      answer:
        "Card including tap and pay in the van, bank transfer, or PayID, paid on completion. Emergency callouts need no deposit. Larger jobs such as a bathroom rough-in are staged instead — a materials deposit, then progress payments at rough-in and at fit-off — and we never ask for the full amount before the work is done.",
      tags: ["payment"],
    },
    {
      question: "What warranty do I get on the work?",
      answer:
        "Six years on our own workmanship, plus whatever the manufacturer offers on any appliance or part we supply. Cleared drains are guaranteed for twelve months where the camera shows no structural defect, because nobody can warrant a pipe that is already broken. Warranty callbacks come first in the day's run, not after the new work.",
      tags: ["warranty"],
    },
    {
      question: "Do you charge to quote?",
      answer:
        "Not for planned work. A hot water replacement, a new gas line or a bathroom rough-in gets a free site visit and a fixed written price. Diagnostic work is different, because finding a concealed leak or camera-inspecting a drain is skilled labour with equipment attached — that has a fee, and we tell you what it is before we come out.",
      tags: ["pricing", "quotes"],
    },
    {
      question: "Which suburbs do you actually cover?",
      answer:
        "Northcote, Thornbury, Brunswick, Preston and Fairfield are the core area, and the response times quoted on this site apply there. We also take work in Alphington, Clifton Hill, Coburg and Reservoir. If you are a little further out, ring and ask — the honest answer depends on where the on-call van happens to be that night.",
      tags: ["service-area"],
    },
  ],

  brand: {
    primary: "#0a2f5c",
    accent: "#f5a524",
    fontPair: "geometric",
    radius: "sm",
    logoText: "Merri Creek Plumbing",
  },

  trust: {
    abn: "42 617 903 118",
    licenceNumber: "VBA plumbing licence 104562",
    reviews: {
      rating: 4.8,
      count: 212,
      source: "Google Business Profile",
      emitSchema: false,
    },
  },
};
