// src/components/common/NotificationPanel.tsx

const NotificationPanel = () => {
  return (
    <div>
      <h2>Panel de Notificaciones</h2>
      <ul>
        <li>Notificación 1: Has subido un nuevo contenido.</li>
        <li>Notificación 2: Un artista ha comprado tu contenido.</li>
        {/* Aquí puedes agregar más notificaciones dinámicamente */}
      </ul>
    </div>
  );
};

export { NotificationPanel };
