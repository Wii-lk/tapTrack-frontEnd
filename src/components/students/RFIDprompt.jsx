import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import './rfid.css';

const RFIDPrompt = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center p-8 bg-gray-50 rounded-lg">
        
        {/* Animation Stage */}
        <div className="rfid-stage mb-6">
          
          {/* The Machine/Reader */}
          <div className="reader-machine">
            <div className="sensor-zone">
              <div className="pulse-ring"></div>
              <div className="wifi-icon">
                 {/* Simple RSS/NFC icon lines */}
                 <div className="wifi-line line-1"></div>
                 <div className="wifi-line line-2"></div>
                 <div className="wifi-line line-3"></div>
              </div>
            </div>
            <div className="reader-status-light"></div>
          </div>

          {/* The Hand & Card (SVG for better shape control) */}
          <div className="hand-wrapper">
            <svg 
              viewBox="0 0 200 200" 
              className="hand-svg" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* The Card */}
              <g className="card-group">
                <rect x="60" y="40" width="100" height="60" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                <rect x="70" y="55" width="15" height="10" rx="2" fill="#fbbf24" /> {/* Chip */}
                <rect x="60" y="80" width="100" height="10" fill="#cbd5e1" opacity="0.3" /> {/* Stripe */}
              </g>

              {/* The Hand holding the card */}
              <path 
                d="M140,90 
                   C140,90 130,80 110,80 
                   C90,80 80,90 80,100 
                   L80,120 
                   C80,140 100,160 120,160 
                   L200,160 
                   L200,200 
                   L200,90 
                   Z" 
                fill="#fca5a5" /* Skin tone */
                stroke="#ef4444" /* Outline tone */
                strokeWidth="2"
                className="hand-shape"
              />
              {/* Thumb over the card */}
              <ellipse cx="120" cy="95" rx="15" ry="10" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
            </svg>
          </div>

        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
          Tap to Scan
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Hold your card near the reader
        </p>

        <Button onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </Modal>
  );
};

export default RFIDPrompt;