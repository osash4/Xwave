import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../../contexts/BlockchainContext';
import { ContentUploader } from './ContentUploader';
import { RoyaltyDashboard } from './RoyaltyDashboard';
import { LicenseManager } from './LicenseManager';
import { ContentPreview } from './ContentPreview';
import { NotificationPanel } from '../common/NotificationPanel';
import { useTheme } from '../../contexts/ThemeContext';
import { RoyaltyChart } from './RoyaltyChart';

export function ArtistPortal() {
  const { account, contentManager, royaltyContract } = useBlockchain();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('upload');
  const [previewContent, setPreviewContent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [royaltyStats, setRoyaltyStats] = useState({
    total: 0,
    history: [],
    byContent: new Map()
  });

  useEffect(() => {
    if (account) {
      loadArtistData();
      setupNotifications();
    }
  }, [account]);

  async function loadArtistData() {
    const stats = await royaltyContract.getArtistStats(account);
    setRoyaltyStats(stats);
  }

  function setupNotifications() {
    royaltyContract.on('RoyaltyPaid', (event) => {
      if (event.artist === account) {
        addNotification('New royalty payment received', 'success');
      }
    });

    contentManager.on('ContentLicensed', (event) => {
      if (event.creator === account) {
        addNotification('New content license purchased', 'info');
      }
    });
  }

  function addNotification(message, type) {
    setNotifications(prev => [...prev, { message, type, id: Date.now() }]);
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Artist Portal</h1>
        <NotificationPanel notifications={notifications} />
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`${
              activeTab === 'upload'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Upload Content
          </button>
          <button
            onClick={() => setActiveTab('royalties')}
            className={`${
              activeTab === 'royalties'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Royalties
          </button>
          <button
            onClick={() => setActiveTab('licenses')}
            className={`${
              activeTab === 'licenses'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Licenses
          </button>
        </nav>
      </div>

      <div className="space-y-8">
        {activeTab === 'upload' && (
          <>
            <ContentUploader 
              onContentSelected={setPreviewContent}
              onUploadSuccess={() => {
                addNotification('Content uploaded successfully', 'success');
                setPreviewContent(null);
              }}
            />
            {previewContent && (
              <ContentPreview 
                content={previewContent}
                onClose={() => setPreviewContent(null)}
              />
            )}
          </>
        )}
        
        {activeTab === 'royalties' && (
          <div className="space-y-6">
            <RoyaltyDashboard stats={royaltyStats} />
            <RoyaltyChart data={royaltyStats.history} />
          </div>
        )}
        
        {activeTab === 'licenses' && (
          <LicenseManager
            onLicenseCreated={() => addNotification('License created', 'success')}
            onLicenseExpiring={(license) => addNotification(
              `License for ${license.contentId} expires soon`,
              'warning'
            )}
          />
        )}
      </div>
    </div>
  );
}