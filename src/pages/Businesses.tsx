import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { toast } from "sonner";

const Businesses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    loadBusinesses();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadBusinesses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error: any) {
      toast.error("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleGenerateReferral = async (businessId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const uniqueCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { error } = await supabase.from("referrals").insert({
        user_id: user.id,
        business_id: businessId,
        unique_code: uniqueCode,
        status: "pending",
      });

      if (error) throw error;

      const link = `${window.location.origin}/r/${uniqueCode}`;
      navigator.clipboard.writeText(link);
      toast.success("Referral link generated and copied!");
    } catch (error: any) {
      toast.error("Failed to generate referral link");
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
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Businesses</h2>
            <p className="text-muted-foreground">Your private business contacts</p>
          </div>
          <Link to="/businesses/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Business
            </Button>
          </Link>
        </div>

        {businesses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No businesses yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first business contact to start generating referrals
              </p>
              <Link to="/businesses/add">
                <Button>Add Your First Business</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    {business.business_name}
                  </CardTitle>
                  {business.category && (
                    <CardDescription>{business.category}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {business.person_name && (
                    <div className="text-sm">
                      <span className="font-medium">Contact:</span> {business.person_name}
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {business.email}
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {business.phone}
                    </div>
                  )}
                  {business.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {business.address}
                    </div>
                  )}
                  <Button
                    className="w-full mt-4"
                    onClick={() => handleGenerateReferral(business.id)}
                  >
                    Generate Referral Link
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Businesses;