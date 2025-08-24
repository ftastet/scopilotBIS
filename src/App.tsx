import { useState } from 'react';
import ThemeToggle from './components/UI/ThemeToggle';

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary">Bouton primaire</button>
        <button className="btn btn-error">Bouton erreur</button>
        <div className="tooltip" data-tip="Info bouton">
          <button className="btn btn-secondary">Tooltip</button>
        </div>
        <button className="btn">
          Badge
          <span className="badge">Nouveau</span>
        </button>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Titre de la carte <span className="badge badge-secondary">Nouveau</span></h2>
          <p>Un petit texte dans la carte.</p>
        </div>
      </div>

      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Formulaire</h2>
          <label className="label">
            <span className="label-text">Nom</span>
          </label>
          <input type="text" placeholder="Votre nom" className="input input-bordered w-full" />
          <button className="btn btn-primary mt-4">Envoyer</button>
        </div>
      </div>

      <button className="btn" onClick={() => setModalOpen(true)}>Ouvrir la modale</button>
      <dialog className={`modal ${modalOpen ? 'modal-open' : ''}`} onClose={() => setModalOpen(false)}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Titre de la modale</h3>
          <p className="py-4">Contenu de la modale.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setModalOpen(false)}>Fermer</button>
          </div>
        </div>
      </dialog>

      <div role="tablist" className="tabs tabs-bordered">
        <a role="tab" className={`tab ${activeTab === 'tab1' ? 'tab-active' : ''}`} onClick={() => setActiveTab('tab1')}>
          Onglet 1
        </a>
        <a role="tab" className={`tab ${activeTab === 'tab2' ? 'tab-active' : ''}`} onClick={() => setActiveTab('tab2')}>
          Onglet 2
        </a>
      </div>
      <div>
        {activeTab === 'tab1' ? (
          <div className="p-4">Contenu du premier onglet.</div>
        ) : (
          <div className="p-4">Contenu du second onglet.</div>
        )}
      </div>

      <div className="alert alert-info">
        Ceci est une alerte d'information.
      </div>
    </div>
  );
};

export default App;
