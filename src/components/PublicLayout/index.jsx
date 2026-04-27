import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginDialog from "@/components/LoginDialog";
import routes from "@/constants/routes";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { set as setShop } from "@/store/slices/shopSlice";

const PublicLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);

  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  const handleLoginSuccess = (data) => {
    const { shopData, ...authData } = data || {};
    dispatch(login(authData));
    dispatch(setShop(shopData || {}));
    closeLogin();
    navigate(routes.clubStore, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementBar />
      <Header onSignIn={openLogin} />
      <Outlet context={{ openLogin }} />
      <Footer />
      <LoginDialog
        open={loginOpen}
        onClose={closeLogin}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default PublicLayout;
