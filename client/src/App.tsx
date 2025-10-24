//

import { Outlet } from "react-router";
import CommonLayout from "./components/layouts/CommonLayout";

export default function App() {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
}
