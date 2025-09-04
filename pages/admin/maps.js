import React from "react";

import React, { useEffect, useRef, useState } from "react";
// reactstrap components
import { Card, Container, Row } from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import Header from "components/Headers/Header.js";

const MapWrapper = () => {
  const mapRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // If no API key configured, don't attempt to load the map
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key || key === "YOUR_KEY_HERE") {
      setErrorMsg(
        "Google Maps API key not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable maps."
      );
      return;
    }

    let mounted = true;
    let attempts = 0;
    const maxAttempts = 50; // retry for ~5 seconds

    const initIfReady = () => {
      attempts += 1;
      if (!mounted) return;
      // Ensure google.maps is available
      if (typeof window !== "undefined" && window.google && window.google.maps) {
        try {
          const mapEl = mapRef.current;
          const lat = 40.748817;
          const lng = -73.985428;
          const myLatlng = new window.google.maps.LatLng(lat, lng);
          const mapOptions = {
            zoom: 13,
            center: myLatlng,
            scrollwheel: false,
            zoomControl: true,
            styles: [
              {
                featureType: "administrative",
                elementType: "labels.text.fill",
                stylers: [{ color: "#444444" }],
              },
              {
                featureType: "landscape",
                elementType: "all",
                stylers: [{ color: "#f2f2f2" }],
              },
              {
                featureType: "poi",
                elementType: "all",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "road",
                elementType: "all",
                stylers: [{ saturation: -100 }, { lightness: 45 }],
              },
              {
                featureType: "road.highway",
                elementType: "all",
                stylers: [{ visibility: "simplified" }],
              },
              {
                featureType: "road.arterial",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "transit",
                elementType: "all",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "water",
                elementType: "all",
                stylers: [{ color: "#5e72e4" }, { visibility: "on" }],
              },
            ],
          };

          const map = new window.google.maps.Map(mapEl, mapOptions);

          const marker = new window.google.maps.Marker({
            position: myLatlng,
            map: map,
            animation: window.google.maps.Animation.DROP,
            title: "Argon Dashboard",
          });

          const contentString =
            '<div class="info-window-content"><h2>Argon Dashboard</h2>' +
            "<p>Maps enabled.</p></div>";

          const infowindow = new window.google.maps.InfoWindow({
            content: contentString,
          });

          window.google.maps.event.addListener(marker, "click", function () {
            infowindow.open(map, marker);
          });
        } catch (e) {
          console.error("Error initializing Google Map", e);
          setErrorMsg("Error initializing Google Map: " + e.message);
        }
      } else if (attempts < maxAttempts) {
        // retry shortly
        setTimeout(initIfReady, 100);
      } else {
        setErrorMsg("Google Maps library failed to load.");
      }
    };

    initIfReady();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ minHeight: 200 }}>
      {errorMsg ? (
        <div style={{ padding: 20 }} className="text-center text-muted">
          {errorMsg}
        </div>
      ) : (
        <div
          style={{ height: `600px` }}
          className="map-canvas"
          id="map-canvas"
          ref={mapRef}
        />
      )}
    </div>
  );
};

function Maps() {
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0">
              <MapWrapper />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
}

Maps.layout = Admin;

export default Maps;
