-- Allow anyone to view businesses that have referrals
-- This is needed so the public referral page can display business info
CREATE POLICY "Anyone can view business through referral"
ON public.businesses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.referrals
    WHERE referrals.business_id = businesses.id
  )
);