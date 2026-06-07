import { useEffect } from "react";
import { Link } from "react-router-dom";

import { fetchCartIconThunk } from "../store/draftClaimSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { pluralizeServices } from "../utils/format";

export const GuestCartPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { cartServiceCount } = useAppSelector((state) => state.draftClaim);

  useEffect(() => {
    void dispatch(fetchCartIconThunk());
  }, [dispatch]);

  return (
    <section className="card">
      <h1 className="page-title">Корзина</h1>
      <p className="page-subtitle">Гостевой просмотр корзины без авторизации.</p>

      <p>
        Услуг в корзине: <strong>{cartServiceCount}</strong> {pluralizeServices(cartServiceCount)}
      </p>

      <p>
        <Link to="/services">Вернуться к списку услуг</Link>
      </p>
    </section>
  );
};
