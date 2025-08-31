import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Rocktop from "../../../assets/rocktop-img.webp";
import RocktopLogo1 from "../../../assets/rocktop-logo1.webp";
import ThemeToggle from "@/components/ui/theme-toggle";

function LogoutButton({
  mobile = false,
  onLogout,
}: {
  mobile?: boolean;
  onLogout?: () => void;
}) {
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
  const [navColor, setNavColor] = useState(false);

  const changeNavColorOnScroll = () =>
    window.scrollY >= 7 ? setNavColor(true) : setNavColor(false);
  window.addEventListener("scroll", changeNavColorOnScroll);

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
    <nav
      className={`${
        navColor
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm sticky top-0 z-50"
          : "bg-transparent z-50"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="flex items-center">
            <Link href="/" data-testid="logo">
              <div className="flex space-x-2 items-stretch">
                <img
                  src={RocktopLogo1}
                  className="w-10 h-10 mt-1"
                  alt="Rocktop Logo"
                  style={{ maxWidth: "100%" }}
                />
                <div className="flex flex-col">
                  <img
                    src={Rocktop}
                    className="mt-1 w-16"
                    alt="rocktop img"
                    style={{ maxWidth: "100%" }}
                  />
                  <span className="text-sm text-muted-foreground min-w-[110px]">
                    Premium Events
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  data-testid={`nav-${item.name
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <span
                    className="text-sm text-foreground"
                    data-testid="user-name"
                  >
                    Admin
                  </span>
                </div>
                <Button asChild>
                  <Link href="/admin" data-testid="button-admin">
                    Dashboard
                  </Link>
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
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  data-testid="mobile-menu-button"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex justify-end">
                    <ThemeToggle />
                  </div>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-primary font-semibold"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      onClick={() => setIsOpen(false)}
                      data-testid={`mobile-nav-${item.name
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="border-t pt-4 mt-4">
                    {isAuthenticated ? (
                      <>
                        <div className="px-3 py-2">
                          <div className="text-sm text-foreground">Admin</div>
                        </div>
                        <Button
                          className="w-full mb-2"
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/admin">Dashboard</Link>
                        </Button>
                        <LogoutButton
                          mobile
                          onLogout={() => setIsOpen(false)}
                        />
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
