import {createContext,useContext,useEffect,useState} from 'react';
import {PRODUCTS} from '../data/products';
import {CONFIG,COUPONS} from '../config';
const C=createContext();export const useStore=()=>useContext(C);
const ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
export function StoreProvider({children}){
 const [products,setProducts]=useState(()=>ls('chr_products',PRODUCTS));
 const [cart,setCart]=useState(()=>ls('chr_cart',[]));
 const [wish,setWish]=useState(()=>ls('chr_wish',[]));
 const [orders,setOrders]=useState(()=>ls('chr_orders',[]));
 const [toast,setToast]=useState('');
 useEffect(()=>localStorage.setItem('chr_products',JSON.stringify(products)),[products]);
 useEffect(()=>localStorage.setItem('chr_cart',JSON.stringify(cart)),[cart]);
 useEffect(()=>localStorage.setItem('chr_wish',JSON.stringify(wish)),[wish]);
 useEffect(()=>localStorage.setItem('chr_orders',JSON.stringify(orders)),[orders]);
 const notify=m=>{setToast(m);setTimeout(()=>setToast(''),2000)};
 const add=(p,q=1)=>{if(p.stock<1)return;setCart(c=>c.find(i=>i.id===p.id)?c.map(i=>i.id===p.id?{...i,qty:Math.min(p.stock,i.qty+q)}:i):[...c,{id:p.id,qty:Math.min(p.stock,q)}]);notify('Added to cart')};
 const setQty=(id,q)=>setCart(c=>q<1?c.filter(i=>i.id!==id):c.map(i=>i.id===id?{...i,qty:q}:i));
 const toggleWish=id=>{setWish(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);notify(wish.includes(id)?'Removed from wishlist':'Added to wishlist')};
 const lines=cart.map(i=>({...i,p:products.find(p=>p.id===i.id)})).filter(l=>l.p);
 const subtotal=lines.reduce((s,l)=>s+l.p.price*l.qty,0);
 const totals=code=>{const c=COUPONS[(code||'').toUpperCase()];const ok=c&&subtotal>=c.min;const discount=ok?subtotal*c.value/100:0;const shipping=subtotal===0||subtotal-discount>=CONFIG.freeShipAbove?0:CONFIG.shipFee;return{subtotal,discount,shipping,total:subtotal-discount+shipping,valid:!!ok,known:!!c}};
 const placeOrder=o=>{const d=new Date();const id=`CHR-${d.toISOString().slice(0,10).replace(/-/g,'')}-${String(orders.length+1).padStart(3,'0')}`;
  const order={...o,id,date:d.toISOString(),status:'Pending',items:lines.map(l=>({id:l.id,name:l.p.name,price:l.p.price,qty:l.qty}))};
  setOrders(x=>[order,...x]);setProducts(ps=>ps.map(p=>{const l=lines.find(l=>l.id===p.id);return l?{...p,stock:p.stock-l.qty}:p}));setCart([]);return id};
 return <C.Provider value={{products,setProducts,cart,lines,setQty,add,wish,toggleWish,orders,setOrders,totals,placeOrder,notify,toast}}>{children}</C.Provider>}
