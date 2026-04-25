import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layouts/AdminLayout";

// Dashboard
import Overview from "./pages/admin/Overview";
// Css for theme 
import "./pages/admin/consultants/storefront-approvals/themes/themeStyles.css"

// Consultants

import Allconsultants from "./pages/admin/consultants/Allconsultants";
import ConsultantProfile from "./pages/admin/consultants/modals/ConsultantProfile";
import SuspendConsultantModal from "./pages/admin/consultants/modals/SuspendConsultantModal";
import ChangeTierModal from "./pages/admin/consultants/modals/ChangeTierModal";
import ViewRankingModal from "./pages/admin/consultants/modals/ViewRankingModal";
import FlagForReviewModal from "./pages/admin/consultants/modals/FlagReviewModal";
import ForceAuditModal from "./pages/admin/consultants/modals/ForceAuditModal";
import InternalNoteModal from "./pages/admin/consultants/modals/InternalNoteModal";
import Pendingapprovals from "./pages/admin/consultants/Pendingapprovals";
import ConsultUpdateDetail from "./pages/admin/consultants/ConsultUpdateDetail";
import RequestChangesConsult from "./pages/admin/consultants/RequestChangeConsult";
import TierManagement from "./pages/admin/consultants/TierManagement";
import StorefrontApprovals from "./pages/admin/consultants/StorefrontApprovals";
import StorefrontApprovalDetail from "./pages/admin/consultants/storefront-approvals/StorefrontApprovalDetail";
import RankingControl from "./pages/admin/consultants/RankingControl";
import SuspendedConsultants from "./pages/admin/consultants/SuspendedConsultants";
import FlaggedConsultations from "./pages/admin/consultants/FlaggedConsultations";

// Vehicles
import Allvehicles from "./pages/admin/vehicles/Allvehicles";
import PendingApprovals from "./pages/admin/vehicles/PendingApprovals";
import SuspendedVehicles from "./pages/admin/vehicles/SuspendedVehicles";
import FlaggedListings from "./pages/admin/vehicles/FlaggedListings";
import FlaggedListingDetail from "./pages/admin/vehicles/flagged-listings/FlaggedListingDetail";
import SponsoredListings from "./pages/admin/vehicles/SponsoredListings";
import RequestChangeVehicle from "./pages/admin/vehicles/RequestChangeVehicle";
import CategoriesAttributes from "./pages/admin/vehicles/CategoriesAttributes";

import VehicleDetails from "./pages/admin/vehicles/marketplace/actions/VehicleDetails";
import SuspendListing from "./pages/admin/vehicles/marketplace/actions/SuspendListing";
import AdminEditOverride from "./pages/admin/vehicles/marketplace/actions/AdminEditOverride";
import RecalculateRank from "./pages/admin/vehicles/marketplace/actions/RecalculateRank";
import FeatureTemporarily from "./pages/admin/vehicles/marketplace/actions/FeatureTemporarily";
import RemoveBoost from "./pages/admin/vehicles/marketplace/actions/RemoveBoost";
import FlagForReview from "./pages/admin/vehicles/marketplace/actions/FlagForReview";
import ViewInquiries from "./pages/admin/vehicles/marketplace/actions/ViewInquiries";
import ViewInspection from "./pages/admin/vehicles/marketplace/actions/ViewInspection";
import AddInternalNote from "./pages/admin/vehicles/marketplace/actions/AddInternalNote";

// Buyers
import AllUsers from "./pages/admin/Buyers/AllUsers";
import BuyerProfile from "./pages/admin/Buyers/BuyerProfile";
import BuyerInquiries from "./pages/admin/Buyers/BuyerInquiries";
import BuyerSavedVehicles from "./pages/admin/Buyers/BuyerSavedVehicles";
import SuspendedUsers from "./pages/admin/Buyers/SuspendedUsers";
import SavedLists from "./pages/admin/Buyers/SavedLists";
import InquiryMonitoring from "./pages/admin/Buyers/InquiryMonitoring";

// Inspections
import InspectionRequests from "./pages/admin/inspections/InspectionRequests";
import AssignInspector from "./pages/admin/inspections/AssignInspector";
import ReportsReview from "./pages/admin/inspections/ReportsReview";
import Disputes from "./pages/admin/inspections/Disputes";


// Operations
import OperationsInquiryMonitoring from "./pages/admin/Operations/OperationsInquiryMonitoring";
import ChatOversight from "./pages/admin/Operations/ChatOversight";
import DisputeCenter from "./pages/admin/Operations/DisputeCenter";
import FraudAlerts from "./pages/admin/Operations/FraudAlerts";

// Inquiries
import Logs from "./pages/admin/inquiries/Logs";
import Abuse from "./pages/admin/inquiries/Abuse";

// PPC
import Campaigns from "./pages/admin/ppc/Campaigns";
import Featured from "./pages/admin/ppc/Featured";

// Others
import Badge from "./pages/admin/other/Badge";
import VehicleImages from "./pages/admin/other/vehicleimages";

// General
import Users from "./pages/admin/Users";
import UserDetails from "./pages/admin/users/UserDetails";
import Reviews from "./pages/admin/Reviews";
import Analytics from "./pages/admin/Analytics";
import MarketplaceMetrics from "./pages/admin/analytics/MarketplaceMetrics";
import ConversionFunnel from "./pages/admin/analytics/ConversionFunnel";
import RankingDistribution from "./pages/admin/analytics/RankingDistribution";
import TopConsultants from "./pages/admin/analytics/TopConsultants";
import CMS from "./pages/admin/CMS";
import Settings from "./pages/admin/Settings";

// Store theme
import StoreThemeList from "./pages/admin/store-theme/StoreThemeList";
import StoreThemeForm from "./pages/admin/store-theme/StoreThemeForm";
import StoreThemeView from "./pages/admin/store-theme/StoreThemeView";
import StoreThemeEdit from "./pages/admin/store-theme/StoreThemeEdit";

// Store template
import StoreTemplateList from "./pages/admin/store-template/StoreTemplateList";
import StoreTemplateForm from "./pages/admin/store-template/StoreTemplateForm";
import StoreTemplateView from "./pages/admin/store-template/StoreTemplateView";
import StoreTemplateEdit from "./pages/admin/store-template/StoreTemplateEdit";

// Storefront Manager
import StorefrontManager from "./pages/admin/storefront-manager/StorefrontManager";
import StoreThemeTemplate from "./pages/admin/storefront-manager/StoreThemeTemplate";
import StoreThemeTemplateDetails from "./pages/admin/storefront-manager/modals/StoreThemeTemplateDetails";
import StoreFrontManagerDetailScreen from "./pages/admin/storefront-manager/modals/StoreFrontManagerDetailScreen";
import StoreIconManager from "./pages/admin/storefront-manager/StoreIconManager";

// Subscriptions
import TierList from "./pages/admin/subscriptions/TierList";
import TierCreate from "./pages/admin/subscriptions/TierCreate";
import TierDetail from "./pages/admin/subscriptions/TierDetail";
import Consultants from "./pages/admin/subscriptions/Consultants";

// Leads
import Leads from "./pages/admin/Leads";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />

      <Route path="/admin" element={<AdminLayout />}>
        {/* Dashboard */}
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />

        {/* Leads */}
        <Route path="leads" element={<Leads />} />

        {/* Consultants */}
        <Route path="consultants/all" element={<Allconsultants />} />
        <Route path="consultants/profile/:id" element={<ConsultantProfile />} />
        <Route path="consultants/suspend/:id" element={<SuspendConsultantModal />} />
        <Route path="consultants/change-tier/:id" element={<ChangeTierModal />} />
        <Route path="consultants/ranking/:id" element={<ViewRankingModal />} />
        <Route path="consultants/flag-review/:id" element={<FlagForReviewModal />} />
        <Route path="consultants/force-audit/:id" element={<ForceAuditModal />} />
        <Route path="consultants/add-note/:id" element={<InternalNoteModal />} />

        {/* Pendingapprovals */}
        <Route path="consultants/pendingapprovals" element={<Pendingapprovals />} />
        <Route path="consultants/update-detail/:updateId" element={<ConsultUpdateDetail />} />
        <Route path="consultants/request-changes" element={<RequestChangesConsult />} />
        <Route path="consultants/tier-management" element={<TierManagement />} />
        <Route path="consultants/ranking-control" element={<RankingControl />} />
        <Route path="consultants/suspended" element={<SuspendedConsultants />} />
        <Route path="consultants/flagged-consultations" element={<FlaggedConsultations />} />

        {/* Vehicles */}
        <Route path="vehicles/all" element={<Allvehicles />} />
        <Route path="vehicles/pending-approvals" element={<PendingApprovals />} />
        <Route path="vehicles/request-changes" element={<RequestChangeVehicle />} />
        <Route path="vehicles/suspended" element={<SuspendedVehicles />} />
        <Route path="vehicles/flagged-listings" element={<FlaggedListings />} />
        <Route path="vehicles/flagged-listings/:id" element={<FlaggedListingDetail />} />
        <Route path="vehicles/sponsored-listings" element={<SponsoredListings />} />
        <Route path="vehicles/categories-attributes" element={<CategoriesAttributes />} />

        <Route path="vehicles/:id" element={<VehicleDetails />} />
        <Route path="vehicles/:id/suspend" element={<SuspendListing />} />
        <Route path="vehicles/:id/edit-override" element={<AdminEditOverride />} />
        <Route path="vehicles/:id/recalc-rank" element={<RecalculateRank />} />
        <Route path="vehicles/:id/feature" element={<FeatureTemporarily />} />
        <Route path="vehicles/:id/remove-boost" element={<RemoveBoost />} />
        <Route path="vehicles/:id/flag-review" element={<FlagForReview />} />
        <Route path="vehicles/:id/inquiries" element={<ViewInquiries />} />
        <Route path="vehicles/:id/inspection" element={<ViewInspection />} />
        <Route path="vehicles/:id/add-note" element={<AddInternalNote />} />

        {/* Buyers */}
        <Route path="buyers/all" element={<AllUsers />} />
        <Route path="buyers/profile" element={<BuyerProfile />} />
        <Route path="buyers/inquiries" element={<BuyerInquiries />} />
        <Route path="buyers/saved-vehicles" element={<BuyerSavedVehicles />} />
        <Route path="buyers/suspended-users" element={<SuspendedUsers />} />
        <Route path="buyers/saved-lists" element={<SavedLists />} />
        <Route path="buyers/inquiry-monitoring" element={<InquiryMonitoring />} />

        {/* Storefront Manager */}
        <Route path="storefront-manager/themes" element={<StorefrontManager />} />
        <Route path="storefront-manager/themes/:id" element={<StoreFrontManagerDetailScreen />} />
        <Route path="storefront-manager/approvals" element={<StorefrontApprovals />} />
        <Route path="storefront-manager/template" element={<StoreThemeTemplate />} />
        <Route path="storefront-manager/icon" element={<StoreIconManager />} />
        <Route path="storefront-manager/template/:id" element={<StoreThemeTemplateDetails />} />
        <Route path="storefront-manager/approvals/:id" element={<StorefrontApprovalDetail />} />

        {/* Inspections */}
        <Route path="inspections/requests" element={<InspectionRequests />} />
        <Route path="inspections/assign" element={<AssignInspector />} />
        <Route path="inspections/reports-review" element={<ReportsReview />} />
        <Route path="inspections/disputes" element={<Disputes />} />


        {/* Operations */}
        <Route path="operations/inquiry-monitoring" element={<OperationsInquiryMonitoring />} />
        <Route path="operations/chat-oversight" element={<ChatOversight />} />
        <Route path="operations/dispute-center" element={<DisputeCenter />} />
        <Route path="operations/fraud-alerts" element={<FraudAlerts />} />


        {/* Inquiries */}
        <Route path="inquiries/logs" element={<Logs />} />
        <Route path="inquiries/abuse" element={<Abuse />} />

        {/* Subscriptions */}
        <Route path="subscriptions/tiers" element={<TierList />} />
        <Route path="subscriptions/tiers/create" element={<TierCreate />} />
        <Route path="subscriptions/tiers/:id" element={<TierDetail />} />
        <Route path="subscriptions/consultants" element={<Consultants />} />

        {/* PPC */}
        <Route path="ppc/campaigns" element={<Campaigns />} />
        <Route path="ppc/featured" element={<Featured />} />

        {/* Other */}
        <Route path="other/badge" element={<Badge />} />
        <Route path="other/vehicleimages" element={<VehicleImages />} />

        {/* General */}
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="analytics" element={<Analytics />}>
          <Route index element={<Navigate to="marketplace" replace />} />
          <Route path="marketplace" element={<MarketplaceMetrics />} />
          <Route path="funnel" element={<ConversionFunnel />} />
          <Route path="ranking" element={<RankingDistribution />} />
          <Route path="consultants" element={<TopConsultants />} />
        </Route>
        <Route path="cms" element={<CMS />} />
        <Route path="settings" element={<Settings />} />

        {/* Store theme */}
        <Route path="store-theme" element={<StoreThemeList />} />
        <Route path="store-theme/create" element={<StoreThemeForm />} />
        <Route path="store-theme/view/:id" element={<StoreThemeView />} />
        <Route path="store-theme/edit/:id" element={<StoreThemeEdit />} />

        {/* Store template */}
        <Route path="store-template" element={<StoreTemplateList />} />
        <Route path="store-template/create" element={<StoreTemplateForm />} />
        <Route path="store-template/view/:id" element={<StoreTemplateView />} />
        <Route path="store-template/edit/:id" element={<StoreTemplateEdit />} />
      </Route>
    </Routes>
  );
};

export default App;