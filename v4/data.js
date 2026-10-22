/* v4 project data. null = not confirmed yet, shown as a [확인필요] flag on the page */
const N = "curious/n/"; // the separated Curious assets
const B = "banilaco/n/";
const C = "citi/n/";
const W = "woktok/n/";
const PROJECTS = [
  { id: "curious", name: "Curious", role: "Content design", c: "#03C124",
    year: "2025-2026", contribution: "100%", work: "Detail pages, ads, social content",
    line: ["One design language for the detail pages, ads and social content of a knowledge-sharing platform for people in midlife."],
    body: [
      "Curious is a seed-stage startup for learners in their 40s to 60s. Its guidelines stopped at UI/UX: fonts and colors.",
      "On top of the CI, I built a brand guide for design: 4 colors, 2 typefaces and a clover motif taken from the mascot. It covers detail pages, ads, social content and offline event materials.",
      "To keep it consistent at speed, I built a Figma component library and standardized the AI image prompts.",
    ],
    nums: [["219+", "Detail pages in a year"], ["4-5h → 2-3h", "Time per piece"], ["236K", "Views on the best post"]],
    shots: [["curious-mc.webp", "Detail pages"], ["curious-insta.webp", "Instagram"], ["curious-meta.webp", "Meta ads"]],
    // one project, three pieces of work, in the order of the portfolio PDF sent to Cosmax (pages 16-40).
    // g = which piece a part belongs to. Words kept to the point; nothing added that the PDF does not say
    flow: [
      { g: "Mini class", t: "Overview", blocks: [
        { open: N + "group.webp", ratio: "1998 / 866", alt: "Curious members at an offline event" },
        { notes: [["Curious?", "A knowledge-sharing platform for people in midlife, with classes and a community for life's second half."],
                  ["Mini Class", "A free class every Tuesday and Thursday at 8 pm. Most new members meet Curious here first, which makes it the face of the brand."]] },
        { stats: [["600+", "Midlife creators earning on Curious"], ["KRW 8.5M+", "Average monthly income of top creators"], ["10K+", "Creator reviews"]] },
      ] },
      { g: "Mini class", t: "Problem", blocks: [
        // callouts: [title, text, x%, y%] on each picture, drawn as you reach them
        { callouts: [
          { img: N + "old-1.webp", w: 500, h: 1013, alt: "The old thumbnail list", sub: "Thumbnail", side: "l",
            notes: [["No color system", "The color changed with every speaker.", 20, 23],
                    ["Too much text", "Tags, title and intro crammed together, with the title repeated below.", 29, 46]] },
          { img: N + "old-2.webp", w: 500, h: 1013, alt: "The old detail page", sub: "Detail page", side: "r",
            notes: [["Text only", "A list of facts with no graphics and no hook.", 48, 40],
                    ["Stiff tone", "At odds with Curious' motto, “a joyful playground for midlife”.", 55, 60]] },
        ] },
      ] },
      { g: "Mini class", t: "Design Values", i: "Recognizable from the thumbnail alone, and easy for midlife readers to read.", blocks: [
        { values: [["Consistent", "Fixed colors / templates"], ["Readable", "Less text / images"], ["Friendly", "Light tone / clover"]] },
      ] },
      { g: "Mini class", t: "Brand Guideline", blocks: [
        { split: [{ sub: "Color", text: "Brand green only, with one bright yellow as the accent." },
                  { swatches: [["Curious Green", "#03C124"], ["Delight Yellow", "#FFAA00"], ["Warm Gray", "#F8F7F5"], ["Deep Black", "#121212"]] }] },
        { split: [{ sub: "Typeface", text: "Body text 1.5× larger: minimum 28pt → 42pt.", grow: [["28pt", 28], ["42pt", 42]] },
                  { type: [["Title", "Sandoll Nemony 2", "", N + "nemony.png"], ["Body", "Pretendard", "kr"]] }] },
        { split: [{ sub: "Motif", text: "The clover from Curi, the mascot, drawn in thin, loose lines." }, {}] },
        { drift: N + "motif.webp", ratio: "1319 / 300", alt: "Curi the mascot and the clover motif" },
      ] },
      { g: "Mini class", t: "Thumbnail & Detail Page", blocks: [
        { duo: [
          { imgs: [["curious/lecture-sq.webp", "1 / 1"]], alt: "Mini class thumbnail", sub: "Thumbnail", text: "The face comes before the title.", pills: ["Person first", "Less info", "One tone"] },
          { imgs: [[N + "new-1.webp", "638 / 1292"], [N + "new-2.webp", "638 / 1292"]], alt: "The new detail page", sub: "Detail Page", text: "Images instead of a wall of facts.", pills: ["Image-led", "More info", "Easier to read"] },
        ] },
      ] },
      { g: "Mini class", t: "Detail Page, Part by Part", blocks: [
        // the whole page runs up behind a reading line; the last number is where that part sits on the page (0 top, 1 bottom)
        { reader: { img: N + "dp-page.webp", w: 720, h: 16246, end: 0.8, alt: "The new mini class detail page, top to bottom",
          notes: [["Hook", "Opens with “my story”, not the speaker intro, then names what the reader is missing.", 0],
                  ["Profile", "Credentials cut to the key lines, with the speaker's book as proof.", 0.27],
                  ["Live", "Makes clear it's live, not recorded.", 0.42],
                  ["Essentials", "The class's 3 key points, and what you leave with.", 0.48],
                  ["3D Icons", "3D icons instead of plain lists. AI-made, then tone-corrected.", 0.66]] } },
      ] },
      { g: "Mini class", t: "Module System", i: "Modular templates built from Figma components.", blocks: [
        { zoom: N + "module.webp", ratio: "1380 / 975", alt: "Figma module board" },
        { split: [{ notes: [["Usage", "A trained AI trims the class plan to the design rules, then only the modules it needs go in."],
                            ["Result", "The time saved went into Meta ads."]], one: true },
                  { time: { k: "Time per piece", max: 5, rows: [["4-5h", 4.5], ["2-3h", 2.5]], d: "−44%", dk: "Production time" } }] },
      ] },
      { g: "Mini class", t: "Image System", i: "Every icon made with **generative AI** (Sora, ChatGPT, Grok), kept consistent with set keywords and a guideline.", blocks: [
        { strip: ["sign", "clock", "chatbot", "video", "crown", "pdf", "gavel", "coffee", "calli", "lock", "paint", "siren"].map((n) => N + "i-" + n + ".webp"),
          notes: [["3D Icon", "Soft light and a squishy, solid feel."],
                  ["Material", "Translucent glass and matte plastic, in miniature."],
                  ["Rounded", "Simple shapes, every corner rounded."]] },
      ] },
      { g: "Mini class", t: "Application", blocks: [
        { list: ["Instagram Story", "Meta Ads", "Banners, mobile & PC", "Recorded class thumbnails"] },
        { zoom: N + "class-mock.webp", ratio: "1920 / 937", alt: "The mini class on a story, an ad and the app" },
      ] },

      { g: "Meta ads", t: "Meta Ads", blocks: [
        { open: N + "ads-grid.webp", ratio: "1680 / 900", alt: "Curious Meta ads" },
        { notes: [["Background", "Monthly sign-ups fell to 257 in October 2025, and class attendance fell with them. Ads were planned in December and ran for every class from January 2026."],
                  ["Role", "Ad planning & copy / AI images / creative design"],
                  ["Channel", "Instagram and Facebook. 3 creative types in 3 sizes."]] },
        { stats: [["150+", "Ad creatives"], ["+299%", "Average daily sign-ups"]] },
      ] },
      { g: "Meta ads", t: "Ad Types", blocks: [
        { cards: [["curious/lecture-sq.webp", "Lecture", "Speaker photo · mini class design", "The mini class design, our only creative until then."],
                  ["curious/problem-sq.webp", "Problem", "Person photo · question headline", "A Korean woman in her 40s voices the target's worry."],
                  ["curious/benefit-sq.webp", "Benefit", "3D gift box · dark background", "For people who hate to miss out."]] },
      ] },
      { g: "Meta ads", t: "Visual System", i: "Every image made with **generative AI**, to produce creatives fast.", blocks: [
        { split: [{ sub: "3D Graphic", text: "The detail page's 3D style, showing what the class gives you.", pills: ["Translucent glass", "Matte plastic", "Simple shapes"] }, {}] },
        { lane: [1, 2, 3].map((i) => N + "v-" + i + ".webp"), ratio: "457 / 649", dir: 1, alt: "3D gift box ads" },
        { split: [{}, { sub: "Person", text: "AI portraits matched to each topic: the worry, or the relief once it is solved.", pills: ["Korean woman, 40s", "Close-up, blurred background", "Bright lighting"] }] },
        { lane: [1, 2, 3, 4, 5].map((i) => N + "p-" + i + ".webp"), ratio: "3 / 4", dir: -1, alt: "AI portraits" },
      ] },
      { g: "Meta ads", t: "A/B Test", i: "3 creatives per class, until only the best 2 kept running.", blocks: [
        // the loop from the PDF, laid on the tape: each stop lights up in turn
        // held while the test plays out, one step per stretch of scroll
        { abplay: { max: 0.5,
          steps: [["Run 3", "Three creatives launch for one class."],
                  ["A day later", "Ads Manager reports each one's cost."],
                  ["Cut", "The least efficient one stops."],
                  ["Add", "A new creative built from what worked, changing only the image or the headline."]],
          ads: [["curious/lecture-b.webp", "Lecture", "$0.44", true], ["curious/problem-b.webp", "Problem", "$0.25"], ["curious/benefit-b.webp", "Benefit", "$0.31"]],
          add: { img: N + "ab-new.webp", alt: "The new creative", from: [["Image", "Problem"], ["Headline", "Benefit"]] } } },
      ] },
      { g: "Meta ads", t: "Result", blocks: [
        // before is read small; after grows as you scroll
        { chart: { y: "New sign-ups", x: "Month", from: 4, note: [3, "Ads added"],
                   gain: [["8.3", "33.1", "Average daily sign-ups"], ["40", "90", "Average mini class attendance"]],
                   bars: [["2025.10", 257], ["2025.11", 266], ["2025.12", 277], ["2026.01", 334], ["2026.02", 615], ["2026.03", 1027]] } },
      ] },

      { g: "Instagram", t: "Instagram", dark: true, zone: "Plus: running the Curious Instagram", blocks: [
        { open: N + "insta-all.webp", ratio: "1834 / 1080", alt: "Curious Instagram posts" },
        { notes: [["Period", "Sep 2025 – Feb 2026 (5 months)"],
                  ["Role", "Planning, design, filming and account management, plus 3 collaborations with outside marketers."],
                  ["Audience", "People in their 40s to 60s who have stopped and want to start again."]] },
        { sub: "Keyword", pills: ["Career break, career change", "New challenge, fear of starting", "Thirst for learning"] },
        { stats: [["236K", "Top views"], ["37+", "Posts, incl. videos since made private"], ["4,762", "Top shares and saves"]] },
      ] },
      { g: "Instagram", t: "Strategy", dark: true, i: "All the way to a class sign-up on content alone, no ad spend.", blocks: [
        { venn: [["Traffic", "Bite-sized content draws people in."],
                 ["Rapport", "Class and in-house content builds trust."],
                 ["Conversion", "Course intros and reviews lead to premium class sign-ups."]] },
      ] },
      { g: "Instagram", t: "Content Structure", dark: true, blocks: [
        // the same stacked cards as Design Values: [word, what it is for, what it is]
        { values: [["Motivation", "To bring people in", "“It's not too late”"],
                   ["Information", "To earn trust", "Tips you can use today"],
                   ["Conversion", "To drive action", "Course intros, reviews, leader intros"]] },
      ] },
      { g: "Instagram", t: "Brand Assets", dark: true, blocks: [
        // [title, text, x%, y%, swatch]
        { callouts: [
          { img: N + "story-b.webp", w: 408, h: 724, alt: "A motivational story", side: "l",
            notes: [["Motivation", "For people held back by age: let's try again.", 30, 40, ["Black", "#000000"]]] },
          { img: N + "story-c.webp", w: 407, h: 724, alt: "An in-house story", side: "r",
            notes: [["Original", "In-house content, set apart by the brand color on the cover.", 27, 49, ["Dark Green", "#0F691E"]]] },
        ] },
        // each font set in itself, with a line from the real covers
        { fonts: [["Cover Font", "Leferi Base Type", "120pt / leading 130% / tracking −1.5%", "30년 동안 쌓아온 경력,", "leferi"],
                  ["Reels Font", "Gamtan Road", "100pt / leading 120% / tracking −4%", "제일 좋을 때는 바로 지금이야", "gamtan", N + "story-a.webp"]] },
        { cardnews: { img: N + "insta.webp", ratio: "1767 / 1208", alt: "Card news on Instagram",
                      h: "Information Card News", t: "A “digital memo pad in your phone”: useful tips and reflection posts.",
                      font: ["Card News Font", "Leferi Base Type", "Title 120pt / body 40pt", "회고 질문 31개", "leferi"] } },
      ] },
      { g: "Instagram", t: "Caption", dark: true, blocks: [
        // **…** is set bold, the way the PDF marks the point of each line
        { caption: { lead: "A caption machine that writes in one voice, whoever uses it.",
                     gpts: [N + "ai-1.webp", "609 / 840"], note: "A custom GPT I built for captions only, shared with the team and also used for YouTube.",
                     out: { img: N + "ai-2.webp", w: 695, h: 1237, alt: "A caption written by the GPT", side: "r",
                            notes: [["Type number", "Each content type has a number and its own tone: warm for motivation, sharp for information.", 98, 8],
                                    ["Hook", "", 98, 25],
                                    ["Empathy", "", 98, 33],
                                    ["Message", "", 98, 64],
                                    ["Brand intro & CTA", "", 98, 79]] } } },
      ] },
      { g: "Instagram", t: "Contents Flow", dark: true, i: "Re-edited from the original so **the scroll-stopping moment comes first.**", blocks: [
        // the four cuts arrive one by one, left to right, and end side by side. [file, step, the line in the clip, what it does]
        { row: [[N + "flow1.webp", "Hook", "“Life doesn't go the way I think. My actions become my life.”", "A line, not a face, stops the scroll. The point lands in 3 seconds."],
                [N + "flow2.webp", "Empathy", "“I think I worried most in my 40s. Can I keep doing this?”", "“40s” up front: your worry is normal."],
                [N + "flow3.webp", "Turn", "“Then one day, I stopped worrying.”", "The answer: stop worrying."],
                [N + "flow4.webp", "Action", "“Am I awake? Am I alive? What can I do? Just do it. Only my actions become my life.”", "Ends on a push to act, not just think."]], ratio: "360 / 550", times: [[0, "0–4s"], [5, "5s"], [12, "12s"], [20, "20s"]] },
      ] },
    ] },
  { id: "citi", name: "Citi Bank", role: "Brand design", c: "#3232E6",
    year: "2025", contribution: "100%", work: "Logo, key visual, card, app",
    line: ["A rebrand of Citibank that starts from one question: why was a top-tier bank forgotten?"], body: null, nums: null,
    shots: [["citi/n/billboard.webp", ""]], hero: "2000 / 1333",
    // the rebrand in the order of the portfolio PDF sent to Hanwha (pages 4-14). Nothing added that the PDF does not say
    flow: [
      // one piece of work, so the parts carry no work label
      { t: "Overview", blocks: [
        { path: [["Question", "Top-tier, yet forgotten. Finding out why came first."],
                 ["Situation", "Since leaving consumer banking in 2021, Citi has kept 26 branches and the image of an old bank."],
                 ["Then what?", "So I asked people what they want from a bank."]] },
        { survey: { note: "20 working people in their 20s to 50s. Multiple answers; answers under 5% left out.",
                    qs: [["Why don't you bank with Citi?", [["Too little information", 46], ["Prefer another bank", 38], ["Too few branches", 16]]],
                         ["What matters most when you choose a bank?", [["Easy access", 38], ["Simple online service", 31], ["Rates and fees", 26]]]],
                    words: [["What do you like about your bank now?", ["Easy deposits and withdrawals", "Top-tier trust", "An intuitive app", "No fees", "Plenty of information", "Points"]],
                            ["What comes to mind with Citibank?", ["A foreign company", "Unfamiliar", "An old bank"]]] } },
      ] },
      { t: "Insight", i: "A hypothetical project that assumes Citibank resumes full service in Korea.", blocks: [
        { split: [{ sub: "Wanted", text: "What people want from a bank", pills: ["Easy access", "Personal solutions", "Fast fixes", "Finance explained simply", "Safe banking"] },
                  { sub: "Online Service", text: "Citi left because branches cost too much, so the fix isn't more branches. Win back access online." }] },
        // [as-is, what it means, to-be, what it means]: the PDF names each side only
        { asis: [["26 branches, no app updates", "", "A 24-hour counter, an AI assistant", ""],
                 ["An old-bank image", "", "A bold, global new image", ""],
                 ["Perks for loyal customers only", "", "Perks matched to each customer", ""]] },
      ] },
      { t: "Design Values", i: "Fast, technical banking built on AI and online-first infrastructure.", blocks: [
        { values: [["Always", "Across time and place", "Gradient / blur"], ["Precise", "Services fitted to each person", "Bento layout / arrows"], ["Visionary", "Tells you before you ask", "Futuristic / bold"]] },
      ] },
      { t: "Logo Design", blocks: [
        { logo: { before: C + "before.png", mark: C + "logo-mark.svg", guide: C + "logo-guide.svg", ratio: "900 / 440", cols: 8, alt: ["The old Citi logo", "The new Citi logo"],
                  subs: [[C + "sub-bank.svg", "citi bank"], [C + "sub-securities.svg", "citi securities"], [C + "sub-insurance.svg", "citi insurance"], [C + "sub-card.svg", "citi card"]],
                  notes: [["Symbol", "One line from the old logo's sun, extended into **a sun that always rises**."],
                          ["Service Logo", "One family for Citi's businesses: bank, securities, insurance and card."],
                          ["Digital Visibility", "The old logo was a wordmark alone. With a symbol, Citi stands on its own on screen, down to an app icon."]] } },
        { zoom: C + "app-icon.webp", ratio: "16 / 9", alt: "The Citi app icon on a phone home screen" },
      ] },
      { t: "Brand Slogan", i: "Not the ‘ah’ of frustration, but the ‘ah!’ of clarity.", blocks: [
        { open: C + "slogan.webp", ratio: "1920 / 854", alt: "a. a.a.a. ask. anything. anytime. anywhere." },
      ] },
      { t: "Design Typeface", blocks: [
        { typeon: { img: C + "note.webp", pos: "45% 50%", alt: "Citi notebooks",
                    faces: [["Korean", "Sandoll Jebi 2", "", C + "jebi.png", "A serif with sharp, graceful strokes, like the swallow it's named after. Three weights, for headlines and body copy alike."],
                            ["English", "Gyst Variable", "", C + "gyst.png", "Iconic grooves, sharp notched ends and plenty of variables. A lot for a bank, but why not?"]] } },
      ] },
      { t: "Brand Color", i: "True Blue leads, Vivid Red points, and New Era blends Citi's colors into a gradient.", blocks: [
        // the cards kept whole; where the picture runs out, its own dark carries on. A line runs from each card to its color
        { full: true, mode: "on", lit: true, callouts: [
          { img: C + "cards.webp", w: 16, h: 10, extend: "linear-gradient(90deg, #171717, #1E1C1C)", alt: "Citi cards in the five brand colors", side: "l",
            notes: [["New Era", "Citi's colors blended", 41.4, 26, ["Gradient", "radial-gradient(55% 60% at 62% 102%, #F4F4FA 0%, rgba(214, 214, 255, 0.7) 35%, rgba(150, 150, 255, 0) 70%), radial-gradient(55% 70% at 100% 100%, #C9C9FF 0%, rgba(201, 201, 255, 0) 75%), radial-gradient(110% 120% at 100% 0%, #2B2BFF 0%, #1E1EE6 30%, #4B4BEF 55%, rgba(75, 75, 239, 0) 80%), linear-gradient(140deg, #000 22%, #1E1E1C 50%, #4A4A3A 100%)"], "l", 20],
                    ["Base White", "", 34.9, 57, ["#FAFAFA", "#FAFAFA"], "l", 19],
                    ["Solid Gray", "", 62.5, 24, ["#C8C8C8", "#C8C8C8"], "r", 82],
                    ["Vivid Red", "Point color", 70.2, 56, ["#FF0023", "#FF0023"], "r", 83],
                    ["True Blue", "Main color", 54.9, 83, ["#3232E6", "#3232E6"], "r", 82]] },
        ] },
      ] },
      { t: "Key Visual", blocks: [
        // [title, text, x%, y%] on the poster, cropped in from the wide photo
        // the poster fills the row; its notes sit on the dark around it
        { full: true, mode: "on", lit: true, callouts: [
          { img: C + "kv.webp", w: 16, h: 10, crop: [1, "50% 50%"], alt: "The Citi key visual poster", side: "l",
            notes: [["Arrow", "Clear directions instead of confusing finance.", 56, 12, null, "l", 42],
                    ["Bento design", "Each tile a service, fitted to the person.", 74, 52, null, "r", 82],
                    ["Narrow margins", "Tight gaps for airtight security and service packed with perks.", 46, 69, null, "l", 20]] },
        ] },
      ] },
      { t: "Applications", blocks: [
        { imgs: [[C + "business.webp", "4 / 5"], [C + "eternity.webp", "4 / 5"]], alt: "Citi business cards and a Citi Gold poster" },
      ] },
    ] },
  { id: "banilaco", name: "Banilaco", role: "Brand design", c: "#FFA8AD", ink: "#E6506E", // pomegranate: the accent for words on paper
    year: "2025", contribution: "100%", work: "Logo, key visual, packaging",
    line: ["A rebrand of Banila Co built on its heritage and ingredients you can see."],
    body: null, nums: null,
    shots: [["banilaco/n/billboard.webp", ""]], hero: "2000 / 935",
    // the rebrand in the order of the portfolio PDF sent to Cosmax (pages 4-15). Nothing added that the PDF does not say
    flow: [
      // one piece of work, so the parts carry no work label
      { t: "Overview", blocks: [
        { path: [["Motive", "I started this rebrand as a customer who had gone through tube after tube."],
                 ["Gap", "The products held up; the brand's pull didn't. People had either never tried it or never stopped."],
                 ["Approach", "So I asked shoppers how they see Banila Co and the H&B market."]] },
        // each question read off the tape: the top answer large, every answer a length
        { survey: { note: "20 people in their 20s and 30s who wear makeup three or more days a week. Multiple answers; answers under 5% left out.",
                    qs: [["What sways you most when you buy cosmetics?", [["Reviews and ratings", 53], ["Ingredients and efficacy", 35], ["Brand value and trust", 8]]],
                         ["Why do you keep using Banila Co?", [["Product quality", 57], ["Value for money", 29], ["Ingredients that suit my skin", 7]]],
                         ["Why pass on a brand?", [["Don't know it well", 28], ["Use a similar brand", 28], ["Not interested", 28], ["Too little product info", 7]]]],
                    words: ["What comes to mind with Banila Co?", ["Pink", "Cleansing", "A certain model", "Value for money", "Old road shop", "Good products"]] } },
      ] },
      { t: "Insight", blocks: [
        { split: [{ sub: "Wanted", text: "What shoppers want from an H&B brand", pills: ["Health & wellbeing", "Personal solutions", "Sustainability", "Social media trends", "A well-known brand", "Stores to try things in", "Easy to reach"] },
                  { sub: "Brand Vision", text: "Step away from models and collabs. Build the brand on its long heritage, an inclusive range, eco-friendly ways and years of skill." }] },
        // [as-is, what it means, to-be, what it means]
        { asis: [["Common pink", "Pink comes to mind, but not whose pink.", "Banila Co's pink", "The B-and-circle symbol and pink, grown into a visual language only Banila Co has."],
                 ["Old road shop", "Road shops left the high street; the name stayed as an ‘old brand’.", "Heritage", "Here since 2005, with a cleansing balm proven by 100 million sold."],
                 ["It's a secret", "Good ingredients, but you have to guess them from the color.", "Visible ingredients", "Visuals that show the raw ingredient: zero skin worries, zero harmful ingredients."]] },
      ] },
      { t: "Design Values", i: "An inclusive brand where heritage meets the new, and natural ingredients meet advanced technology.", blocks: [
        { values: [["Versatile", "Many-sided", "Varied / lively"], ["Legacy", "A legacy from the past", "Pink / sans serif"], ["Raw", "Unprocessed raw material", "Simple / true to life"]] },
      ] },
      { t: "Logo Design", blocks: [
        // held while scrolling, as Woktok: each point is drawn out from its name to the letter
        { lgp: { before: B + "before.png", mark: B + "logo-mark.svg", guide: B + "logo-guide.svg", ratio: "1081 / 340", bg: "var(--pc)", alt: ["The old Banila Co logo", "The new Banilaco logo"],
                 points: [["Symbol", "The old signature circle, set small inside the B, carries the symbol's identity forward.", "l", ["M18.8 T V9"], [[18.8, 12.6]]],
                          ["Wordmark", "A typeface between serif and sans, so **past and present live together.**", "r", ["M84 T V25"], [[84, 29]]]],
                 spec: [["Clear space", "x = 2 mm", B + "space.svg", B + "space-x.svg"], ["Minimum size", "4 mm for print, 24 px for screen", B + "min-size.svg"]] } },
      ] },
      { t: "Brand Slogan", blocks: [
        // the slogan sits on the empty wall beside the poster, as in the PDF
        // as in the PDF: the slogan set in white on the poster's own photo
        { over: true, say: [["Timeless", "Tradition,"], ["Inclusive", "Beauty"]], img: B + "poster.webp", pos: "60% 50%", alt: "The mandarin poster" },
      ] },
      { t: "Key Visual", blocks: [
        // [title, text, x%, y%] on each poster
        { big: true, callouts: [
          { img: B + "kv-1.webp", w: 615, h: 615, alt: "Green tomato close-up poster", side: "l",
            notes: [["As it is", "Close-ups show the fresh ingredient plainly.", 55, 20],
                    ["Skin concerns", "Line shapes stand for skin-type concerns.", 30, 50],
                    ["Eye flow", "Lines and type lead the eye.", 40, 84]] },
          { img: B + "kv-2.webp", w: 615, h: 615, alt: "Green tomato slice poster", side: "r",
            notes: [["Zero!", "The ingredient's shape stands for the ‘Zero’ line.", 82, 26],
                    ["Be kind to your skin", "A skin keyword set inside the ingredient hints at the solution.", 64, 52],
                    ["Clear skin", "A white background and simple layout suggest skin after use.", 86, 82]] },
        ] },
        { icons: B + "icons.svg", ratio: "941 / 132", sub: "Icon Set", alt: "Line icons: zero, mask, sunscreen, lipstick, palette, compact, mascara, brush" },
      ] },
      { t: "Brand Color", i: "Colors taken from a ripe peach and fresh fruit.", blocks: [
        // each color is a token cut from its fruit: the photo shows at the rim, the color fills the middle
        { tokens: { main: ["Banila Pink", "#FFA8AD", B + "peach.webp"],
                    rest: [["Pomegranate", "#E6506E", B + "pomegranate.webp"], ["Lemon", "#FFDC97", B + "lemon.webp"],
                           ["Green Tomato", "#C3E664", B + "tomato.webp"], ["Blueberry", "#AFACE2", B + "blueberry.webp"]] } },
      ] },
      { t: "Design Typeface", blocks: [
        // the faces sit on the sky beside the business cards, as in the PDF
        { typeon: { img: B + "card.webp", pos: "40% 60%", alt: "Banilaco business cards",
                    faces: [["Korean", "스포카 한 산스 Neo", "spoqa", null, "Spoqa's free, open-license face. Five weights fit every use, and its glyphs are everywhere online."],
                            ["English", "Neulis Sans", "", B + "neulis.png", "Flowing curves that work for both headings and body copy."]] } },
      ] },
      { t: "Applications", blocks: [
        { zoom: B + "phones.webp", ratio: "1800 / 1145", alt: "The detail page on two phones" },
        // cropped to the product, so the pair reads as one row
        { imgs: [[B + "tube.webp", "4 / 5"], [B + "package.webp", "4 / 5"]], alt: "The peeling gel tube and its box" },
        { zoom: B + "box.webp", ratio: "16 / 9", alt: "Banilaco shipping boxes" },
      ] },
    ] },
  { id: "woktok", name: "Woktok", role: "Product design", c: "#F34242", ink: "#F34242", // the brand's emotion red, by the owner's choice
    year: "2023", contribution: "100%", work: "Walk set, app, brand",
    line: ["A walking handle for city dogs, and its companion app."],
    body: null, nums: null,
    shots: [["woktok/n/billboard.webp", ""]], hero: "1922 / 1080",
    // from the 2023 portfolio PDF (_과거/웍톡.pdf), cut down to what the work needs. Nothing added that the PDF does not say
    flow: [
      { t: "Endemic Blue", i: "How can a dog in the city still get a walk with no regrets?", blocks: [
        { path: [["Pandemic", "People living alone adopted dogs and spent most of the day with them."],
                 ["Endemic", "Owners went back to their routines. Their dogs were left with the blues."],
                 ["City", "Short on time and space, most walks shrank to the same quick loop."]] },
        // kept whole: the dog's paws and the owner's wrist both show
        { open: W + "walk.webp", ratio: "2000 / 1342", alt: "A dog on a walk in the city" },
      ] },
      { t: "Overview", i: "Woktok reads a walk from the dog's side, not the owner's.", blocks: [
        // [as-is, what it means, to-be, what it means]
        { asis: [["Same place again", "The same route every day, dodging cars.", "Somewhere new", "Routes from temperament, weather, time and neighborhood."],
                 ["Why is my dog like this?", "Moody after a walk, with no way to tell why.", "Read in real time", "Sensors read the mood; the handle's light shows it."],
                 ["What was missing?", "Not revenge for a day alone. Then what?", "So that's why", "The cause on your phone, with a guide to fix it."]] },
        // the set and the app drawn in line, as in the PDF
        { svc: [["Hardware", [W + "line-handle.svg", W + "line-harness.svg"], "A leash and harness set with sensors that read the dog's mood. The LED in the handle shows it at a glance."],
                ["Software", [], "The app shows what the set picks up: route picks, walk results and the dog's mood in real time.", W + "logo.svg"]] },
      ] },
      { t: "Process", blocks: [
        // [step, what was done, pictures, how many across, their ratio]
        { proc: [["Collecting Walk Data", "Owners got a guide to log each stage of a walk, the gear and the moments that kept coming up. Walk videos came in from 4 dogs.", [W + "dogs.webp"], 1, "3 / 1"],
                 ["Video Analysis", "What happened on each walk, logged with what the dog did; repeated behaviors read for emotion.", [W + "analysis-1.webp", W + "analysis.webp"], 2, "1 / 1"],
                 ["Benchmarking", "45 products with handles measured for a good grip: their average size and shape.", [W + "bench-1.webp", W + "bench-2.webp", W + "bench-3.webp"], 3, "3 / 4"],
                 ["Sketch & Soft Mockup", "Sketches and soft mockups, to find a shape that feels right in the hand.", [1, 2, 3, 4, 5, 6, 7, 8].map((n) => W + "sk-" + n + ".webp"), 4, "4 / 3"]] },
      ] },
      { g: "Product", t: "Walk Set", i: "A leash handle and harness that measure the dog's state in real time.", blocks: [
        // the product fills the screen; its notes sit on the plain grey around it
        { full: true, mode: "on", tone: "dark", callouts: [
          { img: W + "detail.webp", w: 2000, h: 1124, alt: "The Woktok leash handle and harness", side: "l",
            notes: [["LED indicator", "The light changes with the dog's mood, in real time.", 35.5, 36, null, "l", 24],
                    ["Material", "Recycled plastic, its texture left as it formed.", 29, 71, null, "l", 20],
                    ["Sensor", "Camera, heart rate, GPS and gyro sensors read the dog and send the data to the phone.", 70, 59, null, "r", 84]] },
        ] },
      ] },
      { g: "Product", t: "Emotion Colors", i: "Every color is a mood. The handle's LED and the app's motion graphics change with how the dog feels.", blocks: [
        // as the Citi colors: the lit handles fill the screen, each mood named above its own handle with its chip
        { full: true, mode: "on", tone: "dark", callouts: [
          { img: W + "colors.webp", w: 2000, h: 1361, alt: "The handle lit in six mood colors", side: "l",
            notes: [["Scared", "", 15.5, 44, ["#B887BC", "#B887BC"], "t", 4], ["Aggressive", "", 27, 38, ["#F34242", "#F34242"], "t", 4],
                    ["Delighted", "", 39.5, 37, ["#F9D066", "#F9D066"], "t", 4], ["Nervous", "", 50.5, 37, ["#FBC1BD", "#FBC1BD"], "t", 4],
                    ["Stable", "", 62, 35, ["#5BA776", "#5BA776"], "t", 4], ["Gloomy", "", 72, 41, ["#67AADF", "#67AADF"], "t", 4]] },
        ] },
      ] },
      { g: "App", t: "Woktok App", i: "Records and reads every walk, and gets to know each dog.", blocks: [
        // held while scrolling: each note points out in turn; the green dashes show where a tap leads.
        // screens: [file, name, notes [title, text, x%, y% on the phone, step], links [x%, y%, step]]
        { appf: { link: "#F9D066", screens: [
          [W + "app-1.svg", "Home", [["Route picks", "The best route from time, weather and the dog's temperament.", 81, 24, 0],
                                     ["Choose a dog", "Each dog's walks kept apart.", 87, 68, 1],
                                     ["Battery", "The handle's charge at a glance.", 81, 85, 2]], [[94, 50, 3]]],
          // the same screen in every mood, one per stretch of scroll: [file, mood, step]
          [W + "app-2.svg", "Walk Monitoring", [["Mood monitoring", "What the dog feels on the walk, why, and what to do. The screen takes on the mood.", 88, 19, 4]], [[72, 88, 10]],
            [[W + "mood-nervous.webp", "Nervous", 4], [W + "mood-delighted.webp", "Delighted", 5], [W + "mood-relaxed.webp", "Stable", 6],
             [W + "mood-aggressive.webp", "Aggressive", 7], [W + "mood-scared.webp", "Scared", 8], [W + "mood-gloomy.webp", "Gloomy", 9]]],
          [W + "app-3.svg", "Today's Journal", [["One-line review", "The feeling to watch, and why.", 89, 19, 11],
                                                ["Mood log", "Mood along the route in color: the places it likes and the ones it doesn't.", 89, 73, 12]]]] } },
        { appf: { link: "#F9D066", screens: [
          [W + "app-4.svg", "Smart Analysis", [["Walk temperament", "Read from every walk so far.", 90, 33, 0],
                                               ["Route picks", "By weather and time, from other walkers nearby.", 90, 68, 1]], [[93, 18, 2]]],
          [W + "app-5.svg", "Recent Activity", [["Walk totals", "By week, month, year or all time.", 87, 28, 3],
                                                ["Recent walks", "Every walk in order; tap one for that day's journal.", 87, 51, 4]]],
          [W + "app-6.svg", "My Page", [["My pups", "Each dog's profile and walk temperament.", 89, 73, 5]]]] } },
        { imgs: [[W + "app-hand.webp", "3 / 2"], [W + "watch.webp", "3 / 2"]], alt: "The app on a phone and a watch" },
      ] },
      { g: "Brand", t: "Logo Design", i: "‘A walk to talk.’ A dog's round, cheerful face and bouncy step, set in the letters.", blocks: [
        // held while scrolling: each point of the logo is drawn out in turn, as in the PDF.
        // points: [title, text, side, dashed lines (in % of the logo), dotted rings]
        { lgp: { mark: W + "logo.svg", ratio: "1230 / 266", alt: "The Woktok logo",
                 points: [["Points", "Two neat paws in the W; a dog's face in the T.", "l", ["M-4 T V81 H0", "M26 T H61 V25"], [[0, 81], [61, 25]]],
                          ["Round", "Round ends for a soft look; a bouncy step in the bend of the K.", "r", [], [[87.6, 2], [95.9, 25.6]]]],
                 spec: [["Clear space", "x = 4 mm", W + "space.svg", W + "space-x.svg"], ["Minimum size", "4 mm for print, 24 px for screen", W + "min-size.svg"]] } },
      ] },
      { g: "Brand", t: "Brand Slogan", i: "Walks that help you understand your dog, for a happier life together.", blocks: [
        { open: W + "slogan.webp", ratio: "1920 / 528", alt: "a walk to talk!" },
      ] },
      { g: "Brand", t: "Typeface", blocks: [
        { typeon: { img: W + "stationery.webp", pos: "45% 50%", alt: "Woktok stationery set in SUIT",
                    faces: [["Korean & English", "SUIT", "suit", null, "Titles in ExtraBold at 110% leading; text in Medium at 155%."]] } },
      ] },
      { g: "Brand", t: "Togu, the Mascot", i: "A black Jindo, six months old and still a little timid. Loves quiet walks with its owner.", blocks: [
        { icons: W + "togu.svg", ratio: "730 / 319", alt: "Togu chasing a ball" },
      ] },
      { t: "Applications", i: "The walk set and goods were made and shown at an exhibition. Visitors tried the prototype and the app; stickers and keyrings sold through funding during the show.", blocks: [
        // three at one size; the exhibition table kept whole
        { imgs: [[W + "tote.webp", "1 / 1"], [W + "keyrings.webp", "1 / 1"], [W + "display.webp", "1135 / 1046"]], alt: "The Woktok tote bag, Togu keyrings and the exhibition table" },
      ] },
    ] },
];
