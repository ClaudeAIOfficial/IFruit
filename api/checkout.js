export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
  if(!process.env.STRIPE_SECRET_KEY||process.env.ENABLE_LIVE_CHECKOUT!=='true')return res.status(503).json({error:'Checkout is not open yet. Merchant setup is still required.'});
  const {productId,quantity}=req.body||{};
  if(productId!=='classic'||!Number.isInteger(quantity)||quantity<1||quantity>5)return res.status(400).json({error:'Invalid product or quantity.'});
  const origin=process.env.PUBLIC_SITE_URL;
  if(!origin||!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(origin))return res.status(500).json({error:'Checkout origin is not configured.'});
  const params=new URLSearchParams({
    mode:'payment',
    'line_items[0][price_data][currency]':'usd',
    'line_items[0][price_data][unit_amount]':'69900',
    'line_items[0][price_data][product_data][name]':'iFruit phone - Graphite',
    'line_items[0][quantity]':String(quantity),
    billing_address_collection:'required',
    'shipping_address_collection[allowed_countries][0]':'US',
    'shipping_address_collection[allowed_countries][1]':'DE',
    'shipping_address_collection[allowed_countries][2]':'GB',
    'shipping_address_collection[allowed_countries][3]':'FR',
    'shipping_address_collection[allowed_countries][4]':'ES',
    'phone_number_collection[enabled]':'true',
    success_url:origin+'/success.html?session_id={CHECKOUT_SESSION_ID}',
    cancel_url:origin+'/#collection',
    'metadata[product_id]':'classic',
    'metadata[quantity]':String(quantity)
  });
  try{
    const response=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{'Authorization':'Bearer '+process.env.STRIPE_SECRET_KEY,'Content-Type':'application/x-www-form-urlencoded'},body:params});
    const data=await response.json();
    if(!response.ok||!data.url){console.error('Stripe checkout',data.error?.code);return res.status(502).json({error:'Unable to start checkout. Please try again.'});}
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({url:data.url});
  }catch(e){console.error('Checkout error',e.message);return res.status(503).json({error:'Payment service is temporarily unavailable.'});}
}