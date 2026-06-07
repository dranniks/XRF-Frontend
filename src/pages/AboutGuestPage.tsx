export const AboutGuestPage = (): JSX.Element => {
  return (
    <section className="card">
      <h1 className="page-title">Гостевой режим XRF</h1>
      <p className="page-subtitle">
        Это нативная гостевая витрина эталонных услуг: доступен просмотр карточек, фильтрация по названию и переход в
        подробную карточку.
      </p>
      <p className="service-row">
        Для лабораторной 8 в этом режиме отключены авторизация и редактирование заявок: только чтение данных и
        изображения.
      </p>
    </section>
  );
};
