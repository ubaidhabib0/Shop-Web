import {Routes,Route,Link,NavLink,useNavigate,useParams,useSearchParams,Outlet} from 'react-router-dom';
import {useState} from 'react';
import {Heart,ShoppingBag,Search,User,Watch} from 'lucide-react';
import {useStore} from './context/Store';import {money,placeholder} from './utils/format';import {CONFIG} from './config';

const Img=({src,alt,...r})=><img src={src} alt={alt} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=placeholder(alt)}} {...r}/>;

function Card({p}){const {add,wish,toggleWish}=useStore();return(
<div className="pcard"><div className="position-relative"><Link to={`/product/${p.id}`}><Img src={p.images[0]} alt={p.name}/></Link>
<button className="heart" aria-label="Toggle wishlist" onClick={()=>toggleWish(p.id)}><Heart size={18} fill={wish.includes(p.id)?'#b08d57':'none'} color="#b08d57"/></button>
{p.discount>0&&<span className="badge badge-off position-absolute top-0 start-0 m-2">-{p.discount}%</span>}</div>
<div className="body"><span className="brandtag">{p.brand}</span><Link to={`/product/${p.id}`} className="text-dark text-decoration-none fw-semibold">{p.name}</Link>
<small className="text-muted">★ {p.rating} ({p.reviewCount})</small>
<div><strong>{money(p.price)}</strong> {p.oldPrice&&<span className="old">{money(p.oldPrice)}</span>}</div>
<button className="btn btn-dark btn-sm mt-auto" disabled={p.stock<1} onClick={()=>add(p)}>{p.stock<1?'Out of Stock':'Add to Cart'}</button></div></div>)}

const Grid=({list})=>list.length?<div className="row g-3">{list.map(p=><div key={p.id} className="col-6 col-md-4 col-lg-3"><Card p={p}/></div>)}</div>
:<div className="text-center py-5"><h4>No watches found</h4><Link to="/shop" className="btn btn-dark mt-2">Clear Search</Link></div>;

function Nav(){const {cart,wish}=useStore();const nav=useNavigate();const [q,setQ]=useState('');return(
<nav className="navbar navbar-expand-lg sticky-top"><div className="container">
<Link to="/" className="brand"><Watch size={22}/> Chrono<span>va</span></Link>
<button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nv" aria-label="Menu"><span className="navbar-toggler-icon"/></button>
<div className="collapse navbar-collapse" id="nv"><ul className="navbar-nav me-auto">
{[['/','Home'],['/shop','Shop'],["/shop?cat=Men's","Men's"],["/shop?cat=Women's",'Women\'s'],['/shop?cat=Smart Watches','Smart Watches'],['/about','About']].map(([t,l])=><li key={l} className="nav-item"><Link className="nav-link" to={t}>{l}</Link></li>)}</ul>
<form className="d-flex me-3 my-2" onSubmit={e=>{e.preventDefault();nav(`/shop?q=${encodeURIComponent(q)}`)}}><input className="form-control form-control-sm" placeholder="Search watches" aria-label="Search" value={q} onChange={e=>setQ(e.target.value)}/><button className="btn btn-sm" aria-label="Search"><Search size={18}/></button></form>
<Link to="/wishlist" className="nav-link"><Heart size={20}/> {wish.length}</Link>
<Link to="/admin" className="nav-link"><User size={20}/></Link>
<Link to="/cart" className="nav-link"><ShoppingBag size={20}/> {cart.reduce((s,i)=>s+i.qty,0)}</Link></div></div></nav>)}

function Layout(){const {toast}=useStore();return<><Nav/><main className="container py-4" style={{minHeight:'70vh'}}><Outlet/></main>
<footer className="bg-dark text-light py-4 mt-5"><div className="container small d-flex flex-wrap justify-content-between gap-2"><span>© 2026 {CONFIG.name}. {CONFIG.tagline}</span><span>{CONFIG.email} · {CONFIG.phone}</span></div></footer>
{toast&&<div className="toast-box" role="status">{toast}</div>}</>}

function Home(){const {products}=useStore();return<>
<section className="hero rounded-4 mb-5"><div className="container"><h1>{CONFIG.tagline}</h1><p className="lead my-3">Discover watches designed to define your style, elevate every moment, and stand the test of time.</p>
<Link to="/shop" className="btn btn-gold me-2">Shop Collection</Link><Link to="/shop?cat=Men's" className="btn btn-outline-light">Explore Watches</Link></div></section>
<h2 className="h3 mb-3">Best Sellers</h2><Grid list={products.filter(p=>p.isBestSeller).slice(0,8)}/>
<h2 className="h3 my-4">New Arrivals</h2><Grid list={products.filter(p=>p.isNew).slice(0,4)}/>
<section className="panel text-center my-5"><h2>Up to 30% Off Selected Watches</h2><Link to="/shop?sale=1" className="btn btn-gold mt-2">Shop Offers</Link></section>
<div className="row g-3 text-center">{['Authentic Quality','Secure Shopping','Fast Delivery','Easy Returns','Cash on Delivery','Customer Support'].map(t=><div key={t} className="col-6 col-md-4"><div className="panel">{t}</div></div>)}</div></>}

function Shop(){const {products}=useStore();const [sp]=useSearchParams();const [sort,setSort]=useState('featured');const [max,setMax]=useState(100000);const [cat,setCat]=useState(sp.get('cat')||'');
const q=(sp.get('q')||'').toLowerCase();
let list=products.filter(p=>p.status!=='Draft'&&(!cat||p.category===cat)&&p.price<=max&&(!sp.get('sale')||p.isOnSale)&&(!q||[p.name,p.brand,p.category,p.sku].join(' ').toLowerCase().includes(q)));
const S={'low':(a,b)=>a.price-b.price,'high':(a,b)=>b.price-a.price,'rated':(a,b)=>b.rating-a.rating,'new':(a,b)=>b.createdAt.localeCompare(a.createdAt)};if(S[sort])list=[...list].sort(S[sort]);
return<><h1 className="h2 mb-3">Shop Watches</h1><div className="row g-2 mb-4">
<div className="col-6 col-md-3"><select className="form-select" aria-label="Category" value={cat} onChange={e=>setCat(e.target.value)}><option value="">All categories</option>{[...new Set(products.map(p=>p.category))].map(c=><option key={c}>{c}</option>)}</select></div>
<div className="col-6 col-md-3"><select className="form-select" aria-label="Sort" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="new">Newest</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rated">Best Rated</option></select></div>
<div className="col-12 col-md-4"><label className="small">Max price: {money(max)}</label><input type="range" className="form-range" min="2000" max="100000" step="1000" value={max} onChange={e=>setMax(+e.target.value)}/></div></div><Grid list={list}/></>}

function Product(){const {id}=useParams();const {products,add,toggleWish,wish}=useStore();const nav=useNavigate();const p=products.find(x=>x.id===id);const [qty,setQty]=useState(1);
if(!p)return<div className="text-center py-5"><h3>Watch not found</h3><Link to="/shop" className="btn btn-dark">Back to Shop</Link></div>;
return<div className="row g-4"><div className="col-md-6"><Img className="w-100 rounded-4" src={p.images[0]} alt={p.name}/></div><div className="col-md-6">
<span className="brandtag">{p.brand}</span><h1 className="h2">{p.name}</h1><p className="text-muted">★ {p.rating} · {p.reviewCount} reviews · SKU {p.sku}</p>
<h3>{money(p.price)} {p.oldPrice&&<span className="old">{money(p.oldPrice)}</span>}</h3><p>{p.shortDescription}</p>
<p className={p.stock>0?'text-success':'text-danger'}>{p.stock>0?`In stock (${p.stock})`:'Out of Stock'}</p>
<div className="d-flex gap-2 mb-3"><input type="number" min="1" max={p.stock} className="form-control" style={{width:90}} aria-label="Quantity" value={qty} onChange={e=>setQty(Math.max(1,+e.target.value||1))}/>
<button className="btn btn-dark" disabled={!p.stock} onClick={()=>add(p,qty)}>Add to Cart</button>
<button className="btn btn-gold" disabled={!p.stock} onClick={()=>{add(p,qty);nav('/checkout')}}>Buy Now</button>
<button className="btn btn-outline-dark" onClick={()=>toggleWish(p.id)}>{wish.includes(p.id)?'In Wishlist':'Wishlist'}</button></div>
<table className="table table-sm"><tbody>{[['Movement',p.movement],['Case',p.caseMaterial],['Strap',p.strapMaterial],['Dial',p.dialColor],['Water resistance',p.waterResistance],['Glass',p.glass],['Warranty',p.warranty]].map(([k,v])=><tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table></div></div>}

function Cart(){const {lines,setQty,totals}=useStore();const t=totals();
if(!lines.length)return<div className="text-center py-5"><h3>Your cart is empty</h3><Link to="/shop" className="btn btn-dark mt-2">Continue Shopping</Link></div>;
return<div className="row g-4"><div className="col-lg-8"><h1 className="h3">Cart</h1>{lines.map(l=><div key={l.id} className="panel d-flex gap-3 align-items-center mb-2"><Img src={l.p.images[0]} alt={l.p.name} width="80" height="80" style={{objectFit:'cover',borderRadius:8}}/>
<div className="flex-grow-1"><strong>{l.p.name}</strong><div>{money(l.p.price)}</div></div>
<input type="number" min="1" max={l.p.stock} className="form-control" style={{width:80}} aria-label="Quantity" value={l.qty} onChange={e=>setQty(l.id,Math.min(l.p.stock,+e.target.value))}/>
<button className="btn btn-outline-danger btn-sm" onClick={()=>setQty(l.id,0)}>Remove</button></div>)}</div>
<div className="col-lg-4"><div className="panel"><div className="d-flex justify-content-between"><span>Subtotal</span><span>{money(t.subtotal)}</span></div><div className="d-flex justify-content-between"><span>Shipping</span><span>{t.shipping?money(t.shipping):'Free'}</span></div><hr/><div className="d-flex justify-content-between fw-bold"><span>Total</span><span>{money(t.total)}</span></div>
<Link to="/checkout" className="btn btn-dark w-100 mt-3">Proceed to Checkout</Link><Link to="/shop" className="btn btn-link w-100">Continue Shopping</Link></div></div></div>}

function Wishlist(){const {products,wish}=useStore();const l=products.filter(p=>wish.includes(p.id));
return<><h1 className="h3 mb-3">Wishlist</h1>{l.length?<Grid list={l}/>:<div className="text-center py-5"><h4>Your wishlist is empty</h4><Link to="/shop" className="btn btn-dark mt-2">Browse Watches</Link></div>}</>}

function Checkout(){const {lines,totals,placeOrder}=useStore();const nav=useNavigate();const [code,setCode]=useState('');const [f,setF]=useState({name:'',email:'',phone:'',city:'',province:'Punjab',address:'',postal:'',pay:'COD',wallet:''});const [err,setErr]=useState({});
const t=totals(code);const set=k=>e=>setF({...f,[k]:e.target.value});
if(!lines.length)return<div className="text-center py-5"><h3>Your cart is empty</h3><Link to="/shop" className="btn btn-dark">Shop</Link></div>;
const submit=e=>{e.preventDefault();const x={};if(!f.name.trim())x.name='Name required';if(!/^\S+@\S+\.\S+$/.test(f.email))x.email='Valid email required';if(!/^(\+92|0)3\d{9}$/.test(f.phone.replace(/[\s-]/g,'')))x.phone='Use format 03XXXXXXXXX';
if(!f.city.trim())x.city='City required';if(f.address.trim().length<8)x.address='Enter complete address';
if(f.pay!=='COD'&&!/^03\d{9}$/.test(f.wallet.replace(/[\s-]/g,'')))x.wallet=`Enter your ${f.pay} mobile number`;
setErr(x);if(Object.keys(x).length)return;const id=placeOrder({customer:{name:f.name,email:f.email,phone:f.phone},address:{...f},payment:{method:f.pay,status:f.pay==='COD'?'Pending':'Paid (mock)'},totals:t,coupon:t.valid?code.toUpperCase():null});nav(`/order/${id}`)};
const F=({k,l,type='text'})=><div className="mb-2"><label className="form-label small">{l}</label><input type={type} className={'form-control'+(err[k]?' is-invalid':'')} value={f[k]} onChange={set(k)}/><div className="invalid-feedback">{err[k]}</div></div>;
return<form onSubmit={submit} noValidate className="row g-4"><div className="col-lg-8"><h1 className="h3">Checkout</h1>
<div className="panel mb-3"><h2 className="h5">1. Customer</h2><F k="name" l="Full Name"/><F k="email" l="Email" type="email"/><F k="phone" l="Phone"/></div>
<div className="panel mb-3"><h2 className="h5">2. Delivery</h2><div className="mb-2"><label className="form-label small">Province</label><select className="form-select" value={f.province} onChange={set('province')}>{['Punjab','Sindh','Khyber Pakhtunkhwa','Balochistan','Islamabad Capital Territory','Gilgit-Baltistan','Azad Kashmir'].map(p=><option key={p}>{p}</option>)}</select></div><F k="city" l="City"/><F k="address" l="Complete Address"/><F k="postal" l="Postal Code"/></div>
<div className="panel"><h2 className="h5">3. Payment</h2>{[['COD','Cash on Delivery','Pay when your order arrives.'],['Easypaisa','Easypaisa','Pay securely using Easypaisa.'],['JazzCash','JazzCash','Pay securely using JazzCash.']].map(([v,l,d])=>
<label key={v} className="d-block border rounded p-2 mb-2"><input type="radio" name="pay" checked={f.pay===v} onChange={()=>setF({...f,pay:v})}/> <strong>{l}</strong><div className="small text-muted ms-4">{d}</div></label>)}
{f.pay!=='COD'&&<><F k="wallet" l={`${f.pay} account number`}/><div className="small text-muted">Demo only: no real payment is processed.</div></>}</div></div>
<div className="col-lg-4"><div className="panel"><h2 className="h5">Summary</h2>{lines.map(l=><div key={l.id} className="d-flex justify-content-between small"><span>{l.p.name} × {l.qty}</span><span>{money(l.p.price*l.qty)}</span></div>)}<hr/>
<div className="input-group mb-1"><input className="form-control" placeholder="Coupon (WELCOME10)" aria-label="Coupon" value={code} onChange={e=>setCode(e.target.value)}/></div>
{code&&<div className={'small mb-2 '+(t.valid?'text-success':'text-danger')}>{t.valid?'Coupon applied':t.known?'Minimum order not met':'Invalid coupon'}</div>}
<div className="d-flex justify-content-between"><span>Discount</span><span>-{money(t.discount)}</span></div><div className="d-flex justify-content-between"><span>Shipping</span><span>{t.shipping?money(t.shipping):'Free'}</span></div><hr/><div className="d-flex justify-content-between fw-bold"><span>Total</span><span>{money(t.total)}</span></div>
<button className="btn btn-dark w-100 mt-3">Place Order</button></div></div></form>}

const STAGES=['Pending','Confirmed','Processing','Shipped','Out for Delivery','Delivered'];
function OrderPage(){const {id}=useParams();const {orders}=useStore();const o=orders.find(x=>x.id===id);
if(!o)return<div className="text-center py-5"><h3>Order not found</h3><Link to="/" className="btn btn-dark">Home</Link></div>;
return<div className="panel"><h1 className="h3">Order Confirmed!</h1><p>Thank you for shopping with Chronova Watches.</p><p><strong>{o.id}</strong> · {new Date(o.date).toLocaleDateString()} · {o.payment.method} · {money(o.totals.total)}</p>
<p className="small">{o.address.address}, {o.address.city}, {o.address.province}</p>
<ol className="list-unstyled">{STAGES.map((s,i)=><li key={s} className={i<=STAGES.indexOf(o.status)?'fw-bold':'text-muted'}>{i<=STAGES.indexOf(o.status)?'●':'○'} {s==='Pending'?'Order Placed':s}</li>)}</ol>
<Link to="/shop" className="btn btn-dark">Continue Shopping</Link></div>}

function Track(){const {orders}=useStore();const [v,setV]=useState('');const nav=useNavigate();const [e,setE]=useState('');
return<div className="panel" style={{maxWidth:480}}><h1 className="h3">Track Order</h1><input className="form-control mb-2" placeholder="CHR-20261005-001" aria-label="Order ID" value={v} onChange={x=>setV(x.target.value)}/>{e&&<div className="text-danger small">{e}</div>}
<button className="btn btn-dark" onClick={()=>orders.find(o=>o.id===v.trim())?nav(`/order/${v.trim()}`):setE('Order not found')}>Track</button></div>}

const Page=({t,children})=><div className="panel"><h1 className="h3">{t}</h1>{children}</div>;

function Admin(){const links=[['/admin','Dashboard'],['/admin/products','Products'],['/admin/orders','Orders']];
return<div className="row g-0"><div className="col-md-2 admin-side"><div className="p-3 brand text-white">Admin</div>{links.map(([to,l])=><NavLink key={to} end to={to}>{l}</NavLink>)}<Link to="/">← Store</Link></div><div className="col-md-10 p-4"><Outlet/></div></div>}
function Dash(){const {orders,products}=useStore();const sales=orders.reduce((s,o)=>s+o.totals.total,0);
return<><h1 className="h3 mb-3">Dashboard</h1><div className="row g-3">{[['Total Sales',money(sales)],['Orders',orders.length],['Products',products.length],['Low Stock',products.filter(p=>p.stock>0&&p.stock<5).length],['Pending',orders.filter(o=>o.status==='Pending').length]].map(([k,v])=><div key={k} className="col-6 col-lg-3"><div className="panel"><small className="text-muted">{k}</small><div className="h4 mb-0">{v}</div></div></div>)}</div></>}
function AdminProducts(){const {products,setProducts,notify}=useStore();const [n,setN]=useState({name:'',price:'',stock:''});
const addP=e=>{e.preventDefault();if(!n.name||+n.price<=0)return notify('Name and price required');const i=String(products.length+1).padStart(3,'0');
setProducts([{...products[0],id:`chronova-${i}`,sku:`CHR-${i}`,name:n.name,price:+n.price,oldPrice:null,discount:0,stock:+n.stock||0,images:[`/images/products/chronova-${i}.jpg`],createdAt:new Date().toISOString().slice(0,10)},...products]);setN({name:'',price:'',stock:''});notify('Product saved successfully')};
return<><h1 className="h3 mb-3">Products</h1><form onSubmit={addP} className="panel d-flex gap-2 flex-wrap mb-3">{['name','price','stock'].map(k=><input key={k} className="form-control" style={{maxWidth:200}} placeholder={k} aria-label={k} value={n[k]} onChange={e=>setN({...n,[k]:e.target.value})}/>)}<button className="btn btn-dark">Add Product</button></form>
<div className="table-responsive panel"><table className="table align-middle"><thead><tr><th/><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th/></tr></thead><tbody>{products.map(p=><tr key={p.id}><td><Img src={p.images[0]} alt="" width="40" height="40"/></td><td>{p.name}</td><td>{p.sku}</td><td>{money(p.price)}</td><td>{p.stock}</td>
<td><button className="btn btn-sm btn-outline-danger" onClick={()=>window.confirm('Delete this product?')&&setProducts(products.filter(x=>x.id!==p.id))}>Delete</button></td></tr>)}</tbody></table></div></>}
function AdminOrders(){const {orders,setOrders}=useStore();const all=[...STAGES,'Cancelled','Returned'];
return<><h1 className="h3 mb-3">Orders</h1>{orders.length?<div className="table-responsive panel"><table className="table"><thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{o.id}</td><td>{o.customer.name}</td><td>{money(o.totals.total)}</td><td>{o.payment.method}</td>
<td><select className="form-select form-select-sm" aria-label="Status" value={o.status} onChange={e=>setOrders(orders.map(x=>x.id===o.id?{...x,status:e.target.value}:x))}>{all.map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>:<div className="panel text-center">No orders yet</div>}</>}

export default function App(){return<Routes><Route element={<Layout/>}>
<Route index element={<Home/>}/><Route path="shop" element={<Shop/>}/><Route path="product/:id" element={<Product/>}/><Route path="cart" element={<Cart/>}/><Route path="wishlist" element={<Wishlist/>}/><Route path="checkout" element={<Checkout/>}/><Route path="order/:id" element={<OrderPage/>}/><Route path="track" element={<Track/>}/>
<Route path="about" element={<Page t="About Chronova"><p>Chronova is a modern watch store focused on stylish, reliable, and carefully selected watches.</p></Page>}/>
<Route path="*" element={<Page t="Page not found"><Link to="/">Go home</Link></Page>}/></Route>
<Route path="admin" element={<Admin/>}><Route index element={<Dash/>}/><Route path="products" element={<AdminProducts/>}/><Route path="orders" element={<AdminOrders/>}/></Route></Routes>}
