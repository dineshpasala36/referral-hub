import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Referral Is Not Free</h1>
          <Link to="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Your Referrals,
            <br />
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Your Commission
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your private business contacts. Generate secure referral links. Track every lead. Get paid for every successful deal.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Start Earning <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">100% Private</h3>
            <p className="text-muted-foreground">
              Your business contacts are never public. No directories, no searches. Only you control who sees what.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Tracking</h3>
            <p className="text-muted-foreground">
              Generate unique referral links for each friend. Track every lead, conversation, and deal stage automatically.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Paid</h3>
            <p className="text-muted-foreground">
              Earn 10% commission on every successful deal. Automated tracking and transparent payouts.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Save Your Contacts</h3>
                <p className="text-muted-foreground">
                  Add your trusted photographers, mechanics, realtors, tutors - any business you'd recommend.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-success text-success-foreground flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Generate Referral Link</h3>
                <p className="text-muted-foreground">
                  When someone needs a service, create a unique referral link just for them. It's private and expires when you want.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track & Earn</h3>
                <p className="text-muted-foreground">
                  Monitor the lead progress. When the deal closes, you automatically earn 10% commission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Turn Referrals Into Income?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands who are earning from their trusted network.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Referral Is Not Free. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;