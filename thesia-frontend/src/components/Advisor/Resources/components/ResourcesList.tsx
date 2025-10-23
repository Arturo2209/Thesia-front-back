import React from 'react';
import type { AdvisorResource } from '../types/resource.types';
import '../styles/ResourcesList.styles.css';

const resources: AdvisorResource[] = [
  { id: 1, title: 'Guía de Metodología', description: 'Documento PDF sobre metodología de investigación.', url: '#' },
  { id: 2, title: 'Plantilla de Tesis', description: 'Archivo Word para estructurar la tesis.', url: '#' },
];

const ResourcesList: React.FC = () => {
  return (
    <div className="resources-list-container">
      <h2>Recursos y Guías</h2>
      <ul className="resources-list">
        {resources.map(resource => (
          <li key={resource.id} className="resource-item">
            <div className="resource-title">{resource.title}</div>
            <div className="resource-details">
              <span>{resource.description}</span>
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">Descargar</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourcesList;
