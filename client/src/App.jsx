import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";

// Dashboard
import Overview from "./pages/admin/Overview";

// Consultants
import Pending from "./pages/admin/consultants/Pending";
import Active from "./pages/admin/consultants/Active";
import Suspended from "./pages/admin/consultants/Suspended";
import ReviewConsultant from "./pages/admin/consultants/Review";
import Requestchange from "./pages/admin/consultants/Requestchange";
import Allconsultants from "./pages/admin/consultants/Allconsultants";

// Vehicles
import Allvehicles from "./pages/admin/vehicles/Allvehicles";
import Live from "./pages/admin/vehicles/Live";
import Drafts from "./pages/admin/vehicles/Drafts";
import Sold from "./pages/admin/vehicles/Sold";
import Flagged from "./pages/admin/vehicles/Flagged";

// Inspections
import Requests from "./pages/admin/inspections/Requests";
import InProgress from "./pages/admin/inspections/InProgress";
import Completed from "./pages/admin/inspections/Completed";
import Failed from "./pages/admin/inspections/Failed";

// Inquiries
import Logs from "./pages/admin/inquiries/Logs";
import Abuse from "./pages/admin/inquiries/Abuse";

// Subscriptions
import Tiers from "./pages/admin/subscriptions/Tiers";
import ConsultantSubs from "./pages/admin/subscriptions/Consultants";

// PPC
import Campaigns from "./pages/admin/ppc/Campaigns";
import Featured from "./pages/admin/ppc/Featured";

// Others
import Badge from "./pages/admin/other/Badge";
import VehicleImages from "./pages/admin/other/vehicleimages";
// import Badge from "./pages/admin/other/Badge";
// import VehicleImages from "./pages/admin/other/VehicleImages";

// General Pages
import Users from "./pages/admin/Users";
import Reviews from "./pages/admin/Reviews";
import Analytics from "./pages/admin/Analytics";
import CMS from "./pages/admin/CMS";
import Settings from "./pages/admin/Settings";

// Store Themes
import StoreThemeList from "./pages/admin/store-theme/StoreThemeList";
import StoreThemeForm from "./pages/admin/store-theme/StoreThemeForm";
import StoreThemeView from "./pages/admin/store-theme/StoreThemeView";
import VehicleDetails from "./pages/admin/vehicles/VehicleDetails";
import StoreThemeEdit from "./pages/admin/store-theme/StoreThemeEdit";
import StoreTemplateList from "./pages/admin/store-template/StoreTemplateList";
import StoreTemplateForm from "./pages/admin/store-template/StoreTemplateForm";
import StoreTemplateView from "./pages/admin/store-template/StoreTemplateView";
import StoreTemplateEdit from "./pages/admin/store-template/StoreTemplateEdit";
import TierList from "./pages/admin/subscriptions/TierList";
import TierCreate from "./pages/admin/subscriptions/TierCreate";
import TierDetail from "./pages/admin/subscriptions/TierDetail";
import Consultants from "./pages/admin/subscriptions/Consultants";


const App = () => {
  return (
    <Routes>
      {/* Redirect from / to /admin  */} 
      <Route path="/" element={<Navigate to="/admin" replace />} />

      <Route path="/admin" element={<AdminLayout />}>
        {/* Dashboard */}
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />

        {/* Consultants */}
        <Route path="consultants/all" element={<Allconsultants/>} />
        <Route path="consultants/pending" element={<Pending />} />
        <Route path="consultants/active" element={<Active />} />
        <Route path="consultants/requestchange" element={<Requestchange/>} />
        <Route path="consultants/suspended" element={<Suspended />} />
        <Route path="consultants/review/:id" element={<ReviewConsultant />} />

        {/* Vehicles */}
        <Route path="vehicles/all" element={<Allvehicles/>} />
        <Route path="vehicles/live" element={<Live />} />
        <Route path="vehicles/drafts" element={<Drafts />} />
        <Route path="vehicles/sold" element={<Sold />} />
        <Route path="vehicles/flagged" element={<Flagged />} />
        <Route path="/admin/vehicles/:id" element={<VehicleDetails/>}/>

        {/* Inspections */}
        <Route path="inspections/requests" element={<Requests />} />
        <Route path="inspections/in-progress" element={<InProgress />} />
        <Route path="inspections/completed" element={<Completed />} />
        <Route path="inspections/failed" element={<Failed />} />

        {/* Inquiries */}
        <Route path="inquiries/logs" element={<Logs />} />
        <Route path="inquiries/abuse" element={<Abuse />} />

        {/* Subscriptions */}
        {/* <Route path="subscriptions/tiers" element={<Tiers />} /> */}
        {/* <Route path="subscriptions/consultants" element={<ConsultantSubs />} /> */}
        <Route path="subscriptions/tiers" element={<TierList/>} />
        <Route path="subscriptions/tiers/create" element={<TierCreate/>} />
        <Route path="subscriptions/tiers/:id" element={<TierDetail/>} />
        <Route path="subscriptions/consultants" element={<Consultants/>} />
        
        {/* PPC */}
        <Route path="ppc/campaigns" element={<Campaigns />} />
        <Route path="ppc/featured" element={<Featured />} />

        {/* Other Section */}
        <Route path="other/badge" element={<Badge />} />
        <Route path="other/vehicleimages" element={<VehicleImages />} />

        {/* General Pages */}
        <Route path="users" element={<Users />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="cms" element={<CMS />} />
        <Route path="settings" element={<Settings />} />

        {/* Store Themes */}
        <Route path="store-theme" element={<StoreThemeList/>} />
        <Route path="store-theme/create" element={<StoreThemeForm />} />
        <Route path="store-theme/view/:id" element={<StoreThemeView />} />
        <Route path="store-theme/edit/:id" element={<StoreThemeEdit/>} />

        {/* Store Templates */}
        <Route path="store-template" element={<StoreTemplateList/>} />
        <Route path="store-template/create" element={<StoreTemplateForm/>} />
        <Route path="store-template/view/:id" element={<StoreTemplateView/>} />
        <Route path="store-template/edit/:id" element={<StoreTemplateEdit/>} />
      </Route>
    </Routes>
  );
};

export default App;
