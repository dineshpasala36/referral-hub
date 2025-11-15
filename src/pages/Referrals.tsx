import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, LogOut, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const Referrals = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    loadReferrals();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadReferrals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("referrals")
        .select("*, businesses(business_name, category)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error: any) {
      toast.error("Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const copyReferralLink = (code: string) => {
    const link = `${window.location.origin}/ref/${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "contacted":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard">
            <h1 className="text-2xl font-bold text-primary">Referral Is Not Free</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="gap-2">
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Referrals</h2>
          <p className="text-muted-foreground">
            Manage all your active referral links
          </p>
        </div>

        {referrals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No referrals yet</p>
              <Button onClick={() => navigate("/businesses")}>
                Go to Businesses to Create Referrals
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {referrals.map((referral) => (
              <Card key={referral.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {referral.businesses?.business_name}
                      </CardTitle>
                      <CardDescription>
                        {referral.businesses?.category}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(referral.status)}>
                      {referral.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referral.referred_to_name && (
                      <div>
                        <p className="text-sm text-muted-foreground">Referred to:</p>
                        <p className="font-medium">{referral.referred_to_name}</p>
                        {referral.referred_to_email && (
                          <p className="text-sm text-muted-foreground">
                            {referral.referred_to_email}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Referral Link:</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => copyReferralLink(referral.unique_code)}
                        >
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => window.open(`/ref/${referral.unique_code}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Page
                        </Button>
                      </div>
                    </div>

                    {referral.expires_at && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Expires: {new Date(referral.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Referrals;
