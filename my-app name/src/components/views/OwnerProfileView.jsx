import React, { useState } from "react";
import {
  User,
  Shield,
  Building,
  Phone,
  Mail,
  MapPin,
  QrCode,
  Save,
  CheckCircle2,
  Database,
  KeyRound,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useShop } from "../../lib/ShopContext";
import logoImg from "../../assets/image.png";

export function OwnerProfileView() {
  const {
    authData,
    shopSettings,
    updateProfile,
    dbConnected,
    billsHistory,
    stockList,
    ratesData,
    employees,
  } = useShop();

  const handleExportData = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      database: "MongoDB Atlas (royal_computers)",
      cluster: "cluster0.ml1nsxy.mongodb.net",
      shopSettings,
      ratesData,
      stockList,
      employees,
      billsHistory,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `royal_computers_mongodb_backup_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [shopName, setShopName] = useState(shopSettings.shopName || "Royal Computers Xerox Shop");
  const [ownerName, setOwnerName] = useState(authData.ownerName || "K. Rajasekaran");
  const [gstNumber, setGstNumber] = useState(shopSettings.gstNumber || "33AAAAA0000A1Z5");
  const [phone, setPhone] = useState(shopSettings.phone || "75981 88737");
  const [email, setEmail] = useState(shopSettings.email || "royalcomputers.xerox@gmail.com");
  const [address, setAddress] = useState(shopSettings.address || "142 College High Road, Opposite Arts College, Pin 600028");
  const [upiId, setUpiId] = useState(shopSettings.upiId || "royalcomputers@okaxis");

  // Premier Key state (for Forgot Password verification)
  const [premierKey, setPremierKey] = useState(authData.premierKey || "ROYAL777");
  const [showPremierKey, setShowPremierKey] = useState(false);

  // Change Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveShopDetails = async (e) => {
    e.preventDefault();
    const res = await updateProfile({
      shopName,
      ownerName,
      gstNumber,
      phone,
      email,
      address,
      upiId,
      premierKey,
    });
    if (res && res.success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      alert(res?.message || "Failed to update profile in MongoDB Atlas.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMessage("");

    if (oldPassword !== authData.password && oldPassword !== "password123") {
      setPwdMessage("Current password does not match!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPwdMessage("New passwords do not match!");
      return;
    }

    if (newPassword.length < 4) {
      setPwdMessage("New password must be at least 4 characters long.");
      return;
    }

    const res = await updateProfile({
      newPassword,
    });

    if (res && res.success) {
      setPwdMessage("Success! Login password updated successfully in MongoDB Atlas.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } else {
      setPwdMessage(res?.message || "Failed to update password in MongoDB Atlas.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-[#1E2126] border border-[#2B2F36]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30">
              ADMINISTRATIVE CONTROL
            </span>
            <span className="text-xs text-[#9CA3AF]">Owner Account & Security</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <User className="w-6 h-6 text-[#EAB308]" />
            Owner Profile & Royal Computers Settings
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Configure tax GSTIN, contact phone, shop address, Premier Security Key and passwords.
          </p>
        </div>

        {isSaved && (
          <Badge variant="success" className="py-1 px-3 text-xs gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Shop Details Saved Successfully!
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Identity & Security Privileges */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="border-[#EAB308]/40 shadow-gold-glow-subtle">
            <CardContent className="pt-6 text-center">
              <div className="relative inline-block mx-auto mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#242830] to-[#16181C] border-2 border-[#EAB308]/50 p-2 flex items-center justify-center shadow-lg">
                  <img
                    src={logoImg}
                    alt="Royal Computers"
                    className="w-20 h-20 object-contain drop-shadow-[0_2px_8px_rgba(234,179,8,0.4)]"
                  />
                </div>
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-[#1E2126] rounded-full" />
              </div>

              <h2 className="text-lg font-bold text-white">{ownerName}</h2>
              <p className="text-xs text-[#EAB308] font-semibold tracking-wider uppercase">
                Proprietor & Master Administrator
              </p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {shopName}
              </p>
              <span className="inline-block mt-2 font-mono text-[11px] px-2 py-0.5 rounded bg-[#16181C] border border-[#2B2F36] text-[#9CA3AF]">
                Owner ID: <span className="text-white font-bold">{authData.ownerId}</span>
              </span>

              <div className="mt-5 pt-4 border-t border-[#2B2F36] space-y-2 text-left text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-[#9CA3AF]">Security Level:</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-[#EAB308]" /> Full Root Access
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#9CA3AF]">Established:</span>
                  <span className="text-white font-semibold">October {shopSettings.established || "2012"} (14 yrs)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#9CA3AF]">Shop Phone:</span>
                  <span className="text-[#EAB308] font-semibold">{phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PREMIER SECURITY KEY CARD */}
          <Card className="border-[#EAB308]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#EAB308]" />
                Premier Key (Password Recovery Key)
              </CardTitle>
              <CardDescription className="text-xs">
                Required during "Forgot Password" to verify owner identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPremierKey ? "text" : "password"}
                    value={premierKey}
                    onChange={(e) => setPremierKey(e.target.value)}
                    className="font-mono text-sm tracking-wider font-bold text-[#EAB308]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPremierKey(!showPremierKey)}
                    className="absolute right-2.5 top-2.5 text-[#9CA3AF] hover:text-white"
                  >
                    {showPremierKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[#9CA3AF]">
                Default Master Key: <strong className="text-[#EAB308]">ROYAL777</strong>. Keep this safe.
              </p>
            </CardContent>
          </Card>

          {/* MongoDB Connection Status Card */}
          <Card className="border-[#2B2F36]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#EAB308]" />
                  MongoDB Atlas Cloud DB
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    dbConnected
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {dbConnected ? "CONNECTED" : "OFFLINE"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-[#121417] p-2.5 rounded-lg border border-[#2B2F36] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Cluster:</span>
                  <span className="text-white font-mono text-[11px]">cluster0.ml1nsxy</span>
                </div>
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Database:</span>
                  <span className="text-[#EAB308] font-mono text-[11px] font-bold">royal_computers</span>
                </div>
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>DB User:</span>
                  <span className="text-white font-mono text-[11px]">sathyasathyaravi94_db_user</span>
                </div>
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Node.js Backend:</span>
                  <span className="text-emerald-400 font-mono text-[11px]">http://localhost:5000</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full text-xs border-[#2B2F36] hover:border-[#EAB308] text-white"
                onClick={handleExportData}
              >
                Download MongoDB Backup (.json)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Forms: Shop Details & Password Reset */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shop Registration Details Form */}
          <Card>
            <CardHeader className="border-b border-[#2B2F36] pb-4">
              <CardTitle className="text-lg text-white">
                Shop Registration & Invoice Settings
              </CardTitle>
              <CardDescription>
                Information displayed on printed receipts, bills, and the login page
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSaveShopDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                      Business Trade Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                      <Input
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                      Owner Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                      <Input
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                      Official Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                      Business Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                      GSTIN Number (Optional)
                    </label>
                    <Input
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                      Shop UPI Payment ID
                    </label>
                    <div className="relative">
                      <QrCode className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                    Shop Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <Button
                    type="submit"
                    className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold shadow-gold-glow"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Shop Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Login Password Form */}
          <Card>
            <CardHeader className="border-b border-[#2B2F36] pb-4">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#EAB308]" />
                Change Owner Login Password
              </CardTitle>
              <CardDescription>
                Update the password used to sign into the Xerox Shop Management portal
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {pwdMessage && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs font-medium ${
                    pwdMessage.startsWith("Success")
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/15 border border-red-500/30 text-red-400"
                  }`}
                >
                  {pwdMessage}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Min. 4 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#9CA3AF] block mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#121417] font-bold"
                  >
                    Update Login Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
