/* --- Sidomeny (Drawer) --- */
import React, { useEffect } from 'react';
import { Bell, HelpCircle, LogOut, Settings, Users, X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function SideDrawer({
  isOpen,
  activePage,
  pendingCount,
  onClose,
  onNavigate,
  onLogout,
}) {
  const focusTrapRef = useFocusTrap(isOpen);
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { id: 'notifications', label: 'Notiser', icon: Bell, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'profiles', label: 'Profiler', icon: Users, badge: null },
    { id: 'settings', label: 'Inställningar', icon: Settings, badge: null },
    { id: 'help', label: 'Hjälp och feedback', icon: HelpCircle, badge: null },
  ];

  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        ref={focusTrapRef}
        className="side-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Huvudmeny"
      >
        {/* --- Menyns rubrik --- */}
        <div className="drawer-header">
          <h2 className="drawer-title">Meny</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Stäng meny"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* --- Navigationslänkar --- */}
        <nav className="drawer-nav" aria-label="Menyalternativ">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`drawer-item ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
              >
                <span className="drawer-item-left">
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </span>
                {item.badge ? (
                  <span className="drawer-count tabular-nums" aria-label={`${item.badge} olästa`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* --- Utloggning --- */}
        <div className="drawer-footer">
          <button
            type="button"
            className="drawer-item"
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            <span className="drawer-item-left">
              <LogOut size={20} aria-hidden="true" />
              <span>Logga ut</span>
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
}
