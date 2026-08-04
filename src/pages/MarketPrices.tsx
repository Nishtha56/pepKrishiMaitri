import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, MapPin, RefreshCw } from "lucide-react";

interface MandiPrice {
  id: string;
  crop: string;
  variety: string;
  mandi: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceChange: number;
  unit: string;
  lastUpdated: string;
}

const MarketPrices = () => {
  const [profile, setProfile] = useState<any>(null);
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        generateMockPrices(profileData.location);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateMockPrices = (location: string) => {
    const crops = [
      { name: "Wheat", varieties: ["Sharbati", "Lokwan", "HD-2967"] },
      { name: "Rice", varieties: ["Basmati", "Sona Masuri", "IR-64"] },
      { name: "Cotton", varieties: ["DCH-32", "Bunny", "Brahma"] },
      { name: "Soybean", varieties: ["JS-335", "JS-9560", "NRC-37"] },
      { name: "Maize", varieties: ["Yellow", "White", "Sweet Corn"] },
      { name: "Groundnut", varieties: ["Bold", "Java", "TG-37A"] },
      { name: "Onion", varieties: ["Red", "White", "Nasik"] },
      { name: "Tomato", varieties: ["Hybrid", "Local", "Cherry"] },
      { name: "Potato", varieties: ["Kufri Jyoti", "Pukhraj", "Chandramukhi"] },
      { name: "Chana", varieties: ["Desi", "Kabuli", "JG-11"] },
    ];

    const mandis = [
      `${location} Main Mandi`,
      `${location} APMC`,
      "Azadpur Mandi",
      "Vashi APMC",
    ];

    const mockPrices: MandiPrice[] = [];

    crops.forEach((crop, idx) => {
      const variety = crop.varieties[Math.floor(Math.random() * crop.varieties.length)];
      const basePrice = 1500 + Math.random() * 4000;
      const minPrice = Math.round(basePrice * 0.85);
      const maxPrice = Math.round(basePrice * 1.15);
      const modalPrice = Math.round(basePrice);
      const priceChange = Math.round((Math.random() - 0.5) * 10);

      mockPrices.push({
        id: `${idx}`,
        crop: crop.name,
        variety,
        mandi: mandis[idx % mandis.length],
        state: location.includes(",") ? location.split(",")[1].trim() : "Maharashtra",
        minPrice,
        maxPrice,
        modalPrice,
        priceChange,
        unit: "Quintal",
        lastUpdated: new Date().toLocaleDateString("en-IN"),
      });
    });

    setPrices(mockPrices);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (profile) {
      generateMockPrices(profile.location);
    }
    setRefreshing(false);
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{t("marketPrices.title")}</h1>
            <p className="text-sm opacity-90 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {profile?.location}
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        <Card className="bg-accent/20 border-accent">
          <CardContent className="py-3">
            <p className="text-sm text-accent-foreground">
              💡 <strong>Tip:</strong> {t("marketPrices.tip")}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {prices.map((price) => (
            <Card key={price.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{price.crop}</CardTitle>
                    <p className="text-sm text-muted-foreground">{price.variety}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {price.mandi}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">{t("marketPrices.minPrice")}</p>
                    <p className="font-semibold">₹{price.minPrice.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground">{t("marketPrices.modalPrice")}</p>
                    <p className="font-bold text-primary">₹{price.modalPrice.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">{t("marketPrices.maxPrice")}</p>
                    <p className="font-semibold">₹{price.maxPrice.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Per {price.unit}</span>
                  <div className={`flex items-center gap-1 ${getPriceChangeColor(price.priceChange)}`}>
                    {getPriceChangeIcon(price.priceChange)}
                    <span>{price.priceChange > 0 ? "+" : ""}{price.priceChange}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground pt-4">
          ⚠️ {t("marketPrices.disclaimer")}
        </p>
      </main>
    </div>
  );
};

export default MarketPrices;