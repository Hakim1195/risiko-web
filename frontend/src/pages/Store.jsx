// Store Page Component for Risk Game
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import './Store.css';

const Store = () => {
  const [items, setItems] = useState([]);
  const [seasonPasses, setSeasonPasses] = useState([]);
  const [balance, setBalance] = useState(0);
  const [bonuses, setBonuses] = useState({});
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('items');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch store items
      const itemsResponse = await fetch(`${config.API_BASE_URL}/store/items`);
      const itemsData = await itemsResponse.json();
      if (itemsData.success) {
        setItems(itemsData.items);
      }

      // Fetch season passes
      const passesResponse = await fetch(`${config.API_BASE_URL}/store/season-passes`);
      const passesData = await passesResponse.json();
      if (passesData.success) {
        setSeasonPasses(passesData.seasonPasses);
      }

      // Fetch user balance
      const balanceResponse = await fetch(`${config.API_BASE_URL}/store/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const balanceData = await balanceResponse.json();
      if (balanceData.success) {
        setBalance(balanceData.balance);
      }

      // Fetch user bonuses
      const bonusesResponse = await fetch(`${config.API_BASE_URL}/store/bonuses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bonusesData = await bonusesResponse.json();
      if (bonusesData.success) {
        setBonuses(bonusesData.bonuses);
      }

      // Fetch purchase history
      const historyResponse = await fetch(`${config.API_BASE_URL}/store/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const historyData = await historyResponse.json();
      if (historyData.success) {
        setPurchases(historyData.history);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching store data:', err);
      setError('Failed to load store data. Please try again.');
      setLoading(false);
    }
  };

  const handlePurchaseItem = async (itemId, price) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.API_BASE_URL}/store/purchase/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId, quantity: 1 })
      });

      const data = await response.json();
      
      if (data.success) {
        setBalance(data.newBalance);
        fetchStoreData(); // Refresh data
        alert('Purchase successful!');
      } else {
        setError(data.message || 'Purchase failed');
      }
    } catch (err) {
      console.error('Error purchasing item:', err);
      setError('Failed to complete purchase. Please try again.');
    }
  };

  const handlePurchaseSeasonPass = async (seasonPassId, price) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.API_BASE_URL}/store/purchase/season-pass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ seasonPassId })
      });

      const data = await response.json();
      
      if (data.success) {
        setBalance(data.newBalance);
        fetchStoreData(); // Refresh data
        alert('Season pass purchased successfully!');
      } else {
        setError(data.message || 'Purchase failed');
      }
    } catch (err) {
      console.error('Error purchasing season pass:', err);
      setError('Failed to complete purchase. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="store-container">
        <div className="loading-spinner">Loading store...</div>
      </div>
    );
  }

  return (
    <div className="store-container">
      <div className="store-header">
        <h1>Game Store</h1>
        <div className="store-balance">
          <span className="balance-label">Your Balance:</span>
          <span className="balance-amount">{formatCurrency(balance)}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="store-tabs">
        <button 
          className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button 
          className={`tab-button ${activeTab === 'season-passes' ? 'active' : ''}`}
          onClick={() => setActiveTab('season-passes')}
        >
          Season Passes
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Purchase History
        </button>
      </div>

      <div className="store-content">
        {activeTab === 'items' && (
          <div className="items-grid">
            {items.map(item => (
              <div key={item.id} className="store-item-card">
                <div className="item-image">
                  <img 
                    src={item.image || '/placeholder-item.png'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-item.png';
                    }}
                  />
                </div>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-features">
                    {item.features && item.features.bonusArmies && (
                      <span className="feature-badge">+{item.features.bonusArmies} Armies</span>
                    )}
                    {item.features && item.features.cardMultiplier && (
                      <span className="feature-badge">x{item.features.cardMultiplier} Cards</span>
                    )}
                    {item.features && item.features.startingArmies && (
                      <span className="feature-badge">+{item.features.startingArmies} Start</span>
                    )}
                  </div>
                  <div className="item-price">{formatCurrency(item.price)}</div>
                  <button 
                    className="buy-button"
                    onClick={() => handlePurchaseItem(item.id, item.price)}
                    disabled={balance < item.price}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'season-passes' && (
          <div className="season-passes-grid">
            {seasonPasses.map(pass => (
              <div key={pass.id} className="season-pass-card">
                <div className="pass-tier">
                  <span className={`tier-badge tier-${pass.tier}`}>{pass.tier}</span>
                </div>
                <div className="pass-info">
                  <h3>{pass.name}</h3>
                  <p className="pass-description">{pass.description}</p>
                  <div className="pass-duration">
                    Duration: {pass.durationWeeks} weeks
                  </div>
                  <div className="pass-price">{formatCurrency(pass.price)}</div>
                  <button 
                    className="buy-pass-button"
                    onClick={() => handlePurchaseSeasonPass(pass.id, pass.price)}
                    disabled={balance < pass.price}
                  >
                    Buy Season Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="purchase-history">
            <h2>Purchase History</h2>
            {purchases.length === 0 ? (
              <p className="no-purchases">No purchases yet.</p>
            ) : (
              <div className="history-list">
                {purchases.map(purchase => (
                  <div key={purchase.id} className="history-item">
                    <div className="history-item-info">
                      <span className="item-name">{purchase.item?.name || 'Item'}</span>
                      <span className="purchase-date">
                        {new Date(purchase.purchaseDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="history-item-price">
                      {formatCurrency(purchase.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {Object.keys(bonuses).length > 0 && (
        <div className="active-bonuses">
          <h3>Active Bonuses</h3>
          <div className="bonuses-list">
            {bonuses.bonusArmies > 0 && (
              <div className="bonus-item">
                <span className="bonus-name">Bonus Armies</span>
                <span className="bonus-value">+{bonuses.bonusArmies}</span>
              </div>
            )}
            {bonuses.cardMultiplier > 1 && (
              <div className="bonus-item">
                <span className="bonus-name">Card Multiplier</span>
                <span className="bonus-value">x{bonuses.cardMultiplier}</span>
              </div>
            )}
            {bonuses.startingArmies > 0 && (
              <div className="bonus-item">
                <span className="bonus-name">Starting Armies</span>
                <span className="bonus-value">+{bonuses.startingArmies}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
