import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { profileAPI } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Save, Camera, User, MapPin, Phone, 
  Leaf, Mountain, Sparkles, Loader2
} from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('digikheti_token');
      if (!token) {
        navigate("/auth");
        return;
      }

      const { profile: data } = await profileAPI.get();
      if (!data) {
        navigate("/onboarding");
        return;
      }

      setProfile(data);
      if (data.profileImage) {
        setProfileImage(data.profileImage);
      }
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await profileAPI.update({
        name: profile.name,
        phone: profile.phone,
        location: profile.village || profile.location,
        state: profile.state,
        district: profile.district,
        village: profile.village,
        pincode: profile.pincode,
        soilType: profile.soilType,
        landSize: profile.landSize ? parseFloat(profile.landSize) : undefined,
        profileImage: profileImage,
      });

      toast({ title: t("profile.updated") });
      await fetchProfile();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-teal-500 mb-4" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-teal-400 font-semibold">{t('profile.loadingProfile')}</p>
          <p className="text-sm text-zinc-500 mt-1">{t('profile.fetchingDetails')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Glow Effects - Teal/Cyan theme */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header - Teal Glassmorphism */}
      <motion.header 
        className="bg-gradient-to-r from-teal-900/30 via-cyan-900/25 to-teal-800/30 backdrop-blur-3xl border-b border-teal-500/30 text-white py-4 px-4 shadow-[0_4px_30px_rgba(20,184,166,0.15)] sticky top-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, rotate: -90 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="w-11 h-11 rounded-[1.2rem] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/50 flex items-center justify-center transition-all shadow-lg"
            >
              <ArrowLeft className="h-5 w-5 text-teal-400" />
            </motion.button>
            <motion.div
              className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <User className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base font-black tracking-tight uppercase">{t('profile.title')}</h1>
              <p className="text-[11px] text-teal-400/80 font-medium">{t('profile.subtitle')}</p>
            </div>
          </div>
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-6 w-6 text-teal-400" />
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
        <form onSubmit={handleSave}>
          <div className="space-y-6">
            
            {/* Profile Picture Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-teal-900/40 via-cyan-900/30 to-teal-800/40 backdrop-blur-xl border border-teal-500/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(20,184,166,0.1)]"
            >
              <div className="flex flex-col items-center">
                {/* Circular Profile Picture */}
                <motion.div 
                  className="relative mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div 
                    className="w-32 h-32 rounded-full border-4 border-teal-500/30 shadow-2xl overflow-hidden bg-white/5 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-teal-400" />
                    )}
                  </div>
                  {/* Upload Icon */}
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 border-3 border-black shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </motion.button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </motion.div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">{profile?.name || "Farmer"}</h2>
                <p className="text-teal-300 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {profile?.location || profile?.village || t('profile.addLocation')}
                </p>
              </div>
            </motion.div>

            {/* Personal Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-violet-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)]"
            >
              <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/40 px-6 py-4 border-b border-white/10">
                <h3 className="font-black text-white flex items-center gap-2 tracking-tight uppercase">
                  <div className="h-10 w-10 rounded-[1rem] bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                    <User className="w-5 h-5 text-violet-400" />
                  </div>
                  {t('profile.personalInfo')}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="name" className="text-violet-300 font-bold uppercase tracking-wider text-sm">{t('profile.fullName')}</Label>
                    <Input
                      id="name"
                      value={profile?.name || ""}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder={t('profile.namePlaceholder')}
                      className="rounded-[1.2rem] bg-white/5 border-violet-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                      required
                    />
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="phone" className="text-violet-300 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {t('profile.phoneNumber')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile?.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="rounded-[1.2rem] bg-white/5 border-violet-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Farm Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]"
            >
              <div className="bg-gradient-to-br from-cyan-900/40 via-teal-900/30 to-cyan-800/40 px-6 py-4 border-b border-white/10">
                <h3 className="font-black text-white flex items-center gap-2 tracking-tight uppercase">
                  <div className="h-10 w-10 rounded-[1rem] bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                  </div>
                  {t('profile.farmLocation')}
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="state" className="text-cyan-300 font-bold uppercase tracking-wider text-sm">{t('profile.state')}</Label>
                    <Select
                      value={profile?.state || ""}
                      onValueChange={(value) => setProfile({ ...profile, state: value })}
                    >
                      <SelectTrigger className="rounded-[1.2rem] bg-white/5 border-cyan-500/30 text-white hover:bg-white/10 transition-all [&>svg]:text-emerald-500">
                        <SelectValue placeholder={t('profile.selectState')} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-zinc-900 border-cyan-500/30">
                        <SelectItem value="punjab" className="text-white focus:bg-white/10">Punjab</SelectItem>
                        <SelectItem value="haryana" className="text-white focus:bg-white/10">Haryana</SelectItem>
                        <SelectItem value="up" className="text-white focus:bg-white/10">Uttar Pradesh</SelectItem>
                        <SelectItem value="mp" className="text-white focus:bg-white/10">Madhya Pradesh</SelectItem>
                        <SelectItem value="maharashtra" className="text-white focus:bg-white/10">Maharashtra</SelectItem>
                        <SelectItem value="rajasthan" className="text-white focus:bg-white/10">Rajasthan</SelectItem>
                        <SelectItem value="gujarat" className="text-white focus:bg-white/10">Gujarat</SelectItem>
                        <SelectItem value="karnataka" className="text-white focus:bg-white/10">Karnataka</SelectItem>
                        <SelectItem value="tamilnadu" className="text-white focus:bg-white/10">Tamil Nadu</SelectItem>
                        <SelectItem value="andhra" className="text-white focus:bg-white/10">Andhra Pradesh</SelectItem>
                        <SelectItem value="telangana" className="text-white focus:bg-white/10">Telangana</SelectItem>
                        <SelectItem value="bihar" className="text-white focus:bg-white/10">Bihar</SelectItem>
                        <SelectItem value="wb" className="text-white focus:bg-white/10">West Bengal</SelectItem>
                        <SelectItem value="odisha" className="text-white focus:bg-white/10">Odisha</SelectItem>
                        <SelectItem value="other" className="text-white focus:bg-white/10">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="district" className="text-cyan-300 font-bold uppercase tracking-wider text-sm">{t('profile.district')}</Label>
                    <Input
                      id="district"
                      value={profile?.district || ""}
                      onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                      placeholder={t('profile.districtPlaceholder')}
                      className="rounded-[1.2rem] bg-white/5 border-cyan-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="village" className="text-cyan-300 font-bold uppercase tracking-wider text-sm">{t('profile.village')}</Label>
                    <Input
                      id="village"
                      value={profile?.village || profile?.location || ""}
                      onChange={(e) => setProfile({ ...profile, village: e.target.value, location: e.target.value })}
                      placeholder={t('profile.villagePlaceholder')}
                     className="rounded-[1.2rem] bg-white/5 border-cyan-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                    />
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="pincode" className="text-cyan-300 font-bold uppercase tracking-wider text-sm">{t('profile.pincode')}</Label>
                    <Input
                      id="pincode"
                      maxLength={6}
                      value={profile?.pincode || ""}
                      onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                      placeholder={t('profile.pincodePlaceholder')}
                      className="rounded-[1.2rem] bg-white/5 border-cyan-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Farm Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl border border-orange-500/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)]"
            >
              <div className="bg-gradient-to-br from-orange-900/40 via-amber-900/30 to-orange-800/40 px-6 py-4 border-b border-white/10">
                <h3 className="font-black text-white flex items-center gap-2 tracking-tight uppercase">
                  <div className="h-10 w-10 rounded-[1rem] bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                    <Leaf className="w-5 h-5 text-orange-400" />
                  </div>
                  {t('profile.farmDetails')}
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="soilType" className="text-orange-300 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                      <Mountain className="w-4 h-4" />
                      {t('profile.soilType')}
                    </Label>
                    <Select
                      value={profile?.soilType}
                      onValueChange={(value) => setProfile({ ...profile, soilType: value })}
                    >
                      <SelectTrigger className="rounded-[1.2rem] bg-white/5 border-orange-500/30 text-white hover:bg-white/10 transition-all [&>svg]:text-emerald-500">
                        <SelectValue placeholder={t('profile.selectSoilType')} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-zinc-900 border-orange-500/30">
                        <SelectItem value="sandy" className="text-white focus:bg-white/10">{t("onboarding.soilTypes.sandy")}</SelectItem>
                        <SelectItem value="loamy" className="text-white focus:bg-white/10">{t("onboarding.soilTypes.loamy")}</SelectItem>
                        <SelectItem value="clay" className="text-white focus:bg-white/10">{t("onboarding.soilTypes.clay")}</SelectItem>
                        <SelectItem value="silt" className="text-white focus:bg-white/10">{t("onboarding.soilTypes.silt")}</SelectItem>
                        <SelectItem value="peat" className="text-white focus:bg-white/10">{t("onboarding.soilTypes.peat")}</SelectItem>
                        <SelectItem value="chalk" className="text-white focus:bg-white/10">{t("onboarding.soilTypes.chalk")}</SelectItem>
                        <SelectItem value="black" className="text-white focus:bg-white/10">Black Soil</SelectItem>
                        <SelectItem value="red" className="text-white focus:bg-white/10">Red Soil</SelectItem>
                        <SelectItem value="alluvial" className="text-white focus:bg-white/10">Alluvial Soil</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label htmlFor="landSize" className="text-orange-300 font-bold uppercase tracking-wider text-sm">{t('profile.landSize')}</Label>
                    <Input
                      id="landSize"
                      type="number"
                      step="0.01"
                      min="0"
                      value={profile?.landSize || ""}
                      onChange={(e) => setProfile({ ...profile, landSize: e.target.value })}
                      placeholder={t('profile.landSizePlaceholder')}
                      className="rounded-[1.2rem] bg-white/5 border-orange-500/30 text-white placeholder:text-zinc-500 hover:bg-white/10 transition-all"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.button
              type="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={saving}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white rounded-[2rem] px-8 py-4 font-black uppercase tracking-wide shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('profile.saving')}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {t('profile.saveChanges')}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;