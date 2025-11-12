import React from 'react';

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  actions?: ModalAction[];
  width?: number | string;
  children?: React.ReactNode;
}

const modalStyles = `
.thesia-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,0.45);backdrop-filter:saturate(120%) blur(2px);display:flex;align-items:center;justify-content:center;z-index:1000}
.thesia-modal{background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.18);border:1px solid #e2e8f0;max-width:92vw;width:680px;display:flex;flex-direction:column;overflow:hidden}
.thesia-modal-header{padding:16px 20px;border-bottom:1px solid #e9eef5;display:flex;align-items:center;justify-content:space-between}
.thesia-modal-title{font-size:18px;font-weight:600;color:#0f172a;margin:0}
.thesia-modal-close{border:none;background:transparent;font-size:18px;cursor:pointer;color:#475569;border-radius:8px;padding:6px}
.thesia-modal-close:hover{background:#f1f5f9}
.thesia-modal-body{padding:20px}
.thesia-modal-footer{padding:14px 20px;border-top:1px solid #e9eef5;display:flex;gap:10px;justify-content:flex-end}
.btn{padding:10px 16px;border-radius:10px;border:1px solid transparent;cursor:pointer;font-weight:600;font-size:14px}
.btn:disabled{opacity:.6;cursor:not-allowed}
.btn-primary{background:#3b82f6;color:#fff;border-color:#3b82f6}
.btn-primary:hover:not(:disabled){background:#2563eb}
.btn-secondary{background:#f1f5f9;color:#0f172a;border-color:#e2e8f0}
.btn-secondary:hover:not(:disabled){background:#e2e8f0}
.btn-danger{background:#ef4444;color:#fff;border-color:#ef4444}
.btn-danger:hover:not(:disabled){background:#dc2626}
@media (max-width: 480px){.thesia-modal{width:96vw;border-radius:12px}}
`;

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, actions = [], width, children }) => {
  if (!isOpen) return null;
  return (
    <div className="thesia-modal-backdrop" onClick={onClose}>
      <div
        className="thesia-modal"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="thesia-modal-header">
          <h4 className="thesia-modal-title">{title}</h4>
          <button className="thesia-modal-close" onClick={onClose} aria-label="Cerrar">✖</button>
        </div>
        <div className="thesia-modal-body">{children}</div>
        <div className="thesia-modal-footer">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={a.onClick}
              className={`btn ${a.variant ? `btn-${a.variant}` : 'btn-secondary'}`}
              disabled={a.disabled}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
      <style>{modalStyles}</style>
    </div>
  );
};

export default Modal;
