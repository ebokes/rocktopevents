import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type VenuesMapProps = {
  location: string;
  query?: string; // e.g., "event center" (default)
  height?: number; // map height in px
};

type Place = {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  website?: string;
  lat?: number;
  lng?: number;
};

declare global {
  interface Window {
    google: any;
  }
}

function loadGoogleMapsApi(apiKey?: string, libraries: string[] = ["places"]) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if ((window as any).google?.maps) return resolve();
    if (!apiKey) return reject(new Error("Missing Google Maps API key"));

    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-google-maps]"
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(
      ","
    )}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps", "true");
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

export default function VenuesMap({
  location,
  query = "event center",
  height = 384,
}: VenuesMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [enquire, setEnquire] = useState<Place | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!apiKey) {
      setError("Map unavailable: missing VITE_GOOGLE_MAPS_API_KEY");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setError(null);
        await loadGoogleMapsApi(apiKey);
        if (cancelled) return;
        const center = { lat: 6.21, lng: 7.0741 }; // Default: Awka, NG
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
      } catch (e) {
        setError("Failed to load map library");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    const run = async () => {
      if (!window.google?.maps || !mapInstance.current) return;
      if (!location || location.trim().length < 2) {
        setPlaces([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const service = new window.google.maps.places.PlacesService(
          mapInstance.current
        );

        // Use Places API to resolve the location center instead of Geocoder
        const placeCenter = await new Promise<any | null>((resolve) => {
          service.findPlaceFromQuery(
            { query: location, fields: ["geometry"] },
            (results: any[], status: string) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                results &&
                results[0]?.geometry?.location
              ) {
                resolve(results[0].geometry.location);
              } else {
                resolve(null);
              }
            }
          );
        });

        if (!placeCenter) throw new Error("Location not found");

        const center = { lat: placeCenter.lat(), lng: placeCenter.lng() };
        mapInstance.current.setCenter(center);
        mapInstance.current.setZoom(14);

        const textQuery = await new Promise<any[]>((resolve) => {
          service.textSearch(
            { query: `${query} near ${location}` },
            (results: any[], status: string) => {
              if (
                status !== window.google.maps.places.PlacesServiceStatus.OK ||
                !results
              )
                return resolve([]);
              resolve(results);
            }
          );
        });

        const newPlaces: Place[] = textQuery.slice(0, 12).map((p: any) => ({
          place_id: p.place_id,
          name: p.name,
          formatted_address: p.formatted_address,
          rating: p.rating,
          user_ratings_total: p.user_ratings_total,
          lat: p.geometry?.location?.lat?.(),
          lng: p.geometry?.location?.lng?.(),
          website: p.website,
        }));
        setPlaces(newPlaces);

        // Add markers
        newPlaces.forEach((pl) => {
          if (pl.lat && pl.lng) {
            new window.google.maps.Marker({
              position: { lat: pl.lat, lng: pl.lng },
              map: mapInstance.current,
              title: pl.name,
            });
          }
        });
      } catch (e: any) {
        setError(e?.message || "Search failed");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [location, query]);

  const handleSendEnquiry = async (form: HTMLFormElement) => {
    const data = new FormData(form);
    const payload = {
      firstName: (data.get("firstName") as string) || "",
      lastName: (data.get("lastName") as string) || "",
      email: (data.get("email") as string) || "",
      phone: (data.get("phone") as string) || "",
      subject: `Venue Enquiry: ${enquire?.name} — ${enquire?.formatted_address}`,
      message: (data.get("message") as string) || "",
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send enquiry");
      toast({
        title: "Enquiry sent",
        description: "We will get back to you soon.",
      });
      setEnquire(null);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed",
        variant: "destructive",
      });
    }
  };

  if (!apiKey) {
    return (
      <div className="space-y-3">
        <Alert>
          <AlertTitle>Map disabled</AlertTitle>
          <AlertDescription>
            Missing <code>VITE_GOOGLE_MAPS_API_KEY</code>. Add it to your{" "}
            <code>.env</code>, enable “Maps JavaScript API” and “Places API”,
            then restart the dev server.
          </AlertDescription>
        </Alert>
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            Tip: If you use HTTP referrer restrictions, include your dev origin
            (<code>http://localhost:5173</code>) and your production domain (
            <code>
              {typeof window !== "undefined" ? window.location.origin : ""}
            </code>
            ).
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {/* <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            if (!window.google?.maps || !mapInstance.current) return;
            setTestResult("Testing Places API…");
            try {
              const service = new window.google.maps.places.PlacesService(
                mapInstance.current
              );
              const locStatus = await new Promise<string>((resolve) => {
                service.findPlaceFromQuery(
                  { query: "Awka, Nigeria", fields: ["geometry"] },
                  (_results: any[], status: string) => resolve(status)
                );
              });
              const searchStatus = await new Promise<{ status: string; count: number }>((resolve) => {
                service.textSearch(
                  { query: "event center near Awka, Nigeria" },
                  (results: any[], status: string) =>
                    resolve({ status, count: Array.isArray(results) ? results.length : 0 })
                );
              });
              setTestResult(
                `findPlaceFromQuery: ${locStatus} • textSearch: ${searchStatus.status} (${searchStatus.count} results)`
              );
            } catch (e: any) {
              setTestResult(`Test failed: ${e?.message || "Unknown error"}`);
            }
          }}
        >
          Test API
        </Button> */}
        {testResult && (
          <span className="text-xs text-muted-foreground">{testResult}</span>
        )}
      </div>
      <div
        ref={mapRef}
        style={{ height: `${height}px`, width: "100%", borderRadius: 16 }}
        className="border border-border"
      />

      {loading && (
        <div className="text-sm text-muted-foreground">
          Searching nearby event centers…
        </div>
      )}
      {error && (
        <Alert className="border-red-500/40">
          <AlertTitle>Map search failed</AlertTitle>
          <AlertDescription>
            {error}. If this persists, check your API key restrictions (HTTP
            referrers must include{" "}
            <code>
              {typeof window !== "undefined" ? window.location.origin : ""}
            </code>
            ) and ensure “Places API” is enabled.
          </AlertDescription>
        </Alert>
      )}

      {places.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((p) => (
            <Card key={p.place_id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="font-semibold text-foreground mb-1">
                  {p.name}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {p.formatted_address}
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {p.rating
                    ? `Rating: ${p.rating} (${p.user_ratings_total || 0})`
                    : "No ratings"}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEnquire(p)}>
                    Enquire
                  </Button>
                  {p.lat && p.lng && (
                    <a
                      className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3 text-sm hover:bg-accent hover:text-accent-foreground"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        p.name + ", " + p.formatted_address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Map
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!enquire} onOpenChange={(o) => !o && setEnquire(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Venue Enquiry</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendEnquiry(e.currentTarget);
            }}
            className="space-y-3"
          >
            <div className="text-sm text-muted-foreground">
              {enquire?.name} — {enquire?.formatted_address}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input name="firstName" placeholder="First name" required />
              <Input name="lastName" placeholder="Last name" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="phone" type="tel" placeholder="Phone (optional)" />
            </div>
            <Textarea
              name="message"
              rows={4}
              placeholder="Tell us about your event…"
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEnquire(null)}
              >
                Cancel
              </Button>
              <Button type="submit" className="min-w-[140px]">
                Send Enquiry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
