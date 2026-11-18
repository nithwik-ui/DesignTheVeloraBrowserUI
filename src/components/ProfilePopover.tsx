import React, { useState } from "react";
import { Check, Glasses, KeyRound, Pencil, Plus, RefreshCw, X } from "lucide-react";
import { ActiveFeatureModal, BrowserProfile } from "../types/velora";
import { ProfileAvatar } from "./ProfileAvatar";
import { OrbitLogo } from "./OrbitLogo";

interface ProfilePopoverProps {
  activeProfile: BrowserProfile;
  profiles: BrowserProfile[];
  incognitoMode: boolean;
  onSelectProfile: (profileId: string) => void;
  onUpdateActiveProfile: (updates: Partial<BrowserProfile>) => void;
  onAddProfile: (name: string, email: string, color: string) => void;
  onToggleIncognito: () => void;
  onOpenFeatureModal: (modal: ActiveFeatureModal) => void;
  onClose: () => void;
}

const AVATAR_COLORS = ["#2563EB", "#BE185D", "#EA580C", "#15803D", "#9333EA", "#0891B2"];

export const ProfilePopover: React.FC<ProfilePopoverProps> = ({
  activeProfile,
  profiles,
  incognitoMode,
  onSelectProfile,
  onUpdateActiveProfile,
  onAddProfile,
  onToggleIncognito,
  onOpenFeatureModal,
  onClose,
}) => {
  const [customising, setCustomising] = useState(false);
  const [addingProfile, setAddingProfile] = useState(false);
  const [editName, setEditName] = useState(activeProfile.name);
  const [editEmail, setEditEmail] = useState(activeProfile.email);
  const [editAvatarType, setEditAvatarType] = useState<BrowserProfile["avatarType"]>(
    activeProfile.avatarType,
  );

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newColor, setNewColor] = useState(AVATAR_COLORS[0]);

  const otherProfiles = profiles.filter((p) => p.id !== activeProfile.id);

  const handleSaveCustomise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onUpdateActiveProfile({
      name: editName.trim(),
      email: editEmail.trim() || activeProfile.email,
      avatarType: editAvatarType,
      initial: editName.trim().charAt(0).toUpperCase(),
    });
    setCustomising(false);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddProfile(
      newName.trim(),
      newEmail.trim() || `${newName.trim().toLowerCase().replace(/\s+/g, ".")}@velora.local`,
      newColor,
    );
    setNewName("");
    setNewEmail("");
    setAddingProfile(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Account and browser profiles"
      onClick={(e) => e.stopPropagation()}
      className="absolute top-[44px] right-10 w-[312px] rounded-[8px] border overflow-hidden z-50 select-none"
      style={{
        backgroundColor: "var(--v-popover)",
        borderColor: "var(--v-popover-border)",
        color: "var(--v-text)",
        boxShadow: "var(--v-shadow-popover)",
      }}
    >
      {/* Top Profile Header Card */}
      <div className="p-2.5">
        <div
          className="rounded-[8px] p-4 flex flex-col items-center text-center border"
          style={{
            backgroundColor: "var(--v-surface-subtle)",
            borderColor: "var(--v-popover-border)",
          }}
        >
          <ProfileAvatar profile={activeProfile} size={58} incognito={incognitoMode} />

          {incognitoMode ? (
            <div className="mt-2.5">
              <div className="text-[14px] font-semibold">Incognito Window</div>
              <div className="text-[11.5px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                History & cookies paused for this session
              </div>
            </div>
          ) : customising ? (
            <form onSubmit={handleSaveCustomise} className="w-full mt-3 space-y-2 text-left">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Profile name"
                className="w-full h-[30px] px-2.5 rounded-[6px] border bg-transparent text-[12px] outline-none"
                style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
              />
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-[30px] px-2.5 rounded-[6px] border bg-transparent text-[12px] outline-none"
                style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
              />
              <div className="flex items-center justify-between gap-1 pt-0.5">
                {(
                  [
                    ["starry-tower", "Starry"],
                    ["orbit", "Orbit"],
                    ["initial", "Initial"],
                  ] as const
                ).map(([kind, label]) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => setEditAvatarType(kind)}
                    className="flex-1 h-[24px] rounded-[6px] border text-[11px] font-medium"
                    style={{
                      borderColor: editAvatarType === kind ? "var(--v-accent)" : "var(--v-border)",
                      color: editAvatarType === kind ? "var(--v-accent)" : "var(--v-muted)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setCustomising(false)}
                  className="h-[26px] px-2.5 rounded-[6px] border text-[11px]"
                  style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[26px] px-2.5 rounded-[6px] text-[11px] font-medium text-white inline-flex items-center gap-1"
                  style={{ backgroundColor: "var(--v-accent)" }}
                >
                  <Check className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-2.5">
              <div className="text-[14.5px] font-semibold leading-snug">{activeProfile.name}</div>
              <div className="text-[12px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                {activeProfile.email}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Action Items */}
      <div className="px-1.5 pb-2 space-y-0.5 text-[12.5px]">
        <button
          type="button"
          onClick={() => {
            onOpenFeatureModal("passwords");
            onClose();
          }}
          className="w-full h-[34px] px-3 rounded-[6px] flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/6 transition-colors text-left"
        >
          <KeyRound className="w-4 h-4 shrink-0" style={{ color: "var(--v-muted)" }} />
          <span>Passwords and autofill</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenFeatureModal("account-manage");
            onClose();
          }}
          className="w-full h-[34px] px-3 rounded-[6px] flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/6 transition-colors text-left"
        >
          <OrbitLogo size={16} />
          <span>Manage your Velora Account</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditName(activeProfile.name);
            setEditEmail(activeProfile.email);
            setEditAvatarType(activeProfile.avatarType);
            setCustomising((c) => !c);
          }}
          className="w-full h-[34px] px-3 rounded-[6px] flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/6 transition-colors text-left"
        >
          <Pencil className="w-4 h-4 shrink-0" style={{ color: "var(--v-muted)" }} />
          <span>Customise profile</span>
        </button>

        <button
          type="button"
          onClick={() => onUpdateActiveProfile({ syncEnabled: !activeProfile.syncEnabled })}
          className="w-full h-[34px] px-3 rounded-[6px] flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/6 transition-colors text-left"
        >
          <span className="flex items-center gap-3">
            <RefreshCw
              className="w-4 h-4 shrink-0"
              style={{
                color: activeProfile.syncEnabled ? "var(--v-privacy)" : "var(--v-muted)",
              }}
            />
            <span>{activeProfile.syncEnabled ? "Sync is on" : "Sync is paused"}</span>
          </span>
          <span
            className="text-[10.5px] px-1.5 py-0.5 rounded-full font-mono-ui"
            style={{
              backgroundColor: activeProfile.syncEnabled
                ? "var(--v-privacy-soft)"
                : "var(--v-omnibox)",
              color: activeProfile.syncEnabled ? "var(--v-privacy)" : "var(--v-muted)",
            }}
          >
            {activeProfile.syncEnabled ? "Encrypted" : "Paused"}
          </span>
        </button>
      </div>

      {/* Divider + Other Profiles */}
      <div
        className="border-t pt-2.5 pb-2 px-1.5"
        style={{ borderColor: "var(--v-popover-border)" }}
      >
        <div className="px-3 pb-1.5 text-[12px] font-semibold">Other Velora profiles</div>

        <div className="max-h-[208px] overflow-y-auto space-y-0.5 pr-0.5">
          {otherProfiles.map((prof) => (
            <button
              key={prof.id}
              type="button"
              onClick={() => {
                onSelectProfile(prof.id);
                onClose();
              }}
              className="w-full h-[32px] px-3 rounded-[6px] flex items-center gap-2.5 text-[12.5px] hover:bg-black/5 dark:hover:bg-white/6 transition-colors text-left"
            >
              <ProfileAvatar profile={prof} size={20} />
              <span className="truncate">{prof.name}</span>
            </button>
          ))}
        </div>

        {/* Add New Profile Inline Form or Footer Buttons */}
        {addingProfile ? (
          <form
            onSubmit={handleCreateProfile}
            className="mt-2 mx-1.5 p-2.5 rounded-[8px] border space-y-2"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-popover-border)",
            }}
          >
            <div className="flex items-center justify-between text-[11.5px] font-semibold">
              <span>Add Profile</span>
              <button
                type="button"
                onClick={() => setAddingProfile(false)}
                style={{ color: "var(--v-muted)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Profile name"
              className="w-full h-[28px] px-2 rounded-[6px] border bg-transparent text-[12px] outline-none"
              style={{ borderColor: "var(--v-border)" }}
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email (optional)"
              className="w-full h-[28px] px-2 rounded-[6px] border bg-transparent text-[12px] outline-none"
              style={{ borderColor: "var(--v-border)" }}
            />
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1.5">
                {AVATAR_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setNewColor(hex)}
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      backgroundColor: hex,
                      borderColor: newColor === hex ? "var(--v-text)" : "transparent",
                    }}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="h-[26px] px-2.5 rounded-[6px] text-[11.5px] font-medium text-white"
                style={{ backgroundColor: "var(--v-accent)" }}
              >
                Create
              </button>
            </div>
          </form>
        ) : (
          <div
            className="mt-2 pt-1.5 border-t flex items-center gap-1 px-1.5"
            style={{ borderColor: "var(--v-popover-border)" }}
          >
            <button
              type="button"
              onClick={() => setAddingProfile(true)}
              className="flex-1 h-[30px] px-2.5 rounded-[6px] text-[12px] font-medium flex items-center justify-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/6"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleIncognito();
                onClose();
              }}
              className="flex-1 h-[30px] px-2.5 rounded-[6px] text-[12px] font-medium flex items-center justify-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/6"
            >
              <Glasses className="w-3.5 h-3.5" />
              <span>{incognitoMode ? "Exit Incognito" : "Guest / Private"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
