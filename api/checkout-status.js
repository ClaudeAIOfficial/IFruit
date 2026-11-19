export default async function handler(req,res){
  if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'Method not allowed.'});}
  const id=req.query.session_id;
  if(typeof id!=='string'||!/^cs_(test_|live_)[a-zA-Z0-9]+$/.test(id)||!process.env.STRIPE_SECRET_KEY)return res.status(400).json({error:'Invalid checkout session.'});
  try{
    const response=await fetch('https://api.stripe.com/v1/checkout/sessions/'+encodeURIComponent(id),{headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY}});
    const data=await response.json();
    if(!response.ok)return res.status(404).json({error:'Checkout session not found.'});
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({paymentStatus:data.payment_status,orderReference:data.id,amountTotal:data.amount_total,currency:data.currency});
  }catch(e){return res.status(503).json({error:'Unable to verify payment right now.'});}
}