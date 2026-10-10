import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { useLanguage } from '../../context/LanguageContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { 
  FaQrcode, 
  FaCamera, 
  FaUpload, 
  FaSearch, 
  FaTimes, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaLightbulb,
  FaTv
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const QRScannerModal = ({ isOpen, onClose }) => {
  const { isTamil } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('camera'); // 'camera', 'upload', 'manual'
  const [manualToken, setManualToken] = useState('TVL-TKN-5407');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  // Stop camera when modal closes or tab changes
  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
    } else if (isOpen && activeTab === 'camera') {
      startCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setIsCameraActive(true);
        requestScan();
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError(
        isTamil 
          ? 'கேமரா அணுகல் கிடைக்கவில்லை. படத்தைப் பதிவேற்றவும் அல்லது டோக்கன் எண்ணை உள்ளிடவும்.' 
          : 'Unable to access camera. Please upload a QR image or enter token ID manually.'
      );
    }
  };

  const requestScan = () => {
    animFrameRef.current = requestAnimationFrame(scanVideoFrame);
  };

  const handleDecodedText = (rawText) => {
    if (!rawText) return;
    stopCamera();
    toast.success(isTamil ? 'QR குறியீடு கண்டறியப்பட்டது!' : 'QR Code Detected!');

    // Extract token ID from URL or raw text (e.g. http://localhost:5174/track/TVL-TKN-5407 or TVL-TKN-5407)
    let tokenId = rawText.trim();
    if (tokenId.includes('/track/')) {
      tokenId = tokenId.split('/track/')[1].split('?')[0].split('#')[0];
    } else if (tokenId.includes('TVL-SMARTCARE:')) {
      tokenId = tokenId.split('TVL-SMARTCARE:')[1].split(':')[0];
    } else if (tokenId.includes('TVL-TOKEN:')) {
      tokenId = tokenId.split('TVL-TOKEN:')[1];
    }

    if (onClose) onClose();
    navigate(`/track/${encodeURIComponent(tokenId)}`);
  };

  const scanVideoFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      requestScan();
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code && code.data) {
      handleDecodedText(code.data);
    } else {
      requestScan();
    }
  };

  // Handle Image Upload Scan
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        setScanning(false);
        if (code && code.data) {
          handleDecodedText(code.data);
        } else {
          toast.error(
            isTamil 
              ? 'இந்த படத்தில் QR குறியீட்டைப் படிக்க முடியவில்லை. தெளிவான படத்தை பதிவேற்றவும்.' 
              : 'Could not detect a valid QR code in this image. Please try another image.'
          );
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    if (onClose) onClose();
    navigate(`/track/${encodeURIComponent(manualToken.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        stopCamera();
        onClose();
      }}
      title={isTamil ? 'மருத்துவமனை டோக்கன் QR ஸ்கேனர்' : 'Hospital Token QR Scanner & Live Status'}
    >
      <div className="flex flex-col gap-4 p-2 text-left">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaCamera size={12} />
            <span>{isTamil ? 'நேரடி கேமரா' : 'Live Camera'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaUpload size={12} />
            <span>{isTamil ? 'படம் பதிவேற்றம்' : 'Upload QR'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaSearch size={12} />
            <span>{isTamil ? 'எண் உள்ளீடு' : 'Enter ID'}</span>
          </button>
        </div>

        {/* Tab 1: Live Camera Scanner */}
        {activeTab === 'camera' && (
          <div className="flex flex-col items-center">
            {cameraError ? (
              <div className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center space-y-2">
                <FaExclamationCircle className="mx-auto text-amber-600 text-xl" />
                <p className="font-semibold">{cameraError}</p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button size="sm" variant="primary" onClick={() => setActiveTab('upload')}>
                    <FaUpload /> {isTamil ? 'படம் பதிவேற்றவும்' : 'Upload QR Image'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab('manual')}>
                    <FaSearch /> {isTamil ? 'டோக்கன் எண்' : 'Enter Token ID'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-xs h-64 bg-slate-950 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-md flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Target Reticle */}
                <div className="absolute inset-8 border-2 border-emerald-400 rounded-2xl pointer-events-none flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  <div className="w-full h-0.5 bg-emerald-400 animate-pulse shadow-sm" />
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white font-bold py-1 px-2.5 rounded-lg text-center">
                  {isTamil ? 'QR குறியீட்டை கேமரா முன் காட்டவும்' : 'Point camera at OPD Token Pass QR'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload Image */}
        {activeTab === 'upload' && (
          <div className="flex flex-col items-center gap-3 py-4">
            <label className="w-full border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center">
              <FaUpload className="text-3xl text-sky-600 mb-2" />
              <span className="font-black text-xs text-slate-800">
                {isTamil ? 'QR குறியீடு ஸ்கிரீன்ஷாட் அல்லது படத்தை தேர்வு செய்க' : 'Select or Drop Token QR Image / Screenshot'}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP (Max 5MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {scanning && (
              <div className="text-xs font-bold text-sky-700 animate-pulse flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                <span>{isTamil ? 'படம் ஆராயப்படுகிறது...' : 'Decoding QR Code...'}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Manual Input */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-3 py-2">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                {isTamil ? 'டோக்கன் பாஸ் ஐடி (Pass ID அல்லது Token #)' : 'Token Pass ID (or Token Number)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="e.g. TVL-TKN-5407 or 40"
                  className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <Button type="submit" variant="primary" size="md">
                  <FaSearch /> {isTamil ? 'நிலை காண்க' : 'Track'}
                </Button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
              <FaLightbulb className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>{isTamil ? 'உதாரணம்:' : 'Demo Quick Links:'}</strong>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      if (onClose) onClose();
                      navigate('/track/TVL-TKN-5407');
                    }}
                    className="bg-white border border-sky-200 text-sky-700 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold hover:bg-sky-50 cursor-pointer"
                  >
                    TVL-TKN-5407 (Token #40 TVMCH)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onClose) onClose();
                      navigate('/track/TOKEN-8492');
                    }}
                    className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    TOKEN-8492 (Token #14)
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            {isTamil 
              ? 'QR குறியீட்டை ஸ்கேன் செய்தால் மருத்துவமனையின் நிகழ்நேர வரிசை நிலை திரையில் தோன்றும்.'
              : 'Scanning links directly to real-time hospital counter display & proximity alerts.'}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default QRScannerModal;
