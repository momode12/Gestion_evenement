import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function Dashboard() {
  const [nombreClients, setNombreClients] = useState(0);
  const [nombreUtilisateurs, setNombreUtilisateurs] = useState(0);
  const [nombreEntreesSorties, setNombreEntreesSorties] = useState(0);
  const [dataHistogramme, setDataHistogramme] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

 useEffect(() => {
  axios
    .get(`${API_URL}/api/entree_sortie/number`)
    .then((res) => {
      setNombreClients(res.data.nombre_clients);
      setNombreUtilisateurs(res.data.nombre_utilisateurs);
      setNombreEntreesSorties(res.data.nombre_entrees_sorties);

      const joursFixes = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

      // Créer un objet avec les jours fixes et valeurs à 0
      const histogrammeComplet = joursFixes.map((jour) => {
        const jourTrouve = res.data.histogramme.find((item) => item.jour === jour);
        return {
          jour: jour,
          entrees: jourTrouve ? jourTrouve.entrees : 0,
        };
      });

      setDataHistogramme(histogrammeComplet);
    })
    .catch((err) => {
      console.error("Erreur lors du chargement des données du dashboard :", err);
    });
}, []);


  return (
    <div className="mb-3">
      <div className="container-fluid p-3 bg-light mb-4 rounded">
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-md-4">
            <div className="d-flex justify-content-between align-items-center p-4 bg-white border border-secondary shadow-sm rounded">
              <i className="bi bi-people-fill fs-1 text-primary"></i>
              <div className="text-end">
                <span className="text-muted fw-semibold">Clients</span>
                <h2 className="mb-0">{nombreClients}</h2>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <div className="d-flex justify-content-between align-items-center p-4 bg-white border border-secondary shadow-sm rounded">
              <i className="bi bi-person-badge-fill fs-1 text-success"></i>
              <div className="text-end">
                <span className="text-muted fw-semibold">Utilisateurs</span>
                <h2 className="mb-0">{nombreUtilisateurs}</h2>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-4">
            <div className="d-flex justify-content-between align-items-center p-4 bg-white border border-secondary shadow-sm rounded">
              <i className="bi bi-box-arrow-in-right fs-1 text-warning"></i>
              <div className="text-end">
                <span className="text-muted fw-semibold">Entrées / Sorties</span>
                <h2 className="mb-0">{nombreEntreesSorties}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={dataHistogramme} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="entrees" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
