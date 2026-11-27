const S=require('./engine.js'), N=require('./next.js');
const urls={}; S.CARS.forEach(c=>{const d=S.describe([c.id],'cash'); urls[c.id]=d&&d[0]&&d[0].modelUrl});
const own=[
 {n:'2013 VW Golf petrol',make:'Volkswagen',model:'Golf',pt:'ice',seats:5,size:3,power:3,year:2013,listPrice:24000},
 {n:'2016 Toyota Yaris hybrid',make:'Toyota',model:'Yaris',pt:'hev',seats:5,size:2,power:2,year:2016,listPrice:21000},
 {n:'2018 Kia Sportage diesel',make:'Kia',model:'Sportage',pt:'ice',seats:5,size:4,power:3,year:2018,listPrice:36000},
 {n:'2015 Renault Twingo',make:'Renault',model:'Twingo',pt:'ice',seats:4,size:1,power:1,year:2015,listPrice:12000},
 {n:'2019 Tesla Model 3',make:'Tesla',model:'Model 3',pt:'bev',seats:5,size:3,power:5,year:2019,listPrice:50000},
 {n:'2017 Ford S-Max 7 seats',make:'Ford',model:'S-Max',pt:'ice',seats:7,size:5,power:3,year:2017,listPrice:42000},
 {n:'2020 BMW 3 Series phev',make:'BMW',model:'3 Serie',pt:'phev',seats:5,size:4,power:4,year:2020,listPrice:55000},
 {n:'2012 Skoda Octavia estate',make:'Škoda',model:'Octavia',pt:'ice',seats:5,size:4,power:3,year:2012,listPrice:25000},
 {n:'unknown profile',make:'Opel',model:'Corsa',pt:null,seats:null,size:null,power:null,year:null,listPrice:null},
];
for(const o of own){const r=N.pickNext(o,S.CARS,urls);console.log('\n'+o.n,'| pool',r.poolSize,'relaxed',r.relaxed,'target',Math.round(r.target));
 r.picks.forEach((p,i)=>console.log(' ',i+1,p.car.brand,p.car.model,p.car.pt,'sz'+p.car.size,p.car.seats+'s',p.car.price,'score',p.score.toFixed(2),p.fits?'':'(relaxed)'));
 if(r.picks.length) console.log('   reasons:',N.reasons(o,r.picks[0],o.make+' '+o.model).join(' | '));
 if(r.picks.some(p=>N.sameBrand(p.car.brand,o.make))) console.log('  !! SAME BRAND');
 if(!r.picks.every(p=>urls[p.car.id]&&N.REVIEWS[p.car.id])) console.log('  !! missing link');
}

console.log('\n=== gains, prefs, swap ===');
const show=(label,o,opts)=>{const r=N.pickNext(o,S.CARS,urls,opts);console.log('\n'+label,'| relaxed',r.relaxed,'sameNote',r.sameNote);
 r.picks.forEach((p,i)=>console.log(' ',i+1,p.car.brand,p.car.model,p.car.pt,p.car.price,p.same?'[same pt]':'', '| gains:',p.gains.map(g=>g.k+': '+g.t).join(' ; ')));return r;};
const golf={make:'Volkswagen',model:'Golf',pt:'ice',seats:5,size:3,power:3,year:2013,listPrice:24000,body:'hatch',co2:125,kw:90};
const m3={make:'Tesla',model:'Model 3',pt:'bev',seats:5,size:3,power:5,year:2019,listPrice:50000,body:'sedan',range:560,kw:211};
const base=show('Golf default',golf);
show('Golf, no home charging',golf,{prefs:{charge:'no'}});
show('Golf, budget u30',golf,{prefs:{budget:'u30'}});
show('Golf, long trips',golf,{prefs:{use:'long'}});
show('Golf, city',golf,{prefs:{use:'city'}});
show('Golf, skip first pick',golf,{exclude:[base.picks[0].car.id]});
show('Golf, skip all three',golf,{exclude:base.picks.map(p=>p.car.id)});
show('Model 3 default',m3);
show('Model 3, u45',m3,{prefs:{budget:'u45'}});
show('Model 3, u30 (tight)',m3,{prefs:{budget:'u30'}});
// extraFuel guess
console.log('\nextraFuel:',JSON.stringify(N.extraFuel([{brandstof_omschrijving:'Elektriciteit',actie_radius_enkel_elektrisch_wltp:'412',actie_radius_enkel_elektrisch_stad_wltp:'600',co2_uitstoot_gecombineerd:'0'},{co2_uitstoot_gecombineerd:'131'}])),JSON.stringify(N.extraFuel(null)),JSON.stringify(N.extraFuel([{x:'1'}])));
