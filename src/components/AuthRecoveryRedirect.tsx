import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const isRecoveryUrl = (hash: string, search: string) =>
  hash.includes("type=recovery") || search.includes("type=recovery");

export default function AuthRecoveryRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, search, hash } = location;
    if (pathname === "/auth") return;
    if (!isRecoveryUrl(hash ?? "", search ?? "")) return;

    navigate({ pathname: "/auth", search, hash }, { replace: true });
  }, [location, navigate]);

  return null;
}
