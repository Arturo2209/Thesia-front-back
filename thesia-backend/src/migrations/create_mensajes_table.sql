-- Migration: create mensajes table if not exists
CREATE TABLE IF NOT EXISTS mensajes (
  id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
  contenido TEXT NOT NULL,
  id_remitente INT NOT NULL,
  id_destinatario INT NOT NULL,
  tipo VARCHAR(50) NOT NULL DEFAULT 'texto',
  fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  leido TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (id_remitente) REFERENCES usuario(id_usuario),
  FOREIGN KEY (id_destinatario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for faster lookups
CREATE INDEX idx_mensajes_remitente ON mensajes(id_remitente);
CREATE INDEX idx_mensajes_destinatario ON mensajes(id_destinatario);
CREATE INDEX idx_mensajes_conversacion ON mensajes(id_remitente, id_destinatario);
