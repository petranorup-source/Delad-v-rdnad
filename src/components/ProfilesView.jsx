/* --- Profilhantering (ProfilesView) --- */
import React, { useState } from 'react';
import { ArrowLeft, Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { COLOR_SWATCHES } from '../data/mockData';

const PRIMARY_SWATCH_KEYS = ['pink', 'purple', 'amber', 'mint'];
const EXTRA_SWATCH_KEYS = ['sage', 'sand', 'sky', 'slate'];

export default function ProfilesView({
  guardians,
  childrenProfiles,
  activeUser,
  getGuardianColorKey,
  getChildColorKey,
  onUpdateGuardian,
  onUpdateChild,
  onDeleteChild,
  onAddChild,
  onBack,
}) {
  const [editingId, setEditingId] = useState('elsa');
  const [draftName, setDraftName] = useState(
    childrenProfiles.find((c) => c.id === 'elsa')?.name || ''
  );
  const [draftColor, setDraftColor] = useState(getChildColorKey('elsa'));
  const [showMoreColors, setShowMoreColors] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [newChildError, setNewChildError] = useState('');

  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildColor, setNewChildColor] = useState('mint');

  const myGuardian = guardians.find((g) => g.id === activeUser) || guardians[0];
  const otherGuardian = guardians.find((g) => g.id !== activeUser) || guardians[1];

  const startEdit = (profileId, currentName, currentColorKey) => {
    if (editingId === profileId) {
      setEditingId(null);
      setProfileError('');
      return;
    }
    setEditingId(profileId);
    setDraftName(currentName);
    setDraftColor(currentColorKey);
    setProfileError('');
    setShowMoreColors(EXTRA_SWATCH_KEYS.includes(currentColorKey));
  };

  const handleSaveGuardian = (guardianId) => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      setProfileError('Namnet kan inte vara tomt.');
      return;
    }
    setProfileError('');
    onUpdateGuardian(guardianId, trimmed, draftColor);
    setEditingId(null);
  };

  const handleSaveChild = (childId) => {
    const trimmed = draftName.trim();
    if (!trimmed) {
      setProfileError('Barnets namn kan inte vara tomt.');
      return;
    }
    setProfileError('');
    onUpdateChild(childId, trimmed, draftColor);
    setEditingId(null);
  };

  const handleCreateChild = (event) => {
    event.preventDefault();
    const trimmed = newChildName.trim();
    if (!trimmed) {
      setNewChildError('Ange ett namn för det nya barnet.');
      return;
    }
    setNewChildError('');
    onAddChild(trimmed, newChildColor);
    setNewChildName('');
    setNewChildColor('mint');
    setIsAddingChild(false);
  };

  const renderColorPicker = (selectedKey, onSelect) => {
    const visibleSwatches = showMoreColors
      ? COLOR_SWATCHES
      : COLOR_SWATCHES.filter((s) => PRIMARY_SWATCH_KEYS.includes(s.key));

    return (
      <div className="color-picker-row">
        <span className="profile-card-label">Färg:</span>
        {visibleSwatches.map((swatch) => {
          const isSelected = selectedKey === swatch.key;
          return (
            <button
              key={swatch.key}
              type="button"
              className={`color-swatch-btn ${isSelected ? 'is-selected' : ''}`}
              data-color={swatch.key}
              onClick={() => onSelect(swatch.key)}
              aria-label={`Välj färg ${swatch.label}`}
              aria-pressed={isSelected}
            >
              {isSelected ? <Check size={18} aria-hidden="true" /> : null}
            </button>
          );
        })}
        <button
          type="button"
          className="color-swatch-more"
          onClick={() => setShowMoreColors((prev) => !prev)}
          aria-label={showMoreColors ? 'Visa färre färger' : 'Visa fler färger'}
          aria-expanded={showMoreColors}
        />
      </div>
    );
  };

  return (
    <main className="subview-container" aria-label="Profiler">
      <div className="subview-header">
        <button
          type="button"
          className="icon-btn"
          onClick={onBack}
          aria-label="Tillbaka till kalender"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="subview-title">Profiler</h1>
      </div>

      <p className="profile-note">
        Färgval sparas lokalt för din egen vy ({myGuardian.name}) och påverkar inte den andra vårdnadshavarens färger.
      </p>

      {/* --- Sektion: Vårdnadshavare --- */}
      <section aria-label="Vårdnadshavare">
        <h2 className="profile-section-title">Vårdnadshavare</h2>
        <div className="profile-cards-stack">
          {[
            { roleLabel: 'Min profil', data: myGuardian },
            { roleLabel: 'Andra vårdnadshavaren', data: otherGuardian },
          ].map(({ roleLabel, data }) => {
            const isEditing = editingId === data.id;
            const colorKey = getGuardianColorKey(data.id);

            return (
              <div key={data.id} className="profile-card">
                <div className="profile-card-top">
                  <p className="profile-card-label">{roleLabel}</p>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => startEdit(data.id, data.name, colorKey)}
                    aria-label={`Redigera ${data.name}`}
                    aria-expanded={isEditing}
                  >
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                </div>

                <div className="profile-card-row">
                  <span className="child-avatar" data-color={colorKey} aria-hidden="true">
                    {data.initial}
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="text-input"
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      aria-label={`Namn för ${roleLabel}`}
                    />
                  ) : (
                    <div className="profile-name-box">{data.name}</div>
                  )}
                </div>

                {isEditing ? (
                  <>
                    {renderColorPicker(draftColor, setDraftColor)}
                    {profileError ? (
                      <p className="form-error" role="alert">
                        {profileError}
                      </p>
                    ) : null}
                    <div className="profile-edit-actions">
                      <button
                        type="button"
                        className="btn-outline-pill"
                        onClick={() => setEditingId(null)}
                      >
                        Avbryt
                      </button>
                      <button
                        type="button"
                        className="btn-primary-pill"
                        onClick={() => handleSaveGuardian(data.id)}
                      >
                        <Check size={16} aria-hidden="true" /> Spara
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* --- Sektion: Barn --- */}
      <section aria-label="Barn">
        <h2 className="profile-section-title">Barn</h2>
        <div className="profile-cards-stack">
          {childrenProfiles.map((child) => {
            const isEditing = editingId === child.id;
            const colorKey = getChildColorKey(child.id);

            return (
              <div key={child.id} className="profile-card">
                <div className="profile-card-top">
                  <p className="profile-card-label">Namn</p>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => startEdit(child.id, child.name, colorKey)}
                    aria-label={`Redigera ${child.name}`}
                    aria-expanded={isEditing}
                  >
                    <Pencil size={18} aria-hidden="true" />
                  </button>
                </div>

                <div className="profile-card-row">
                  <span className="child-avatar" data-color={colorKey} aria-hidden="true">
                    {child.initial}
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="text-input"
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      aria-label={`Namn för ${child.name}`}
                    />
                  ) : (
                    <div className="profile-name-box">{child.name}</div>
                  )}
                </div>

                {isEditing ? (
                  <>
                    {renderColorPicker(draftColor, setDraftColor)}
                    {profileError ? (
                      <p className="form-error" role="alert">
                        {profileError}
                      </p>
                    ) : null}
                    <div className="profile-edit-actions">
                      {childrenProfiles.length > 1 ? (
                        <button
                          type="button"
                          className="btn-outline-pill"
                          onClick={() => {
                            onDeleteChild(child.id);
                            setEditingId(null);
                          }}
                        >
                          <Trash2 size={15} aria-hidden="true" /> Radera profil
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn-primary-pill"
                        onClick={() => handleSaveChild(child.id)}
                      >
                        <Check size={15} aria-hidden="true" /> Spara
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}

          {isAddingChild ? (
            <form className="profile-card" onSubmit={handleCreateChild}>
              <p className="profile-card-label">Nytt barn</p>
              <input
                type="text"
                className="text-input"
                placeholder="Barnets namn"
                value={newChildName}
                onChange={(event) => setNewChildName(event.target.value)}
                aria-label="Barnets namn"
              />
              {renderColorPicker(newChildColor, setNewChildColor)}
              {newChildError ? (
                <p className="form-error" role="alert">
                  {newChildError}
                </p>
              ) : null}
              <div className="profile-edit-actions">
                <button
                  type="button"
                  className="btn-outline-pill"
                  onClick={() => setIsAddingChild(false)}
                >
                  Avbryt
                </button>
                <button type="submit" className="btn-primary-pill">
                  Spara
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </section>

      <div className="cta-row">
        <button
          type="button"
          className="secondary-pill-btn"
          onClick={() => setIsAddingChild(true)}
        >
          <Plus size={18} aria-hidden="true" />
          <span>Lägg till profil</span>
        </button>
      </div>
    </main>
  );
}
