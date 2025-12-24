import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Bell,
  MapPin,
  Moon,
  Globe,
  HelpCircle,
  FileText,
  Shield,
  Mail,
  ChevronRight,
  Recycle,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SettingsPage() {
  const traverse = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    traverse("/login");
  };

  const settingGroups = [
    {
      title: "Account",
      items: [
        {
          icon: LogOut,
          label: "Log Out",
          description: "Sign out of your account",
          onClick: handleLogout,
          className: "text-destructive",
          iconClassName: "text-destructive"
        }
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Get alerts for pickup updates",
          toggle: true,
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: MapPin,
          label: "Location Services",
          description: "Enable for nearby bin finder",
          toggle: true,
          value: locationServices,
          onChange: setLocationServices,
        },
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Switch to dark theme",
          toggle: true,
          value: darkMode,
          onChange: setDarkMode,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          description: "FAQs and guides",
          link: true,
        },
        {
          icon: Mail,
          label: "Contact Us",
          description: "Get in touch with our team",
          link: true,
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          icon: FileText,
          label: "Terms of Service",
          link: true,
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          link: true,
        },
      ],
    },
  ];

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Customize your EcoSort experience
        </p>
      </div>

      <div className="space-y-6">
        {settingGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              {group.title}
            </h3>
            <Card className="divide-y divide-border">
              {group.items.map((item: any, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    onClick={() => item.onClick?.()}
                    className={`flex items-center justify-between p-4 hover:bg-accent/50 transition-colors cursor-pointer ${item.className || ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${item.iconClassName || "text-accent-foreground"}`} />
                      </div>
                      <div>
                        <p className="font-medium">{item.label}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.customComponent ? (
                      item.customComponent
                    ) : item.toggle ? (
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                      />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </Card>
          </div>
        ))}

        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Recycle className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">EcoSort v1.0.0</h3>
          <p className="text-sm text-muted-foreground">
            Smart Waste Management
          </p>
        </Card>
      </div>
    </div>
  );
}
