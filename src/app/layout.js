import "./fonts.css";
import "./theme.css";
import "./globals.css";
import "./trile.css";
import "./quyen.css";
import { theme } from "../config/theme";
export const metadata = {
  title: "Huỳnh Anh Quyền | Cameraman & Editor",
  description:
    "Portfolio Huỳnh Anh Quyền — quay phim, dựng phim, quảng cáo, event, TVC, phóng sự và chụp ảnh sự kiện.",
  icons: { icon: "/icon.svg" },
};
export const viewport = { themeColor: theme.background };
export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      style={{ "--primary": theme.primary, "--bg": theme.background }}
    >
      <body>{children}</body>
    </html>
  );
}
