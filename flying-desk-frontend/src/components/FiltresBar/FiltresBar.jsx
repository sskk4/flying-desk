import React from 'react';
import './FiltresBar.css';
import { Link} from "react-router-dom";
import arrowDownIcon from '../../assets/icons/arrow-down.svg';
import arrowUpIcon from '../../assets/icons/arrow-up.svg';

const FiltresBar = ({ isFiltersOpen, toggleFilters }) => {
  return (
    <div className="filtres-bar">
      {/* Sekcja filtres-bar-close, która jest widoczna początkowo */}
      {!isFiltersOpen && (
        <div className="filtres-bar-close">
          <div className="filtres-bar-left">
            <Link className="light-purple-button" to="/add/office"> <div>Place an ad</div> </Link>
            <div className="light-purple-button">Check best offers</div>
            <div className="light-purple-button">Personalized offer</div>
          </div>

          <div className="filtres-bar-right">
            <div className="filtres-bar-right-panel">
              Destination:
              <select>
                <option>Warsaw</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>

              {/* Przycisk strzałki, który otwiera filtry */}
              <div className="arrow-show" onClick={toggleFilters}>
                <img className="arrow" src={arrowDownIcon} alt="Down Arrow" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sekcja filtres-bar-open, która jest widoczna po kliknięciu na strzałkę */}
      {isFiltersOpen && (
        <div className="filtres-bar-open">
          <div className="filtres-bar-top">
            {/* Filtry */}
            {[...Array(6)].map((_, index) => (
              <div className="filtres-item" key={index}>
                <label>Destination:</label>
                <select>
                  <option>Warsaw</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            ))}
          </div>

          {/* Przycisk strzałki w górę, który zamyka filtry */}
          <div className="arrow-hide" onClick={toggleFilters}>
            <img className="arrow" src={arrowUpIcon} alt="Up Arrow" />
          </div>

          <div className="filtres-bar-bottom">
          <Link className="light-purple-button" to="/add/office"><div >Place an ad</div></Link>
            <div className="light-purple-button">Check best offers</div>
            <div className="light-purple-button">Personalized offer</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltresBar;
