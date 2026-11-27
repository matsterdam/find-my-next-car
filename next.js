/* Find my next car: matching. Pure JS, no DOM. Needs the Short List engine (CARS, describe) and the review data. */
(function (root) {
  'use strict';

  // Launched in the Netherlands since mid 2025 (new model or new generation). Same definition as the quiz data.
  const RECENT = ['raval','pandaev','twingo','r4','ioniq3','b05','b10','ix3','ev2','chrplus','tayron','tayron7','cla',
    'omoda5hev','omoda5ev','omoda9','jaecoo5','jaecoo7','jaecoo8','jaecoo8s7','s05','s07','e2','e5','starray','tiggo4','tiggo7','tiggo8',
    'atto2dmi','dolphing','atto3evo','seal6','seal6t','mgs5','mgs6','mgs9','im5','im6','mghs','mg4urban','b03x','b10r','p7plus','zeekr7x','zeekr7gt',
    'lynk08','ev4','k4','seltos','ioniq9','epiq','idpolo','c5hev','c5ev','c5phev','urbancruiser','bz4xt','evitara','cx6e','cx5','mazda6e',
    'es90','ex60','glc','clasb','gla','i3','a390','gv60','gv70','g80','compasshev','compassphev','compassev','leaf','micra','actyon'];

  // One independent review per model: Dutch-language, published by a title or consumer body that is not the manufacturer.
  // Each URL was returned by a search for the model and (for Autozine B05) opened. Models without an entry are not offered yet.
  const REVIEWS = {
    raval:   { url: 'https://www.autoreview.nl/nieuws/id/37228/test-cupra-raval', source: 'AutoReview' },
    pandaev: { url: 'https://www.test-aankoop.be/mobiliteit/auto-s/vergelijker-elektrische-auto-plug-in-hybride/fiat-grande-panda-electric/67/121501', source: 'Test-Aankoop (consumer organisation)' },
    b05:     { url: 'https://www.autozine.nl/leapmotor/b05/autotest', source: 'Autozine' },
    b10:     { url: 'https://www.autozine.nl/leapmotor/b10/autotest', source: 'Autozine' },
    chrplus: { url: 'https://www.autozine.nl/toyota/c-hr-plus/autotest', source: 'Autozine' },
    ev2:     { url: 'https://topgear.nl/autotest/kia-ev2-standard-range-plus-advanced-2026-review/', source: 'Top Gear NL' },
    ev4:     { url: 'https://www.autoblog.nl/nieuws/kia-ev4-gewaagd-uiterlijk-maakt-het-een-gedurfde-keuze-test-7188897', source: 'Autoblog' },
    cla:     { url: 'https://topgear.nl/autotest/mercedes-cla-220-4matic-amg-line-2025-review/', source: 'Top Gear NL' },
    e5:      { url: 'https://www.autozine.nl/geely/e5/autotest', source: 'Autozine' },
    zeekr7x: { url: 'https://www.autozine.nl/zeekr/7x/autotest', source: 'Autozine' },
    mgs5:    { url: 'https://www.autozine.nl/mg/s5/autotest', source: 'Autozine' },
    mgs6:    { url: 'https://www.autozine.nl/mg/s6/autotest', source: 'Autozine' },
    cx6e:    { url: 'https://www.autozine.nl/mazda/cx-6e/autotest', source: 'Autozine' },
    ioniq9: { url: 'https://www.whatcar.com/hyundai/ioniq-9/estate/review/n27484', source: 'What Car?' },
    c5hev: { url: 'https://www.autoexpress.co.uk/citroen/c5-aircross/368505/new-citroen-c5-aircross-hybrid-145-review-suv-puts-passengers-first', source: 'Auto Express' },
    c5ev: { url: 'https://www.honestjohn.co.uk/citroen/e-c5-aircross', source: 'Honest John' },
    c5phev: { url: 'https://www.rac.co.uk/drive/car-reviews/citroen/c5/c5-aircross/', source: 'RAC Drive', how: 'covers the C5 Aircross range' },
    seltos: { url: 'https://www.autoexpress.co.uk/kia/seltos/369624/new-kia-seltos-2026-review-ticks-all-right-suv-boxes', source: 'Auto Express' },
    bz4xt: { url: 'https://www.whatcar.com/toyota/bz4x-touring/estate/review/n29019', source: 'What Car?' },
    cx5: { url: 'https://www.autoexpress.co.uk/mazda/cx-5/357250/new-mazda-cx-5-2026-review-spacious-suv-step-wrong-direction', source: 'Auto Express' },
    epiq: { url: 'https://www.whatcar.com/skoda/epiq/estate/review/n29034', source: 'What Car?' },
    idpolo: { url: 'https://www.autoexpress.co.uk/volkswagen/polo/368526/new-volkswagen-id-polo-2026-review-seriously-impressive-small-ev', source: 'Auto Express' },
    mghs: { url: 'https://www.carexpert.com.au/car-reviews/2026-mg-hs-hybrid-review', source: 'CarExpert (Australia)' },
    im5: { url: 'https://www.autoexpress.co.uk/mg/367423/mg-im5-review', source: 'Auto Express' },
    compasshev: { url: 'https://www.whatcar.com/jeep/compass/4x4/12-e-hybrid-first-edition-5dr-dct/107960', source: 'What Car?', how: 'tests the hybrid' },
    compassphev: { url: 'https://www.whatcar.com/jeep/compass/4x4/12-e-hybrid-first-edition-5dr-dct/107960', source: 'What Car?', how: 'tests the hybrid, not this version' },
    compassev: { url: 'https://www.whatcar.com/jeep/compass/4x4/12-e-hybrid-first-edition-5dr-dct/107960', source: 'What Car?', how: 'tests the hybrid, not this version' },
    gv60: { url: 'https://www.autoexpress.co.uk/genesis/gv60/360018/genesis-gv60-review', source: 'Auto Express' },
    glc: { url: 'https://www.autoexpress.co.uk/mercedes/glc/369219/new-mercedes-glc-electric-2026-review-refined-and-packed-tech', source: 'Auto Express' },
    tiggo8: { url: 'https://www.electrifying.com/reviews/chery-reviews/tiggo-8/review', source: 'Electrifying' },
    s07: { url: 'https://www.autoexpress.co.uk/changan/367836/new-changan-deepal-s07-2025-review-smart-dull-chinese-suv', source: 'Auto Express' },
    s05: { url: 'https://www.electrive.net/2025/09/21/erste-fahrt-im-deepal-s05-dieser-newcomer-aus-china-macht-sehr-viel-richtig/', source: 'electrive', how: 'first drive, in German' },
    omoda9: { url: 'https://www.carmagazine.co.uk/car-reviews/omoda/9-suv/', source: 'CAR Magazine' },
    omoda5hev: { url: 'https://www.autoexpress.co.uk/omoda/5/362855/new-omoda-5-prototype-review-establishment-beating-suv', source: 'Auto Express', how: 'prototype drive' },
    omoda5ev: { url: 'https://www.autoexpress.co.uk/omoda/5/362855/new-omoda-5-prototype-review-establishment-beating-suv', source: 'Auto Express', how: 'prototype drive of the Omoda 5' },
    lynk08: { url: 'https://www.anwb.nl/auto/tests/auto-reviews/detail/cbfc56d55eda333e8ce565db5e54f9ff', source: 'ANWB' },
    twingo: { url: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/renault/renault-twingo-electric-test/', source: 'ADAC (German motoring club)', how: 'in German' },
    r4: { url: 'https://www.autoexpress.co.uk/renault/4/369497/long-term-test-renault-4-e-tech-iconic', source: 'Auto Express', how: 'long-term test' },
    ioniq3: { url: 'https://de.motor1.com/news/811009/hyundai-ioniq3-61kwh-test/', source: 'Motor1 Germany', how: 'in German' },
    ix3: { url: 'https://www.autozeitung.de/bmw-ix3-fahrbericht-video-209817.html', source: 'Auto Zeitung', how: 'in German' },
    tayron: { url: 'https://www.weekend.at/motor/test-der-tayron-ist-mister-big', source: 'Weekend (Austria)', how: 'in German' },
    tayron7: { url: 'https://www.weekend.at/motor/test-der-tayron-ist-mister-big', source: 'Weekend (Austria)', how: 'in German; tests the standard Tayron' },
    jaecoo7: { url: 'https://www.auto-motor-und-sport.de/marken-modelle/jaecoo/7/tests/', source: 'Auto Motor und Sport', how: 'in German' },
    starray: { url: 'https://www.autoexpress.co.uk/geely/starray/368720/new-geely-starray-2026-review-notably-cheap-and-reasonably-cheerful', source: 'Auto Express' },
    seal6: { url: 'https://www.autoexpress.co.uk/byd/367696/new-byd-seal-6-2025-review-talented-estate-should-have-bmw-worried', source: 'Auto Express' },
    seal6t: { url: 'https://www.autoexpress.co.uk/byd/367696/new-byd-seal-6-2025-review-talented-estate-should-have-bmw-worried', source: 'Auto Express', how: 'tests the Seal 6 estate' },
    atto2dmi: { url: 'https://www.automobile.at/magazin/786839', source: 'Automobile.at', how: 'in German' },
    atto3evo: { url: 'https://autotijd.be/rijtesten/byd/atto-3-evo/test-byd-atto-3-evo-veel-meer-dan-een-facelift-2026', source: 'Autotijd (Belgium)' },
    b03x: { url: 'https://www.autocar.co.uk/node/365720', source: 'Autocar', how: 'first drive' },
    b10r: { url: 'https://www.autotrader.co.uk/content/car-reviews/leapmotor-b10-hybrid-ev-review-2026', source: 'Autotrader' },
    p7plus: { url: 'https://www.autohaus.de/nachrichten/autohandel/xpeng-p7-im-test-der-leise-riese-3909833', source: 'Autohaus', how: 'in German' },
    zeekr7gt: { url: 'https://www.autozeitung.de/zeekr-7gt-2026-fahrbericht-300998.html', source: 'Auto Zeitung', how: 'in German' },
    k4: { url: 'https://de.motor1.com/photos/919420/kia-k4-2026-im-test/', source: 'Motor1 Germany', how: 'in German' },
    urbancruiser: { url: 'https://www.autotrader.co.uk/content/car-reviews/toyota-urban-cruiser-review-2025', source: 'Autotrader' },
    evitara: { url: 'https://www.autozine.co.uk/suzuki/e-vitara/61-kwh-4wd/review', source: 'Autozine (English edition)' },
    mazda6e: { url: 'https://www.autoexpress.co.uk/road-tests/367331/new-mazda-6e-2025-review-fine-family-ev-theres-catch', source: 'Auto Express' },
    es90: { url: 'https://www.auto.it/foto/anteprime/primo-test/2026/03/09-8668095/volvo_es90_il_test', source: 'Auto.it', how: 'first test, in Italian' },
    leaf: { url: 'https://topgear.nl/nissan/leaf/autotests/', source: 'Top Gear NL', how: 'test overview, may include older Leaf generations' },
    micra: { url: 'https://topgear.nl/nissan/micra/autotests/', source: 'Top Gear NL', how: 'test overview, may include older Micra generations' }
  };

  // Brand home pages, used only when no model page is on file. Geely, Chery and Alpine are the global sites: a Dutch site was not found.
  const BRAND_HOME = { mg: 'https://www.mgmotor.nl', xpeng: 'https://www.xpeng.com/nl', 'lynk co': 'https://www.lynkco.com', geely: 'https://www.geely.com', chery: 'https://www.cheryinternational.com', alpine: 'https://www.alpinecars.com' };
  const PT_RANK = { ice: 0, mhev: 1, hev: 2, phev: 3, bev: 4 };
  const plain = s => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ALIAS = { vw: 'volkswagen', mercedes: 'mercedes benz', 'mercedes benz': 'mercedes benz', citroen: 'citroen' };
  function brandKey(s) { let k = plain(s); k = ALIAS[k] || k; return k.replace(/ (corporation|motors|group)$/, ''); }
  function sameBrand(a, b) {
    const x = brandKey(a), y = brandKey(b);
    return !!x && !!y && (x === y || x.indexOf(y + ' ') === 0 || y.indexOf(x + ' ') === 0);
  }
  const eur = n => '€' + Math.round(n).toLocaleString('nl-NL');
  const PT_PHRASE = { bev: 'fully electric', phev: 'plug-in hybrid', hev: 'full hybrid', mhev: 'mild hybrid', ice: 'petrol or diesel' };
  const SIZE_PRICE = [0, 20000, 26000, 34000, 44000, 58000];
  // How well a body shape replaces another (1 = same). Our body classes: city, hatch, suv, estate, sedan, mpv.
  const BODY_FIT = {
    city: { city: 1, hatch: .8, suv: .5, estate: .2, sedan: .2, mpv: .3 },
    hatch: { city: .7, hatch: 1, suv: .7, estate: .6, sedan: .5, mpv: .4 },
    suv: { city: .3, hatch: .5, suv: 1, estate: .6, sedan: .3, mpv: .6 },
    estate: { city: .2, hatch: .5, suv: .7, estate: 1, sedan: .5, mpv: .6 },
    sedan: { city: .2, hatch: .5, suv: .5, estate: .8, sedan: 1, mpv: .3 },
    mpv: { city: .2, hatch: .3, suv: .7, estate: .6, sedan: .2, mpv: 1 }
  };
  const bodyFit = (own, car) => (own && BODY_FIT[own] && BODY_FIT[own][car]) || .5;

  // Measured gains against the owner's car, only from facts we hold on both sides. hasGain says whether the car is a real step.
  function gainsFor(own, c, age) {
    const out = [];
    let has = false;
    const ownRank = own.pt && own.pt in PT_RANK ? PT_RANK[own.pt] : null;
    if (ownRank != null && PT_RANK[c.pt] > ownRank) { has = true; out.push({ k: 'Powertrain', t: (PT_PHRASE[own.pt] || own.pt) + ' → ' + (PT_PHRASE[c.pt] || c.pt) }); }
    if (own.range && (c.pt === 'bev' || c.pt === 'phev') && (own.pt === 'bev' || own.pt === 'phev') && c.range && c.range >= own.range * 1.1) {
      has = true; out.push({ k: 'Electric range', t: own.range + ' → ' + c.range + ' km (' + (c.range > own.range ? '+' : '') + (c.range - own.range) + ' km)' });
    }
    if (own.co2 && own.co2 > 0 && c.pt === 'bev') { has = true; out.push({ k: 'Exhaust CO₂', t: own.co2 + ' g/km → none' }); }
    if (own.power && c.drive > own.power) { has = true; out.push({ k: 'Power', t: 'level ' + own.power + ' → ' + c.drive + ' of 5 on our scale' }); }
    if (c.ncap >= 5 && c.ncapYr && own.year && c.ncapYr - own.year >= 4) { has = true; out.push({ k: 'Safety', t: 'Euro NCAP 5 stars (' + c.ncapYr + ' test, tougher rules than for a ' + own.year + ' car)' }); }
    if (age != null && age >= 8 && c.tech >= 4) { has = true; out.push({ k: 'Technology', t: 'our rating ' + c.tech + ' of 5, for a ' + age + '-year-old car' }); }
    if (own.listPrice) {
      const d = c.price - own.listPrice, pct = Math.round(d / own.listPrice * 100);
      out.push({ k: 'List price', t: eur(c.price) + ' vs about ' + eur(own.listPrice) + ' for yours when new (' + (d >= 0 ? '+' : '') + pct + '%)' });
    }
    return { list: out, hasGain: has };
  }

  // own = { make, model, pt, seats, size, power, year, listPrice, body, range, co2 }.
  // opts: { prefs: { budget: same|u30|u45|u60|any, charge: yes|no|unsure, use: city|family|long }, exclude: [ids] }
  function pickNext(own, cars, urls, opts) {
    opts = opts || {};
    const pf = opts.prefs || {};
    const exclude = new Set(opts.exclude || []);
    const recent = new Set(opts.recent || RECENT);
    const pool = cars.filter(c => recent.has(c.id) && !exclude.has(c.id) && !sameBrand(c.brand, own.make));
    const ownRank = own.pt && own.pt in PT_RANK ? PT_RANK[own.pt] : 1;
    const age = own.year ? Math.max(0, (opts.thisYear || 2026) - own.year) : null;
    const base = own.listPrice ? clamp(own.listPrice * 1.2, 16000, 80000) : (own.size ? SIZE_PRICE[own.size] : 34000);
    const target = { u30: 27000, u45: 40000, u60: 55000 }[pf.budget] || base;
    const cap = { u30: 33000, u45: 48000, u60: 65000 }[pf.budget] || null;
    const wPrice = pf.budget === 'any' ? .4 : 1.5;
    const scored = [];
    pool.forEach(c => {
      let fits = true;
      if (own.seats && c.seats < Math.min(own.seats, 7)) fits = false;
      if (own.size && Math.abs(c.size - own.size) > 1) fits = false;
      if (cap && c.price > cap) fits = false;
      const d = PT_RANK[c.pt] - ownRank;
      let pt = d === 1 ? 1 : d === 2 ? .92 : d === 3 || d === 4 ? .8 : d === 0 ? .5 : .1;
      // no home charging: plugs cost convenience, a self-charging hybrid does not
      if (pf.charge === 'no') { if (c.pt === 'bev') pt *= .35; else if (c.pt === 'phev') pt *= .5; else if (c.pt === 'hev') pt = Math.max(pt, .9); }
      else if (pf.charge === 'unsure') { if (c.pt === 'bev') pt *= .7; else if (c.pt === 'phev') pt *= .8; }
      const size = own.size ? [1, .75, .3][Math.abs(c.size - own.size)] || 0 : .6;
      const seats = own.seats ? (c.seats === own.seats ? 1 : c.seats > own.seats ? .8 : 0) : .6;
      const price = Math.exp(-Math.abs(Math.log(c.price / target)) * 1.6);
      const tech = c.tech / 5, safety = c.ncap ? (c.ncap >= 5 ? 1 : .6) : .4;
      const body = own.body ? bodyFit(own.body, c.body) : .6;
      const wTech = age != null && age >= 8 ? 1.0 : .6;
      let use = 0;
      if (pf.use === 'long') use = .8 * (c.pt === 'bev' ? clamp((c.range || 0) / 700, 0, 1) : .8) + .5 * (c.comfort || 3) / 5;
      else if (pf.use === 'family') use = 1.0 * (c.space || 3) / 5;
      else if (pf.use === 'city') use = .8 * (c.size <= 2 ? 1 : c.size === 3 ? .5 : .1);
      const g = gainsFor(own, c, age);
      const score = 2.2 * pt + 1.3 * size + .9 * seats + wPrice * price + wTech * tech + .4 * safety + 1.3 * body + use + (own.power ? .4 * (1 - Math.abs(c.drive - own.power) / 4) : 0);
      scored.push({ car: c, score, fits, d, gains: g.list, hasGain: g.hasGain, parts: { pt, size, seats, price, tech, safety, body } });
    });
    scored.sort((a, b) => b.score - a.score);
    // Cars with a measurable gain come first, then cars that fit but show none (never a powertrain step down before a level
    // one), then cars that do not fit. Within each group the score decides.
    const t1 = scored.filter(s => s.fits && s.hasGain && s.d >= 0);
    const t2 = scored.filter(s => s.fits && !s.hasGain && s.d >= 0);
    const t3 = scored.filter(s => s.fits && s.d < 0);
    const t4 = scored.filter(s => !s.fits);
    const ranked = t1.concat(t2, t3, t4);
    const picks = [];
    const brands = new Set();
    for (const s of ranked) {
      if (picks.length === 3) break;
      if (brands.has(brandKey(s.car.brand))) continue;
      // third pick: prefer a different powertrain from the first two when it scores within 12% of the best alternative
      if (picks.length === 2) {
        const alt = ranked.filter(x => !brands.has(brandKey(x.car.brand)));
        const best = alt[0];
        const diff = alt.find(x => x.d >= 0 && picks.every(p => p.car.pt !== x.car.pt) && x.score >= best.score * .88);
        if (diff) { picks.push(diff); brands.add(brandKey(diff.car.brand)); break; }
      }
      picks.push(s); brands.add(brandKey(s.car.brand));
    }
    // One pick must share the owner's powertrain. Petrol and diesel count as the same family as mild hybrid, because the
    // register reports a 48-volt mild hybrid as plain petrol and no newer car without any hybrid system is on file.
    const fam = pt => (pt === 'ice' || pt === 'mhev') ? 'ice' : pt;
    let sameNote = null;
    if (own.pt && picks.length) {
      const isSame = x => fam(x.car.pt) === fam(own.pt);
      if (!picks.some(isSame)) {
        const free = x => isSame(x) && !picks.some(p => p.car.id === x.car.id) && !picks.slice(0, 2).some(p => brandKey(p.car.brand) === brandKey(x.car.brand));
        const cand = ranked.filter(free)[0] || scored.filter(free)[0] || scored.filter(x => isSame(x) && !picks.some(p => p.car.id === x.car.id))[0];
        if (cand) { picks[picks.length - 1] = cand; }
        else sameNote = 'none';
      }
      picks.forEach(x => { x.same = isSame(x); });
      if (own.pt === 'ice' && picks.some(x => x.same && x.car.pt === 'mhev')) sameNote = 'mild';
    }
    const relaxed = picks.some(p => !p.fits);
    picks.forEach(p => { p.sidestep = !p.hasGain; });
    return { picks, relaxed, poolSize: pool.length, target, age, sameNote, capped: !!cap };
  }

  // Plain-English reasons, only from facts we hold.
  function reasons(own, s, ownName) {
    const c = s.car, out = [];
    const ptTxt = c.pt === 'bev' ? ('Fully electric, about ' + c.range + ' km on the WLTP test' + (c.pc === 'i' ? ' (entry battery)' : ''))
      : c.pt === 'phev' ? ('Plug-in hybrid' + (c.range ? ', about ' + c.range + ' km on electric power alone' : ''))
      : c.pt === 'hev' ? 'Full hybrid: it charges itself, no plug needed' : c.pt === 'mhev' ? 'Mild hybrid with an automatic gearbox' : 'Petrol or diesel';
    if (own.pt && c.pt !== own.pt) out.push(ptTxt + ', a step on from your ' + (PT_PHRASE[own.pt] || 'current') + ' car');
    else out.push(ptTxt + ', and a much newer take on the same idea');
    if (own.size) {
      const dz = c.size - own.size;
      out.push(dz === 0 ? 'About the same size as your ' + ownName + ', with ' + c.seats + ' seats' : dz > 0 ? 'A little bigger than your ' + ownName + ', with ' + c.seats + ' seats' : 'A little smaller outside than your ' + ownName + ', with ' + c.seats + ' seats');
    } else out.push(c.seats + ' seats');
    if (c.ncap && !(own.year && c.ncapYr && c.ncap >= 5 && c.ncapYr - own.year >= 4)) out.push('Euro NCAP ' + c.ncap + ' stars' + (c.ncapYr ? ' (' + c.ncapYr + ' test)' : ''));
    else if (c.tech >= 4) out.push('Strong on technology (our rating ' + c.tech + ' out of 5)');
    return out.slice(0, 3);
  }

  // RDW inrichting (body) -> our body class. RDW does not separate SUVs from other estates, so this is a best guess.
  const INRICHTING = { hatchback: 'hatch', stationwagen: 'estate', sedan: 'sedan', mpv: 'mpv', 'multi purpose vehicle': 'mpv', coupe: 'sedan', cabriolet: 'hatch' };
  function ownBodyFrom(engine, profile, inrichting) {
    const hit = engine.CARS.find(c => sameBrand(c.brand, profile.make) && (() => {
      const a = plain(c.model), b = plain(profile.model); return a && b && (a === b || a.indexOf(b + ' ') === 0 || b.indexOf(a + ' ') === 0);
    })());
    if (hit) return hit.body;
    return INRICHTING[plain(inrichting)] || null;
  }
  // Extra figures from the fuel dataset. Field names are matched by pattern and every value is range-checked, so a renamed
  // or missing field only means the figure is left out. Not yet confirmed against a live response.
  function extraFuel(rows) {
    const out = { range: null, co2: null };
    if (!Array.isArray(rows)) return out;
    const n = v => { const x = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isFinite(x) ? x : null; };
    rows.forEach(row => {
      if (!row || typeof row !== 'object') return;
      Object.keys(row).forEach(k => {
        const key = k.toLowerCase(), v = n(row[k]);
        if (v == null) return;
        if (/actie_?radius/.test(key) && !/stad|city/.test(key) && v >= 20 && v <= 1200) out.range = Math.max(out.range || 0, Math.round(v));
        if (/^co2_uitstoot_gecombineerd/.test(key) && v > 0 && v < 600 && out.co2 == null) out.co2 = Math.round(v);
      });
    });
    return out;
  }
  // Look a plate up in the visitor's browser (RDW open data). Resolves { status, profile?, own? }.
  function loadPlate(engine, input, fetchFn, ms) {
    const plate = engine.normalisePlate(input);
    if (!plate) return Promise.resolve({ status: 'invalid' });
    const f = fetchFn || (typeof fetch === 'function' ? fetch : null);
    if (!f) return Promise.resolve({ status: 'error' });
    const get = url => {
      const ctl = typeof AbortController === 'function' ? new AbortController() : null;
      const timer = ctl ? setTimeout(() => ctl.abort(), ms || 10000) : null;
      const done = () => { if (timer) clearTimeout(timer); };
      return Promise.resolve().then(() => f(url, { signal: ctl ? ctl.signal : undefined, referrerPolicy: 'no-referrer', cache: 'no-store', credentials: 'omit' }))
        .then(r => { if (!r || !r.ok) throw new Error('http'); return r.json(); })
        .then(j => { if (!Array.isArray(j)) throw new Error('shape'); done(); return j; }, e => { done(); throw e; });
    };
    const q = '?kenteken=' + encodeURIComponent(plate);
    const base = 'https://opendata.rdw.nl/resource/';
    return Promise.all([get(base + 'm9d7-ebf2.json' + q + '&$limit=1'), get(base + '8ys7-d773.json' + q).catch(() => null)]).then(r => {
      const res = engine.plateProfile(r[0], r[1]);
      if (res.status !== 'ok') return res;
      const row = r[0][0] || {};
      const d = String(row.datum_eerste_toelating || ''), year = /^\d{8}$/.test(d) ? parseInt(d.slice(0, 4), 10) : null;
      const lp = parseFloat(String(row.catalogusprijs || '').replace(',', '.'));
      const p = res.profile;
      const x = extraFuel(r[1]);
      const own = { make: p.make, model: p.model, pt: p.pt, seats: p.seats, size: p.size, power: p.power, year, kw: p.kw, massKg: p.massKg,
        listPrice: isFinite(lp) && lp >= 3000 && lp <= 400000 ? lp : null, body: ownBodyFrom(engine, p, row.inrichting), fuel: p.fuel,
        range: (p.pt === 'bev' || p.pt === 'phev') ? x.range : null, co2: x.co2 };
      return { status: 'ok', profile: p, own };
    }, () => ({ status: 'error' }));
  }

  const API = { BRAND_HOME, gainsFor, extraFuel, loadPlate, ownBodyFrom, RECENT, REVIEWS, pickNext, reasons, sameBrand, brandKey, eur, PT_PHRASE };
  root.NextCar = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
