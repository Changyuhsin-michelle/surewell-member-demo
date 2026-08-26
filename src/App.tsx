import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import CouponsPage from './pages/CouponsPage';
import MemberCardPage from './pages/MemberCardPage';
import WalletPage from './pages/WalletPage';
import TopUpPage from './pages/TopUpPage';
import StoredProductsPage from './pages/StoredProductsPage';
import TransactionsPage from './pages/TransactionsPage';
import NotificationsPage from './pages/NotificationsPage';
import AiAssistantPage from './pages/AiAssistantPage';
import MePage from './pages/MePage';
import PointsCenterPage from './pages/PointsCenterPage';
import MissionsPage from './pages/MissionsPage';
import MemberBenefitsPage from './pages/MemberBenefitsPage';
import SpendingInsightsPage from './pages/SpendingInsightsPage';
import CouponDetailPage from './pages/CouponDetailPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import ShoppingCreditPage from './pages/ShoppingCreditPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/coupons/:id" element={<CouponDetailPage />} />
        <Route path="/member-card" element={<MemberCardPage />} />
        <Route path="/member-benefits" element={<MemberBenefitsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/wallet/topup" element={<TopUpPage />} />
        <Route path="/wallet/shopping-credit" element={<ShoppingCreditPage />} />
        <Route path="/stored-products" element={<StoredProductsPage />} />
        <Route path="/points" element={<PointsCenterPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/spending-insights" element={<SpendingInsightsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/transactions/:id" element={<TransactionDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/ai" element={<AiAssistantPage />} />
        <Route path="/me" element={<MePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
