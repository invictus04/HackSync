// /src/components/layout/Footer.jsx

import Container from "../common/Container";

export default function Footer() {
  return (
    <footer
      className="py-10 bg-white"
      style={{ borderTop: "1px solid rgba(120, 133, 133, 0.2)" }}
    >
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2
            className="text-xl font-bold"
            style={{
              color: "#38302E",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Hack<span style={{ color: "#788585", fontWeight: 500 }}>Sync</span>
          </h2>

          <p className="text-sm font-medium" style={{ color: "#6F6866" }}>
            © 2026 HackSync. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
