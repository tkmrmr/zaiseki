import { HashRouter as Router, Route, Routes } from "react-router-dom"; // TODO: 可能であればBrowserRouterに変更
import View from "@/pages/View";
import Kiosk from "@/pages/Kiosk";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<View />} />
        <Route path="/kiosk" element={<Kiosk />} />
      </Routes>
    </Router>
  );
}
