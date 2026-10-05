// Add your watches here. Put photos in public/images/products/<id>.jpg (e.g. chronova-001.jpg)
const B=[
['Meridian Classic','Men','Classic',12500,15000],['Atlas Chronograph','Men','Chronograph',24999,0],['Regent Formal','Men','Formal',9999,12999],
['Vanguard Sport','Men','Sports',7499,0],['Orion Automatic','Men','Luxury',34999,0],['Nova Quartz','Men','Classic',5499,6999],
['Heritage Leather','Men','Classic',8499,0],['Summit Steel','Men','Formal',11499,0],['Lumen Minimal','Women','Minimal',8999,0],
['Aurelia Fashion','Women','Fashion',10999,13999],['Seraph Luxury','Women','Luxury',29999,0],['Silvia Rose','Women','Classic',7999,0],
['Pearl Slim','Women','Minimal',6499,0],['Duo Eternal Set','Couple','Couple',15999,19999],['Pulse AMOLED','Smart','AMOLED',11999,0],
['Fit Core','Smart','Fitness',4999,5999],['Apex Call Pro','Smart','Bluetooth Calling',13999,0],['Zenith Smart Elite','Smart','Premium',21999,0],
['Kids Tempo','Kids','Kids',2999,0],['Mono Automatic','Men','Automatic',27999,0]];
export const PRODUCTS=B.map(([name,gender,sub,price,old],i)=>{const n=String(i+1).padStart(3,'0');return{
id:`chronova-${n}`,sku:`CHR-${n}`,name,brand:'Chronova',category:gender==='Smart'?'Smart Watches':gender==='Men'?"Men's":gender==='Women'?"Women's":gender==='Couple'?'Couple':'Kids',
subcategory:sub,gender,price,oldPrice:old||null,discount:old?Math.round((1-price/old)*100):0,
shortDescription:`${name} — a ${sub.toLowerCase()} watch with refined detailing.`,description:'Demo description. Replace with your own product copy.',
images:[`/images/products/chronova-${n}.jpg`],colors:['Black','Silver','Gold'],strapMaterial:gender==='Smart'?'Silicone':'Stainless Steel',caseMaterial:'Stainless Steel',
movement:sub==='Automatic'||sub==='Luxury'?'Automatic':gender==='Smart'?'Digital':'Quartz',dialColor:'Black',waterResistance:'30m',glass:'Mineral',warranty:'1 Year',
stock:i%9===4?0:i%7===3?3:10+i,rating:+(4+((i*3)%10)/10).toFixed(1),reviewCount:12+i*5,features:['Water resistant','Gift box included'],
isFeatured:i<8,isBestSeller:i%3===0,isNew:i>13,isOnSale:!!old,status:'Active',createdAt:`2026-0${1+i%9}-10`};});
