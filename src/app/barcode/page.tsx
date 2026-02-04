'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Camera, Barcode, Check, X, Loader2, ShoppingBag, Plus, Search, Zap, Globe, AlertCircle, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { lookupBarcodeOpenFoodFacts } from '@/utils/barcodeApi';
import Quagga from '@ericblade/quagga2';

// Check if BarcodeDetector API is available (Chrome Android, Chrome Desktop - NOT iOS Safari)
const hasBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;

// BarcodeDetector type declaration
declare global {
  interface Window {
    BarcodeDetector: {
      new(options?: { formats: string[] }): BarcodeDetector;
      getSupportedFormats(): Promise<string[]>;
    };
  }
  interface BarcodeDetector {
    detect(image: ImageBitmapSource): Promise<{ rawValue: string; format: string }[]>;
  }
}

export default function BarcodeScannerPage() {
  const { addItemFromBarcode, searchProducts, addSmartPantryItem } = useApp();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetector | null>(null);
  const animationRef = useRef<number | null>(null);
  const isActiveRef = useRef<boolean>(false);
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [scanAttempts, setScanAttempts] = useState(0);
  const [barcodeOrientation, setBarcodeOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [result, setResult] = useState<{
    success: boolean;
    productName?: string;
    price?: number;
    error?: string;
    source?: string;
    brand?: string;
    imageUrl?: string;
  } | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchProducts>>([]);

  // Initialize BarcodeDetector if available
  useEffect(() => {
    const initDetector = async () => {
      if (hasBarcodeDetector) {
        try {
          const formats = await window.BarcodeDetector.getSupportedFormats();
          console.log('Supported barcode formats:', formats);
          
          detectorRef.current = new window.BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'].filter(f => formats.includes(f))
          });
        } catch (e) {
          console.log('BarcodeDetector init error:', e);
        }
      }
    };
    initDetector();
  }, []);

  // Handle barcode lookup
  const handleBarcodeLookup = useCallback(async (barcode: string) => {
    if (!barcode.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setResult(null);
    setStatusMessage('Looking up product...');
    
    // First try local store lookup
    const lookupResult = await addItemFromBarcode(barcode.trim());
    
    if (lookupResult.success) {
      setResult({
        success: true,
        productName: lookupResult.product?.name,
        price: lookupResult.product?.price,
        source: 'local',
      });
      setIsProcessing(false);
      setManualBarcode('');
      setStatusMessage('');
      setTimeout(() => setResult(null), 4000);
      return;
    }
    
    // If not in local store, try Open Food Facts API
    const apiResult = await lookupBarcodeOpenFoodFacts(barcode.trim());
    
    if (apiResult.found && apiResult.product) {
      // Add to pantry
      addSmartPantryItem(
        apiResult.product.brand 
          ? `${apiResult.product.brand} ${apiResult.product.name}`
          : apiResult.product.name,
        1,
        apiResult.product.quantity || 'item'
      );
      
      setResult({
        success: true,
        productName: apiResult.product.name,
        brand: apiResult.product.brand,
        imageUrl: apiResult.product.imageUrl,
        source: 'openfoodfacts',
      });
      setManualBarcode('');
    } else {
      setResult({
        success: false,
        error: `Barcode ${barcode} not found in database`,
      });
    }
    
    setIsProcessing(false);
    setStatusMessage('');
    setTimeout(() => setResult(null), 4000);
  }, [isProcessing, addItemFromBarcode, addSmartPantryItem]);

  // Barcode detection loop
  const detectBarcode = useCallback(async () => {
    if (!videoRef.current || !detectorRef.current || !isActiveRef.current) {
      return;
    }
    
    // Make sure video is playing and has dimensions
    if (videoRef.current.readyState < 2 || videoRef.current.videoWidth === 0) {
      animationRef.current = requestAnimationFrame(detectBarcode);
      return;
    }
    
    try {
      const barcodes = await detectorRef.current.detect(videoRef.current);
      
      if (barcodes.length > 0) {
        const code = barcodes[0].rawValue;
        
        if (code && code !== lastScannedCode) {
          console.log('Barcode detected:', code);
          
          // Vibrate on scan if supported
          if (navigator.vibrate) {
            navigator.vibrate(100);
          }
          
          setLastScannedCode(code);
          handleBarcodeLookup(code);
        }
      }
    } catch {
      // Detection failed, continue scanning
    }
    
    // Continue scanning loop
    if (isActiveRef.current) {
      animationRef.current = requestAnimationFrame(detectBarcode);
    }
  }, [lastScannedCode, handleBarcodeLookup]);

  // Start camera
  const startCamera = async () => {
    setCameraError(null);
    setStatusMessage('Starting camera...');
    
    try {
      // Request higher resolution for better barcode detection
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          // Request higher frame rate for smoother preview
          frameRate: { ideal: 30 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) return reject(new Error('No video element'));
          
          const handleLoaded = () => {
            videoRef.current?.play()
              .then(() => {
                resolve();
              })
              .catch(reject);
          };
          
          if (videoRef.current.readyState >= 2) {
            handleLoaded();
          } else {
            videoRef.current.onloadeddata = handleLoaded;
          }
          
          setTimeout(() => reject(new Error('Camera timeout')), 10000);
        });
        
        setIsScanning(true);
        isActiveRef.current = true;
        setHasCamera(true);
        setStatusMessage('Position barcode in frame, tap Scan Now');
        
        // Start auto-detection loop if native API available
        if (detectorRef.current) {
          animationRef.current = requestAnimationFrame(detectBarcode);
        }
      }
    } catch (err) {
      console.error('Camera error:', err);
      const message = err instanceof Error ? err.message : 'Could not access camera';
      setCameraError(message);
      setStatusMessage('');
      setHasCamera(false);
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    isActiveRef.current = false;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
    setLastScannedCode(null);
    setStatusMessage('');
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Reset last scanned after 3 seconds
  useEffect(() => {
    if (lastScannedCode) {
      const timer = setTimeout(() => setLastScannedCode(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastScannedCode]);

  // Manual scan - capture frame and detect (works on ALL browsers including iOS)
  const manualScan = async () => {
    if (!videoRef.current) {
      setStatusMessage('Camera not ready');
      return;
    }
    
    setScanAttempts(prev => prev + 1);
    setStatusMessage('Scanning...');
    
    try {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      
      // Debug: log video dimensions
      console.log('Video dimensions:', videoWidth, 'x', videoHeight);
      
      if (!videoWidth || !videoHeight) {
        setStatusMessage('Camera not ready - try again');
        return;
      }
      
      // Create a canvas to capture the video frame
      const canvas = document.createElement('canvas');
      
      // Use full video frame for better detection
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setStatusMessage('Canvas error');
        return;
      }
      
      // Draw full video frame
      ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
      
      // Try native BarcodeDetector first (Chrome, Safari macOS)
      if (detectorRef.current) {
        try {
          const barcodes = await detectorRef.current.detect(canvas);
          
          if (barcodes.length > 0) {
            const code = barcodes[0].rawValue;
            console.log('Native barcode found:', code);
            
            if (navigator.vibrate) {
              navigator.vibrate(100);
            }
            
            setLastScannedCode(code);
            setStatusMessage('Found: ' + code);
            handleBarcodeLookup(code);
            return;
          }
        } catch {
          console.log('Native detection failed, trying Quagga');
        }
      }
      
      // Fallback to Quagga (works on iOS Safari and all browsers)
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      console.log('Image data URL length:', imageDataUrl.length);
      
      // Try with different Quagga settings sequentially
      const attemptQuaggaScan = (patchSize: string): Promise<string | null> => {
        return new Promise((resolve) => {
          Quagga.decodeSingle({
            src: imageDataUrl,
            numOfWorkers: 0,
            locate: true,
            locator: {
              patchSize: patchSize as 'x-small' | 'small' | 'medium' | 'large' | 'x-large',
              halfSample: true
            },
            decoder: {
              readers: [
                'ean_reader', 
                'ean_8_reader', 
                'upc_reader', 
                'upc_e_reader',
                'code_128_reader'
              ]
            }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }, (result: any) => {
            if (result?.codeResult?.code) {
              console.log(`Quagga found with ${patchSize}:`, result.codeResult.code);
              resolve(result.codeResult.code);
            } else {
              console.log(`Quagga ${patchSize}: no barcode found`);
              resolve(null);
            }
          });
        });
      };
      
      // Try different patch sizes
      let code = await attemptQuaggaScan('large');
      if (!code) code = await attemptQuaggaScan('medium');
      if (!code) code = await attemptQuaggaScan('small');
      if (!code) code = await attemptQuaggaScan('x-small');
      
      if (code) {
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
        
        setLastScannedCode(code);
        setStatusMessage('Found: ' + code);
        handleBarcodeLookup(code);
      } else {
        setStatusMessage(`No barcode detected. Tips: hold steady, good lighting, barcode fills frame`);
        setTimeout(() => {
          if (isScanning) setStatusMessage('Position barcode in frame, tap Scan Now');
        }, 3000);
      }
      
    } catch (err) {
      console.error('Scan error:', err);
      setStatusMessage('Scan failed - try manual entry');
    }
  };

  // Search products
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = searchProducts(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addProductToPantry = (product: ReturnType<typeof searchProducts>[0]) => {
    addSmartPantryItem(product.name, 1, product.unit);
    setResult({
      success: true,
      productName: product.name,
      price: product.price,
      source: 'store',
    });
    setSearchQuery('');
    setSearchResults([]);
    setTimeout(() => setResult(null), 3000);
  };

  return (
    <div className="min-h-screen pb-24 bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-sm border-b border-stone-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/pantry" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </Link>
          <h1 className="font-display text-lg font-semibold text-stone-800">
            Barcode Scanner
          </h1>
          <div className="w-10" />
        </div>
        
        {/* Mode Toggle */}
        <div className="flex gap-2 px-4 pb-3">
          <button
            onClick={() => setSearchMode(false)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              !searchMode
                ? 'bg-sage-600 text-white'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Scan
          </button>
          <button
            onClick={() => setSearchMode(true)}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              searchMode
                ? 'bg-sage-600 text-white'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Search
          </button>
        </div>
      </header>
      
      {/* Result Toast */}
      {result && (
        <div className={`fixed top-24 left-4 right-4 z-50 p-4 rounded-2xl shadow-lg animate-slide-up ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              result.success ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {result.success ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              {result.success ? (
                <>
                  <p className="font-medium text-green-800">Added to Pantry!</p>
                  <p className="text-sm text-green-600">
                    {result.brand && <span className="font-medium">{result.brand} </span>}
                    {result.productName}
                    {result.price && <span className="ml-2 text-green-500">${result.price.toFixed(2)}</span>}
                    {result.source && (
                      <span className="ml-2 inline-flex items-center text-xs">
                        {result.source === 'openfoodfacts' && <Globe className="w-3 h-3 mr-1" />}
                        {result.source === 'openfoodfacts' ? 'Open Food Facts' : 'Local Store'}
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-red-800">Product not found</p>
                  <p className="text-sm text-red-600">{result.error}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {!searchMode ? (
        // Barcode Scanner Mode
        <div className="px-4 py-6 space-y-6">
          {/* Camera View */}
          {hasCamera && (
            <div className="relative">
              <div 
                ref={scannerContainerRef}
                className="aspect-[4/3] bg-stone-900 rounded-2xl overflow-hidden relative scanner-container"
              >
                {/* Video element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  style={{ display: isScanning ? 'block' : 'none' }}
                />
                
                {/* Placeholder when not scanning */}
                {!isScanning && (
                  <button
                    onClick={startCamera}
                    className="absolute inset-0 flex flex-col items-center justify-center text-white hover:bg-white/5 transition-colors z-10"
                  >
                    <Camera className="w-16 h-16 mb-3 opacity-50" />
                    <p className="text-lg font-medium">Tap to Start Camera</p>
                    <p className="text-sm opacity-75 mt-1">
                      {hasBarcodeDetector ? 'Native + Quagga fallback' : 'Quagga scanner'}
                    </p>
                  </button>
                )}
                
                {/* Scan overlay - tap to scan */}
                {isScanning && (
                  <button
                    onClick={manualScan}
                    className="absolute inset-0 flex items-center justify-center z-20"
                  >
                    <div className={`border-2 border-white/50 rounded-lg relative ${
                      barcodeOrientation === 'horizontal' 
                        ? 'w-3/4 h-1/3' 
                        : 'w-1/3 h-3/4'
                    }`}>
                      {/* Scan line */}
                      {barcodeOrientation === 'horizontal' ? (
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-sage-400 animate-pulse" />
                      ) : (
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-sage-400 animate-pulse" />
                      )}
                      {/* Corner markers */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sage-400 rounded-tl" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sage-400 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sage-400 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sage-400 rounded-br" />
                      <div className="absolute -bottom-8 left-0 right-0 text-center">
                        <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">Tap to scan</span>
                      </div>
                    </div>
                  </button>
                )}
                
                {/* Orientation toggle */}
                {isScanning && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBarcodeOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
                    }}
                    className="absolute top-3 right-3 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="text-xs">{barcodeOrientation === 'horizontal' ? 'Vertical' : 'Horizontal'}</span>
                  </button>
                )}
                
                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                    <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-sage-600" />
                      <span className="font-medium text-stone-700">Looking up product...</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Camera controls */}
              <div className="mt-4 flex gap-3">
                {!isScanning ? (
                  <button
                    onClick={startCamera}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Start Scanner
                  </button>
                ) : (
                  <>
                    <button
                      onClick={manualScan}
                      disabled={isProcessing}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Scan Now
                    </button>
                    <button
                      onClick={stopCamera}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Stop
                    </button>
                  </>
                )}
              </div>
              
              {/* Status message */}
              {statusMessage && (
                <div className="mt-2 flex items-center justify-center gap-2 text-sage-600">
                  {isScanning && <Zap className="w-4 h-4" />}
                  <span className="text-sm font-medium">{statusMessage}</span>
                </div>
              )}
              
              {/* Camera error */}
              {cameraError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Camera Error</p>
                    <p className="text-xs text-red-600">{cameraError}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Manual Entry */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            <h3 className="font-medium text-stone-800 mb-3 flex items-center gap-2">
              <Barcode className="w-5 h-5 text-stone-400" />
              Enter Barcode Manually
            </h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeLookup(manualBarcode)}
                placeholder="Enter barcode number..."
                className="input flex-1"
              />
              <button
                onClick={() => handleBarcodeLookup(manualBarcode)}
                disabled={isProcessing || !manualBarcode.trim()}
                className="btn-primary px-4"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>
            
            <p className="text-xs text-stone-400 mt-2">
              Type the UPC/EAN barcode number from the product
            </p>
          </div>
          
          {/* Scanner Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-stone-800">Barcode Scanner</h4>
                {!hasBarcodeDetector && isScanning && (
                  <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs font-medium text-amber-800">📱 iOS Scanning Tips:</p>
                    <ul className="text-xs text-amber-700 mt-1 space-y-0.5">
                      <li>• Hold phone 4-6 inches from barcode</li>
                      <li>• Ensure good lighting (no shadows)</li>
                      <li>• Keep phone steady when tapping Scan</li>
                      <li>• Barcode should fill most of the frame</li>
                    </ul>
                  </div>
                )}
                <div className="mt-2 text-xs space-y-1">
                  <p className={hasBarcodeDetector ? 'text-green-600' : 'text-amber-600'}>
                    {hasBarcodeDetector ? '✓ Native scanner available' : '⚠ Using Quagga fallback (tap Scan Now)'}
                  </p>
                  {isScanning && <p className="text-blue-600">📷 Camera active</p>}
                  {scanAttempts > 0 && <p className="text-stone-500">Scan attempts: {scanAttempts}</p>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Test Barcodes */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            <h4 className="font-medium text-stone-700 mb-3">Try These Barcodes</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: '5000112637939', name: 'Coca-Cola' },
                { code: '7622210449283', name: 'Oreo' },
                { code: '5010029200034', name: "McVitie's" },
                { code: '8076809513388', name: 'Barilla Pasta' },
              ].map(({ code, name }) => (
                <button
                  key={code}
                  onClick={() => {
                    setManualBarcode(code);
                    handleBarcodeLookup(code);
                  }}
                  disabled={isProcessing}
                  className="text-left p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                >
                  <p className="text-xs font-mono text-stone-500">{code}</p>
                  <p className="text-sm font-medium text-stone-700">{name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Search Products Mode
        <div className="px-4 py-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for products..."
              className="input pl-12"
              autoFocus
            />
          </div>
          
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProductToPantry(product)}
                  className="w-full card flex items-center gap-3 hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-sage-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-stone-800">{product.name}</p>
                    <p className="text-sm text-stone-500">
                      ${product.price.toFixed(2)} • {product.category}
                    </p>
                  </div>
                  <Plus className="w-5 h-5 text-sage-600" />
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">No products found</p>
              <p className="text-stone-400 text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Search for products</p>
              <p className="text-stone-400 text-sm mt-1">Type at least 2 characters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
