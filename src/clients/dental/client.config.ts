import type { ClientConfigInput } from "@/config/schema";

/**
 * Demo client: a family and emergency dental practice on Bridge Road, Richmond.
 *
 * Fictional. `demo: true` keeps every page noindexed — fake local-business data must
 * not reach the search index. The prose is written to be answer-first, because the
 * service pages exist to be quoted by a featured snippet or an AI answer.
 */
export const dental: ClientConfigInput = {
  id: "dental",
  businessType: "dentist",
  demo: true,

  name: "Bridge Road Dental Care",
  legalName: "Bridge Road Dental Care Pty Ltd",
  tagline: "Family and emergency dentistry on Bridge Road",
  description:
    "Bridge Road Dental Care is a family and emergency dental practice in Richmond, open six days a week for check-ups, urgent toothache, implants, whitening and children's dentistry across Melbourne's inner east.",
  foundedYear: 2009,

  site: {
    url: "https://bridgeroaddental.duckdns.org",
    locale: "en-AU",
    timezone: "Australia/Melbourne",
    titleTemplate: "%s | Bridge Road Dental Care",
  },

  contact: {
    phone: "+61390104488",
    phoneDisplay: "(03) 9010 4488",
    email: "reception@bridgeroaddental.duckdns.org",
    bookingUrl: "https://bridgeroaddental.duckdns.org/book",
    emergency: true,
  },

  address: {
    streetAddress: "312 Bridge Road",
    suburb: "Richmond",
    state: "VIC",
    postcode: "3121",
    country: "AU",
    geo: { lat: -37.8187, lng: 145.0021 },
    mapUrl: "https://maps.google.com/?q=312+Bridge+Road+Richmond+VIC+3121",
  },

  hours: {
    regular: [
      { days: ["Mon", "Tue", "Wed", "Thu"], opens: "08:00", closes: "18:00" },
      { days: ["Fri"], opens: "08:00", closes: "17:00" },
      { days: ["Sat"], opens: "09:00", closes: "13:00" },
    ],
    alwaysOpen: false,
    closures: [
      { date: "2026-11-03", name: "Melbourne Cup Day" },
      { date: "2026-12-25", name: "Christmas Day" },
      { date: "2026-12-26", name: "Boxing Day" },
      { date: "2027-01-01", name: "New Year's Day" },
    ],
  },

  brand: {
    primary: "#3a4f9b",
    accent: "#c8657f",
    fontPair: "sans-modern",
    radius: "lg",
    logoText: "Bridge Road Dental",
  },

  ai: { preset: "open" },

  trust: {
    reviews: {
      rating: 4.8,
      count: 312,
      source: "Google reviews",
      emitSchema: false,
    },
  },

  serviceAreas: [
    {
      slug: "richmond",
      name: "Richmond",
      state: "VIC",
      postcode: "3121",
      geo: { lat: -37.8183, lng: 145.0008 },
      priority: 10,
      blurb:
        "Our own suburb, and the one we know street by street. Richmond is single-fronted Victorian cottages behind three shopping strips, with sport crowds pouring out of the MCG and AAMI Park on weekends. Most patients walk in from Bridge Road or Church Street, or step off the 48 and 75 trams outside the door. East Richmond station is a four-minute walk.",
      landmarks: [
        "Bridge Road shopping strip",
        "East Richmond station",
        "Melbourne Cricket Ground",
        "Church Street",
      ],
      adjacentTo: ["cremorne", "burnley", "abbotsford"],
    },
    {
      slug: "cremorne",
      name: "Cremorne",
      state: "VIC",
      postcode: "3121",
      geo: { lat: -37.8306, lng: 144.9937 },
      priority: 8,
      blurb:
        "Cremorne is barely eight blocks, wedged between Church Street, Swan Street and the Yarra, and its brick warehouses now hold software and design studios rather than rag trade. Far more people work there than live there, so bookings cluster around lunchtimes and after 5pm. It has no station of its own — most patients walk up Church Street or ride the 78 tram two stops.",
      landmarks: [
        "Nylex clock",
        "Cremorne Street warehouses",
        "Swan Street",
        "Balmain Street studios",
      ],
      adjacentTo: ["richmond", "burnley"],
    },
    {
      slug: "burnley",
      name: "Burnley",
      state: "VIC",
      postcode: "3121",
      geo: { lat: -37.8268, lng: 145.0111 },
      priority: 7,
      blurb:
        "The quiet end of the postcode: a pocket of interwar brick houses and newer townhouses between Burnley Street and the river bend, much of it within earshot of the Monash. Burnley keeps a long-settled population alongside young families who bought for the gardens and the oval. Patients arrive by car in under five minutes, or by train from Burnley station on the Glen Waverley and Alamein lines.",
      landmarks: ["Burnley station", "Burnley Gardens", "Yarra Boulevard", "Burnley Oval"],
      adjacentTo: ["richmond", "cremorne"],
    },
    {
      slug: "abbotsford",
      name: "Abbotsford",
      state: "VIC",
      postcode: "3067",
      geo: { lat: -37.8022, lng: 145.0003 },
      priority: 7,
      blurb:
        "North across Victoria Street, Abbotsford mixes weatherboard cottages with the apartment blocks that replaced the old brewery, so the patient mix runs from long-term owners to renters who move every couple of years. Victoria Street's restaurants, the Convent and the river paths set the rhythm of the place. The 109 tram runs the whole way down Victoria Street to Church Street, and it is a six-minute drive.",
      landmarks: [
        "Abbotsford Convent",
        "Victoria Street",
        "Yarra Bend Park",
        "Victoria Park station",
      ],
      // Not Burnley: the river and Victoria Street sit between them, and adjacency
      // drives internal links, so a claimed edge that isn't geographically true sends
      // readers somewhere unrelated.
      adjacentTo: ["richmond"],
    },
  ],

  services: [
    {
      slug: "emergency-dentist",
      name: "Emergency dentist",
      category: "urgent-care",
      shortDescription:
        "Same-day emergency dental appointments in Richmond for toothache, broken teeth and lost fillings, six days a week.",
      answer:
        "Same-day emergency appointments are held open every weekday and on Saturday morning at our Bridge Road surgery, so a broken tooth, lost filling, knocked-out tooth or severe toothache is usually seen within a few hours of your call. Phone (03) 9010 4488 before 4pm for same-day triage; after-hours messages are returned first thing.",
      body: `## What counts as a dental emergency

Pain that wakes you at night, a tooth knocked out or pushed out of line, a broken cusp with an edge that cuts your tongue, swelling in the gum or jaw, bleeding that will not settle after an extraction, or a crown that has come away and left a raw stump. All of those are worth a same-day call rather than a wait-and-see.

Swelling that is spreading towards your eye or down under your jaw, or that makes swallowing or breathing difficult, is past what a dental chair can fix. That is a hospital problem — call 000 or go straight to the nearest emergency department.

## How same-day appointments work

We hold the first two slots after lunch on weekdays, and two on Saturday morning, for people who ring in that day. The front desk asks three things: where the pain is, when it started, and whether anything has broken or come loose. That is enough to decide whether you need thirty minutes or an hour, and whether you should come before or after the school run.

If every slot is gone by the time you call, we will tell you plainly rather than booking you for a week away — and we will say what will get you through the night.

## Relief first, planning second

An emergency visit is about ending the pain and stabilising the tooth. In practice that means an x-ray, local anaesthetic, and then one of four things: dressing the tooth, opening it to release pressure and start root canal treatment, rebuilding the broken corner, or removing the tooth if it cannot be saved. You will leave knowing what the tooth needs long-term and what that costs, but nothing beyond the urgent work happens at that appointment.

## A knocked-out adult tooth

An adult tooth that has come out whole can often be put back if it is handled well in the first hour. Hold it by the crown and never the root. If it is dirty, rinse it in milk or saline — not water, and never scrub it. Slot it back into the socket and bite gently on a clean cloth if you can; if you cannot, keep it in a cup of milk and bring it with you. Baby teeth are not re-implanted, so ring us but leave the tooth out.`,
      keyFacts: [
        {
          label: "Same-day slots",
          value: "Held every weekday and Saturday morning for urgent cases",
        },
        { label: "Appointment length", value: "30 to 60 minutes, set by phone triage" },
        { label: "From", value: "$145 for an emergency examination, including one x-ray" },
        { label: "Health funds", value: "Claimed on the spot through HICAPS" },
        {
          label: "After hours",
          value: "Messages triaged from 7.30am; call 000 for spreading facial swelling",
        },
      ],
      priceFrom: {
        amount: 145,
        currency: "AUD",
        qualifier: "emergency examination, including one x-ray",
      },
      faqs: [
        {
          question: "Do you see emergency patients who have never been here before?",
          answer:
            "Yes. Roughly half of our emergency appointments are people who have never sat in our chairs. You do not need a referral or a file with us — ring, describe what has happened, and if a slot is free that day it is yours. Bring a list of any medications and the name of your health fund if you have one.",
          tags: ["new-patients"],
        },
        {
          question: "How much does an emergency dental appointment cost?",
          answer:
            "The emergency examination is $145 and includes one x-ray and a plan in writing. Treatment on the day is quoted before we start: a temporary dressing sits at the low end, while an extraction, a rebuilt tooth or the first stage of root canal treatment costs more. Nothing is done without you agreeing to the figure first.",
          tags: ["cost"],
        },
        {
          question: "What can I do about severe toothache overnight?",
          answer:
            "Take the pain relief you would normally take for a headache at its usual dose, keep your head propped up rather than flat, avoid very hot and very cold drinks, and do not put an aspirin tablet against the gum — it burns the tissue. A cold pack against the cheek helps swelling. None of this treats the cause, so ring us when we open; if the swelling spreads or you feel unwell, do not wait for morning.",
          tags: ["pain"],
        },
        {
          question: "My child chipped a front tooth at sport. Is that urgent?",
          answer:
            "Ring us the same day. A small chip with no pain can usually wait until the next morning, but a chip that bleeds, exposes a pink or yellow spot in the middle of the tooth, or leaves the tooth wobbly needs seeing quickly, because the nerve is involved and the window for saving it is short. Keep any broken fragment in milk and bring it in.",
          tags: ["children"],
        },
      ],
      relatedServices: ["check-up-and-clean", "childrens-dentistry", "dental-implants"],
      areaPages: {
        enabled: true,
        titlePattern: "Emergency dentist in {area}",
        intros: {
          richmond:
            "Richmond sends us two kinds of emergency: the sport injury and the strip-shop lunch break. Footy and cricket at the MCG and Punt Road Oval fill our Monday mornings with knocked and loosened front teeth, while Bridge Road retail and hospitality staff ring from a shift they cannot leave for long. Being a four-minute walk from East Richmond station means most of them are in the chair the same day.",
          cremorne:
            "Cremorne's emergencies almost always arrive at lunchtime. Someone bites down on an olive stone at a Swan Street cafe, a filling gives way, and there is a meeting at two that cannot move. We hold late-afternoon slots for exactly this: the walk up Church Street from the Cremorne warehouses takes about eight minutes, so an urgent appointment costs you a lunch hour rather than the rest of the day.",
          burnley:
            "Two things bring Burnley patients in urgently. The first is the Yarra Boulevard: cyclists come off on the bends and arrive with a chipped or displaced front tooth and a grazed chin. The second is the suburb's long-standing crowns and bridges, some fitted decades ago, which tend to fail without warning on something as ordinary as toast. Burnley station to our door is one stop and a short walk.",
          abbotsford:
            "In Abbotsford the urgent calls skew towards families and towards evenings. Kids come off scooters and bikes on the Capital City Trail beside the river, and Victoria Street's restaurant staff finish too late for most practices to help. Our Saturday morning emergency slots exist largely for that, and the 109 tram down Victoria Street drops you at Church Street, two blocks from the surgery.",
        },
      },
    },

    {
      slug: "check-up-and-clean",
      name: "Check-up and clean",
      category: "preventive",
      shortDescription:
        "A 45-minute check-up, scale and clean in Richmond, with on-the-spot health fund claiming and no-gap options.",
      answer:
        "A standard check-up and clean takes 45 minutes and covers a full examination, a scale and polish, fluoride and two small x-rays. Most Australian health funds include two preventive visits a year in extras cover, several with no gap, and we claim through HICAPS while you are at the desk.",
      body: `## What happens in the 45 minutes

The appointment starts with the parts of your mouth that are not teeth: gums, tongue, cheeks and the soft tissue under it all, checked for anything that has changed since last time. Then every tooth surface, and two small bitewing x-rays if your last set is more than two years old.

Scaling lifts the hardened calculus that a toothbrush cannot shift, above and just below the gumline, using an ultrasonic tip and fine hand instruments where the ultrasonic cannot reach. A polish then takes off the surface staining that tea, coffee, red wine and cigarettes leave behind. We finish with fluoride, and with a short list of the specific surfaces you are missing — usually the inside of the lower front teeth and the back of the upper molars.

## Six months, or three

Six months suits most adults because that is roughly how long plaque takes to rebuild into calculus in the places a brush misses. It is a default, not a rule. If you smoke, live with diabetes, wear braces or a plate, take medication that dries your mouth, are pregnant, or have had gum treatment in the past, three or four months is the safer interval and we will say so. Equally, if your mouth has been stable for years, we are not going to invent a reason to see you more often.

## Claiming at the front desk

We are a HICAPS practice, so your fund is claimed while you stand there and you pay only the difference. Preventive visits are the best-covered item in most extras policies: with several of the larger funds the two annual visits carry no gap, and with the rest the gap is usually small. If you are not in a fund, the same appointment is a flat fee, quoted when you book rather than at the end.

## What a healthy mouth gets told

If nothing needs doing, the recommendation is to come back in six months. We do not photograph every tooth to build a treatment plan you did not ask for, and we do not rename a normal clean as something more expensive. When we do find something — an early crack, a shadow on an x-ray, a gum pocket that has deepened — you will be shown it on the screen and given the option of watching it rather than treating it, where watching is genuinely reasonable.`,
      keyFacts: [
        { label: "Appointment length", value: "45 minutes" },
        { label: "From", value: "$199 for examination, scale and clean, fluoride and two x-rays" },
        { label: "No gap", value: "Available with several major funds on preventive extras cover" },
        {
          label: "Recall interval",
          value: "Six months for most adults, three to four if gums need watching",
        },
        { label: "Health funds", value: "HICAPS claimed at the front desk before you leave" },
      ],
      priceFrom: {
        amount: 199,
        currency: "AUD",
        qualifier: "exam, scale and clean, fluoride and two x-rays",
      },
      faqs: [
        {
          question: "How often should I really have a check-up?",
          answer:
            "Every six months for most adults, which is a compromise between how fast plaque hardens and how early a problem can be caught while it is still cheap to fix. Three to four months is better if you smoke, have gum disease, wear braces, or have a dry mouth from medication. Going to twelve months is a reasonable choice for a stable, low-risk mouth, as long as you accept that anything new gets a year to grow.",
          tags: ["prevention"],
        },
        {
          question: "Is a check-up and clean covered by health insurance?",
          answer:
            "Almost always, if you hold extras cover. Preventive dental is the item funds cover most generously, and most policies include two visits per calendar year. Several major funds have no-gap arrangements that cover the appointment in full at this practice. We claim through HICAPS on the spot, so you pay the difference rather than the whole amount and wait for a refund.",
          tags: ["health-funds", "cost"],
        },
        {
          question: "Does a scale and clean hurt?",
          answer:
            "For most people it is closer to uncomfortable than painful — a cold spray, some vibration, and tenderness where gums are already inflamed. The more calculus there is, the more the gums complain, which is the argument for not leaving it three years. If your teeth are sensitive, say so at the start: we can use a desensitising paste first, work in shorter passes, or numb a quadrant if that is what makes the appointment bearable.",
          tags: ["comfort"],
        },
      ],
      relatedServices: ["emergency-dentist", "teeth-whitening", "childrens-dentistry"],
      areaPages: {
        enabled: true,
        titlePattern: "Check-up and clean in {area}",
        intros: {
          richmond:
            "Plenty of Richmond patients book a check-up because they have just moved into one of the cottages off Bridge Road and their old dentist is now forty minutes away in the outer suburbs. The other common reason is shift work: retail and cafe staff on the strip take our 8am slots so a clean does not eat into a trading day. Both groups want a practice they can walk to.",
          cremorne:
            "Cremorne runs on employer-funded extras cover, and it shows in when people book. Appointments fill at lunchtime and after five, and December is our busiest month of the year as studio staff use the benefits that reset in January. We keep 45-minute preventive slots at both ends of the day so a clean fits either side of the walk back down Church Street.",
          burnley:
            "Burnley patients are the most regular on our books — households that have kept the same six-month rhythm for twenty years, often with two or three family members booked back to back on a Saturday morning. Because so many drive in from the streets between Burnley station and the Boulevard, we group family appointments together rather than spreading them across a fortnight.",
          abbotsford:
            "The hard part of preventive care in Abbotsford is that people move. Renters in the Victoria Street apartments change address every year or two, and recall reminders chase an old letterbox until someone notices three years have passed. We recall by text and email rather than post for that reason, and we keep mid-afternoon slots for Victoria Street hospitality staff working split shifts.",
        },
      },
    },

    {
      slug: "dental-implants",
      name: "Dental implants",
      category: "restorative",
      shortDescription:
        "Single and multiple tooth implants planned and placed in our Richmond surgery, from consult to final crown.",
      answer:
        "A dental implant replaces a missing tooth with a titanium post set into the jaw and topped with a custom crown. Treatment runs over three to six months — placement, healing, then the crown — across four or five visits. Costs start at $4,650 per tooth, covering the surgical and crown stages.",
      body: `## Planning comes before anything surgical

The first visit is assessment, not surgery. We take a 3D scan to see how much bone height and width the site has, where the nerve and sinus sit, and whether the neighbouring teeth are sound enough to be worth building around. You also get the honest version of the alternatives, because an implant is not automatically the right answer for a gap.

Two things make an implant a poor first choice: uncontrolled gum disease, which will do to an implant what it did to the tooth, and smoking, which measurably lowers the odds of the post integrating. Neither rules you out permanently. Both are worth sorting out before you spend the money.

## The three stages

**Placement.** Under local anaesthetic, the post goes into the bone through a small opening in the gum. It takes about an hour for a single tooth. Most people describe the days after as pressure rather than pain, managed with ordinary pain relief.

**Healing.** Bone grows onto the surface of the post over three to six months — longer in the upper jaw, shorter in the dense bone of the lower front. A temporary tooth covers the gap while you wait, so you are not walking around with a visible hole.

**The crown.** Once the post is solid, we scan the site, and the laboratory mills a crown matched to the shade and shape of the teeth beside it. It screws or cements onto the post, and we check the bite in fine detail, because an implant has no ligament to absorb a heavy contact the way a natural tooth does.

## When bone has to be built first

A tooth that came out years ago takes bone with it as it goes. If the ridge has thinned too far, a graft adds width or height and needs its own healing period, which adds three to six months and to the cost. We will tell you at the planning visit whether that applies, rather than discovering it mid-surgery.

## Implant, bridge or denture

A bridge is faster and cheaper but requires cutting down the healthy teeth either side, and it loads them for the rest of their lives. A denture is cheapest and least invasive, and the one most often left in a drawer. An implant costs the most up front, touches no other tooth, and preserves the bone in the gap. Which of those trade-offs you prefer is genuinely a matter of circumstance, and we quote more than one option for that reason.

## Keeping it

An implant does not decay, but the gum around it can become inflamed and lose bone, and that is the main reason implants fail years later. It means a six-month clean, a floss or brush that gets under the crown, and a review x-ray from time to time. Maintenance is the cheapest part of the whole exercise.`,
      keyFacts: [
        { label: "From", value: "$4,650 per tooth, covering surgery, abutment and crown" },
        { label: "Treatment time", value: "Three to six months from placement to final crown" },
        { label: "Visits", value: "Usually four or five, including planning and review" },
        { label: "Imaging", value: "3D scan at the planning visit, referred locally in Richmond" },
        {
          label: "Health funds",
          value: "Major dental rebates often apply; your gap is quoted in writing",
        },
        { label: "Interim tooth", value: "A temporary tooth covers the gap while the post heals" },
      ],
      priceFrom: {
        amount: 4650,
        currency: "AUD",
        qualifier: "per tooth, including surgery and crown",
      },
      faqs: [
        {
          question: "How long does the whole implant process take?",
          answer:
            "Three to six months for a straightforward single tooth: about an hour to place the post, then a healing period while bone grows onto it, then two visits to make and fit the crown. If the site needs a bone graft first, add another three to six months. Nothing about the timeline can be safely rushed — the healing is the part doing the work.",
          tags: ["timeline"],
        },
        {
          question: "Am I too old for a dental implant?",
          answer:
            "Age on its own is not a barrier; we have placed implants for patients in their eighties. What matters is bone, gum health, healing capacity and the medications you take — particularly some bone medications and blood thinners, which change the plan rather than cancel it. Being too young is more of an issue: a jaw still growing can leave an implant sitting out of line later.",
          tags: ["suitability"],
        },
        {
          question: "What if I do not have enough bone for an implant?",
          answer:
            "It is common, especially where a tooth has been missing for years, and it is usually solvable. A graft rebuilds width or height at the site, using granular material that your own bone replaces over several months. In the upper back jaw the sinus floor can be lifted to make room. Both add time and cost, and we identify the need from the 3D scan at the planning visit, not on the day of surgery.",
          tags: ["bone-graft"],
        },
        {
          question: "Is an implant better than a bridge?",
          answer:
            "It depends on the teeth either side of the gap. If they are healthy, an implant is usually the better long-term choice because it leaves them untouched and keeps bone in the gap. If those teeth already need crowns, a bridge does two jobs at once and finishes in weeks rather than months. We quote both so the comparison is in front of you in dollars as well as principle.",
          tags: ["alternatives"],
        },
      ],
      relatedServices: ["check-up-and-clean", "emergency-dentist"],
      areaPages: { enabled: false },
    },

    {
      slug: "teeth-whitening",
      name: "Teeth whitening",
      category: "cosmetic",
      shortDescription:
        "Take-home and in-chair teeth whitening in Richmond, supervised by a dentist and matched to your enamel.",
      answer:
        "Take-home whitening from $550 lightens teeth by several shades over ten to fourteen nights using trays moulded to your mouth; in-chair whitening from $795 does similar work in one 90-minute visit. Both need a current check-up first, because peroxide gel over decay or an untreated crack causes real sensitivity.",
      body: `## How whitening actually works

The active ingredient is peroxide. It passes through enamel into the dentine beneath and breaks apart the large pigment molecules that years of tea, coffee, red wine, smoking and curry have deposited there. Nothing is scraped off and no enamel is removed — the tooth is the same thickness afterwards, with lighter pigment inside it.

That also explains the limits. Whitening changes the colour of tooth structure and nothing else, so it lifts general yellowing well, does very little for grey discolouration from old trauma or tetracycline, and can make white patches look briefly more obvious before the surrounding tooth catches up.

## Take-home versus in-chair

Take-home is the workhorse. We scan your teeth, the laboratory makes thin trays that fit your arch exactly, and you wear them with a measured line of gel for an hour or two a day — or overnight with a gentler gel — for about two weeks. The result builds gradually, you control the pace, and you keep the trays for a top-up in a year or two.

In-chair suits a deadline. Your gums are isolated with a barrier, a stronger gel goes on in three or four passes over roughly ninety minutes, and you leave visibly lighter the same day. It is more prone to short-lived zingy sensitivity, and most people still go home with trays to hold the result.

## Sensitivity, and how to keep it manageable

Some sensitivity during a whitening course is normal and it settles once you stop — peroxide temporarily opens the microscopic tubules in dentine. It is manageable: use a sensitive toothpaste for a fortnight beforehand, shorten each wear to an hour, skip a night when your teeth feel sharp, and do not double the gel to go faster, which only trades comfort for no extra shade.

## What we check before you start

A current examination, because gel finding a cavity or a crack is the single most common cause of a miserable whitening experience. We also record your starting shade and note every crown, veneer and white filling in your front teeth. Those do not lighten. If a front crown currently matches a stained tooth, whitening the teeth around it will leave it looking dark, and the fix is replacing the crown afterwards — better to know that before, not after.

## Making it last

Expect a couple of years from a full course if you are not a heavy coffee or red wine drinker, less if you are. A single night of gel every few months holds the shade far more cheaply than starting again. Rinsing with water after coffee helps more than brushing straight afterwards, which rubs acid into softened enamel.`,
      keyFacts: [
        { label: "Take-home from", value: "$550, including custom trays and gel" },
        { label: "In-chair from", value: "$795 for one 90-minute visit" },
        { label: "Appointment length", value: "20 minutes to scan for trays, 90 minutes in chair" },
        { label: "Prerequisite", value: "An examination within the last twelve months" },
        {
          label: "Typical result",
          value: "Several shades over ten to fourteen nights, held with top-ups",
        },
      ],
      priceFrom: {
        amount: 550,
        currency: "AUD",
        qualifier: "take-home kit with custom trays",
      },
      faqs: [
        {
          question: "How long does teeth whitening last?",
          answer:
            "Usually a year or two from a full course, and less if coffee, tea, red wine or smoking are daily habits. The honest way to think about it is maintenance rather than a one-off: a single night of gel in your existing trays every few months holds the shade, and costs a fraction of repeating the whole course. Keep the trays — they stay usable for years.",
          tags: ["longevity"],
        },
        {
          question: "Will whitening work on crowns, veneers or white fillings?",
          answer:
            "No. Peroxide only changes natural tooth structure, so porcelain and composite stay exactly the shade they were made. That matters most in the front teeth: whitening the teeth around a matched crown will leave the crown looking dark by comparison. We note every restoration in your smile line before you start, and where it is going to be a problem we say so and price the replacement, so you can decide in advance.",
          tags: ["restorations"],
        },
        {
          question: "Is whitening safe if my teeth are already sensitive?",
          answer:
            "Usually yes, with adjustments. Sensitivity during whitening is temporary and reversible, but it is worse in people who start out sensitive. Two weeks of desensitising toothpaste first, a lower-concentration gel, shorter wear times and a night off whenever teeth feel sharp make a real difference. If sensitivity is coming from something specific — a crack, gum recession, decay — that gets treated first.",
          tags: ["comfort"],
        },
        {
          question: "Are supermarket whitening kits worth trying?",
          answer:
            "They are cheap and largely harmless, and they will not do much. Over-the-counter kits are capped at low peroxide concentrations, and their one-size strips or boil-and-bite trays leak gel onto the gums instead of holding it against the tooth. The bigger risk is skipping an examination: whitening over undiagnosed decay hurts and delays the treatment the tooth needed anyway.",
          tags: ["diy"],
        },
      ],
      relatedServices: ["check-up-and-clean", "dental-implants"],
      areaPages: { enabled: false },
    },

    {
      slug: "childrens-dentistry",
      name: "Children's dentistry",
      category: "preventive",
      shortDescription:
        "Gentle children's dentistry in Richmond, with bulk-billed care for families eligible for the CDBS.",
      answer:
        "Children should see a dentist by their second birthday and every six months after that. Eligible families can have check-ups, cleans, fillings and extractions bulk billed under the Child Dental Benefits Schedule, which currently covers just over $1,100 across two calendar years. First visits are short, unhurried and mostly about looking.",
      body: `## The first visit is a rehearsal

By age two there are enough teeth to check and enough habit-forming left to influence. A first appointment is deliberately undemanding: your child sits on your lap or in the chair with you beside it, meets the light and the little mirror, has a count of their teeth, and leaves. If they will not open their mouth, that is a normal outcome and not a failed appointment — the point is that the room stops being unfamiliar before anything needs doing in it.

Booking mid-morning helps more than parents expect. Tired, hungry children at 4.30pm are a different proposition entirely.

## What we watch for at each age

Under five: bottle and sippy-cup habits, the front teeth for early decay, and whether brushing is reaching the back molars. Adults should be doing the brushing until around age eight, because hand coordination lags enthusiasm badly.

Five to eight: adult front teeth arriving, the bite starting to reveal crowding, and the first adult molars, which have deep grooves that catch food and are the single most common site of childhood decay. A fissure sealant — a thin flowable coating painted into those grooves, no drilling and no needle — is one of the highest-value five minutes in dentistry.

Nine and up: the remaining adult teeth, wear from grinding, sport injuries, and the beginnings of the orthodontic conversation. We will tell you if a referral is worth making, and equally if waiting a year costs nothing.

## The Child Dental Benefits Schedule

The CDBS gives eligible children a capped amount of Medicare-funded dental care across two calendar years — just over $1,100 at present — covering examinations, x-rays, cleans, fluoride, fissure sealants, fillings, root canals on baby teeth and extractions. Eligibility follows the family payment your household receives; we check it with Medicare while you are at the desk and tell you the remaining balance. We bulk bill it, so there is nothing to pay on the day and no claim for you to lodge.

## Anxious children

Some children arrive already frightened, often after a painful appointment elsewhere. What works is slowing down: naming each instrument, showing it on a finger first, agreeing on a stop signal and actually stopping when it is used. We will split treatment across more, shorter visits rather than push through a long one, and we do not hold children still or pretend an injection is not an injection. Where dental work genuinely cannot be done in a normal chair, we say so and refer, rather than repeating an appointment that is not going to work.

## Mouthguards

Any child playing football, hockey, basketball or netball should have a custom mouthguard, fitted over two visits and remade every year or two as the jaw grows. A boil-and-bite guard from a sports store is better than nothing and considerably worse than one moulded to the teeth — it loosens the moment the jaw relaxes, which is exactly when the impact arrives.`,
      keyFacts: [
        { label: "First visit by", value: "Age two, then every six months" },
        {
          label: "Bulk billed",
          value: "For children eligible under the Child Dental Benefits Schedule",
        },
        {
          label: "CDBS cap",
          value: "Just over $1,100 across two calendar years, checked at the desk",
        },
        { label: "Appointment length", value: "30 minutes, longer for a first visit" },
        { label: "Mouthguards", value: "Custom sport mouthguards fitted across two visits" },
      ],
      faqs: [
        {
          question: "When should my child first see a dentist?",
          answer:
            "By their second birthday, or earlier if you have noticed a mark on a tooth, a knock, or trouble eating. The first visit is about familiarity rather than treatment — a count of the teeth, a look for early decay, and a conversation with you about brushing and drinks. Starting while nothing hurts is the whole trick; a first appointment that happens because of toothache is a much harder introduction.",
          tags: ["first-visit", "children"],
        },
        {
          question: "What is the Child Dental Benefits Schedule and do we qualify?",
          answer:
            "The CDBS is a Medicare scheme that covers basic dental care for eligible children up to a capped amount over two calendar years. Eligibility depends on your child's age and on the family payment your household receives, such as Family Tax Benefit Part A. You do not need to work it out yourself — we check your entitlement and remaining balance with Medicare at the front desk, and we bulk bill, so eligible visits cost you nothing on the day.",
          tags: ["cdbs", "cost"],
        },
        {
          question: "Do baby teeth with decay actually need filling?",
          answer:
            "Often, yes — it depends on the tooth and how many years it has left to serve. A back baby molar may not be replaced until age eleven or twelve, so leaving decay in it risks pain, infection and an extraction that lets the neighbouring teeth drift into the space. A front tooth due to come out within months is a different calculation. We will explain which situation you are in and what happens if you wait.",
          tags: ["children", "fillings"],
        },
        {
          question: "My child is terrified of the dentist. What can you do?",
          answer:
            "Book a visit with nothing planned. No treatment, no expectation of opening wide — just sitting in the chair, meeting the instruments, and leaving on a good note. From there we agree a stop signal, show each instrument before it is used, and spread work across several short appointments. Nothing gets forced. If treatment truly cannot happen in a normal chair, we will tell you honestly and refer you to a paediatric specialist.",
          tags: ["anxiety", "children"],
        },
      ],
      relatedServices: ["check-up-and-clean", "emergency-dentist"],
      areaPages: { enabled: false },
    },
  ],

  faqs: [
    {
      question: "How much is a first appointment?",
      answer:
        "A new-patient examination, scale and clean, fluoride and two x-rays is $199. If you are coming in because something hurts, the emergency examination is $145 and includes an x-ray and a written plan. Any treatment beyond that is quoted before it starts — we do not begin work you have not seen a price for.",
      tags: ["cost"],
    },
    {
      question: "Which health funds do you accept, and can I claim on the spot?",
      answer:
        "All Australian funds, through HICAPS at the front desk: you pay the gap rather than the full amount, and there is no claim form for you to lodge. We also hold no-gap preventive arrangements with several of the larger funds, which usually covers a twice-yearly check-up and clean in full. Bring your card, or your fund number if the card is on your phone.",
      tags: ["health-funds", "cost"],
    },
    {
      question: "What happens at my first visit?",
      answer:
        "Forty-five minutes, most of it spent looking and talking. We take a short medical and dental history, examine your teeth, gums and soft tissues, take two small x-rays, and clean and polish. You then see what we found on the screen and get a written plan with priorities and costs — what needs doing now, what can be watched, and what is genuinely optional.",
      tags: ["first-visit"],
    },
    {
      question: "Is there parking near the practice?",
      answer:
        "Yes. There is metered one-hour parking directly on Bridge Road and two-hour parking on the residential side streets behind us, which is usually easier mid-morning. East Richmond station is a four-minute walk, and the 48 and 75 trams stop outside the door. If you are being sedated or have had an extraction, arrange a lift rather than driving yourself home.",
      tags: ["parking", "richmond"],
    },
    {
      question: "Can I be seen today if I am in pain?",
      answer:
        "Usually. We keep same-day slots free every weekday and on Saturday morning for urgent problems, so ring before 4pm and describe what has happened. If the day is genuinely full we will say so rather than book you a week out, and we will tell you how to manage until we can see you. Spreading facial swelling or difficulty swallowing is a hospital matter — call 000.",
      tags: ["emergency"],
    },
    {
      question: "I have avoided the dentist for years. Where do I start?",
      answer:
        "With an appointment where nothing is done. We will look, take x-rays, and tell you what is there — and that is the whole visit if you want it to be. From there, treatment gets sequenced into short appointments in the order that matters, starting with whatever is likely to cause pain. Tell the front desk when you book that it has been a long time; it changes how we run the appointment, and nobody here is going to lecture you.",
      tags: ["anxiety", "new-patients"],
    },
    {
      question: "Can I pay for larger treatment in instalments?",
      answer:
        "Yes. Longer courses of work such as implants or crowns are staged over months anyway, so payments fall due stage by stage rather than all at once. We also accept the common interest-free payment plans for dental treatment, and for a planned course we will write out the schedule of what falls due when before you commit to anything.",
      tags: ["cost", "payment"],
    },
    {
      question: "Do you treat children, and do you take the Medicare dental scheme?",
      answer:
        "We see children from around age two, and we bulk bill the Child Dental Benefits Schedule for eligible families, which means no payment on the day and no claim for you to lodge. We check your entitlement and remaining balance with Medicare at the front desk. If you would like the whole family seen in one trip, ask for consecutive appointments when you book.",
      tags: ["children", "cdbs"],
    },
  ],
};
