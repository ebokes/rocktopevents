import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

function LogoutButton({ mobile = false, onLogout }: { mobile?: boolean; onLogout?: () => void }) {
  const { logoutMutation } = useAuth();
  
  const handleLogout = () => {
    onLogout?.();
    logoutMutation.mutate();
  };

  return (
    <Button 
      variant="outline" 
      className={mobile ? "w-full" : ""}
      onClick={handleLogout}
      data-testid={mobile ? "mobile-button-logout" : "button-logout"}
    >
      Logout
    </Button>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Find Venues", href: "/venues" },
    { name: "Gallery", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0" data-testid="logo">
              <span className="text-2xl font-bold text-purple-600">ROCKTOP</span>
              <span className="text-sm text-slate-600 block -mt-1">PREMIUM EVENTS</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-slate-800 font-semibold"
                      : "text-slate-600 hover:text-purple-600"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="text-sm text-slate-600">Loading...</div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-700" data-testid="user-name">
                    Admin
                  </span>
                </div>
                <Button asChild>
                  <Link href="/admin" data-testid="button-admin">Dashboard</Link>
                </Button>
                <LogoutButton />
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/contact" data-testid="button-get-quote">
                    Get Quote
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="mobile-menu-button">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-slate-800 font-semibold"
                          : "text-slate-600 hover:text-purple-600"
                      }`}
                      onClick={() => setIsOpen(false)}
                      data-testid={`mobile-nav-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    {isAuthenticated ? (
                      <>
                        <div className="px-3 py-2">
                          <div className="text-sm text-slate-700">
                            Admin
                          </div>
                        </div>
                        <Button 
                          className="w-full mb-2" 
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/admin">Dashboard</Link>
                        </Button>
                        <LogoutButton mobile onLogout={() => setIsOpen(false)} />
                      </>
                    ) : (
                      <>
                        <Button 
                          className="w-full mb-2"
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/contact">Get Quote</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
