import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Building2, Mail, Phone, MapPin, Loader2 } from "lucide-react";

const ReferralPage = () => {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [referral, setReferral] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    message: "",
  });

  useEffect(() => {
    loadReferral();
  }, [code]);

  const loadReferral = async () => {
    try {
      const { data: referralData, error: refError } = await supabase
        .from("referrals")
        .select("*, businesses(*)")
        .eq("unique_code", code)
        .single();

      if (refError) throw refError;

      setReferral(referralData);
      setBusiness(referralData.businesses);
    } catch (error: any) {
      toast.error("Invalid or expired referral link");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("inquiries").insert({
        referral_id: referral.id,
        ...formData,
        status: "new",
      });

      if (error) throw error;

      toast.success("Your inquiry has been sent!");
      setFormData({
        sender_name: "",
        sender_email: "",
        sender_phone: "",
        message: "",
      });
    } catch (error: any) {
      toast.error("Failed to send inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!referral || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Invalid Link</h2>
            <p className="text-muted-foreground">
              This referral link is invalid or has expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Referral Is Not Free</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Business Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                {business.business_name}
              </CardTitle>
              {business.category && (
                <CardDescription className="text-lg">{business.category}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You've been referred to this trusted business. Fill out the form to get in touch!
              </p>

              {business.person_name && (
                <div>
                  <p className="text-sm font-medium mb-1">Contact Person</p>
                  <p className="text-muted-foreground">{business.person_name}</p>
                </div>
              )}

              {business.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{business.address}</span>
                </div>
              )}

              {business.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">About</p>
                  <p className="text-sm text-muted-foreground">{business.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inquiry Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Inquiry</CardTitle>
              <CardDescription>
                Let them know what you need. They'll get back to you soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sender_name">Your Name *</Label>
                  <Input
                    id="sender_name"
                    name="sender_name"
                    value={formData.sender_name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender_email">Your Email *</Label>
                  <Input
                    id="sender_email"
                    name="sender_email"
                    type="email"
                    value={formData.sender_email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender_phone">Your Phone</Label>
                  <Input
                    id="sender_phone"
                    name="sender_phone"
                    type="tel"
                    value={formData.sender_phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell them what you need..."
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;