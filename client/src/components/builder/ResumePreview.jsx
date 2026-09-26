import React, { useRef, useState, useEffect } from 'react';
import { Download, Printer, ZoomIn, ZoomOut, Check, Palette, Sparkles, Copy, FileDown, Layers, Maximize2 } from 'lucide-react';
import ModernTechTemplate from './templates/ModernTechTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CreativeNordicTemplate from './templates/CreativeNordicTemplate';
import CompactAtsTemplate from './templates/CompactAtsTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

const THEME_COLORS = [
  { name: 'Deep Plum', color: '#4A1525' },
  { name: 'Warm Terracotta', color: '#D95D39' },
  { name: 'Golden Amber', color: '#D9822B' },
  { name: 'Soft Sage', color: '#4E785C' },
  { name: 'Charcoal Slate', color: '#2B2628' },
  { name: 'Nordic Forest', color: '#1B4332' },
];

export default function ResumePreview({ resume, onUpdateTheme, onSelectTemplate }) {
  const previewRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(0.85);
  const [exporting, setExporting] = useState(false);

  // Auto-detect optimal zoom for all devices
  const calculateOptimalZoom = () => {
    const width = window.innerWidth;
    if (width < 380) {
      return 0.38;
    } else if (width < 480) {
      return 0.44;
    } else if (width < 640) {
      return 0.52;
    } else if (width < 768) {
      return 0.62;
    } else if (width < 1024) {
      return 0.70;
    } else if (width < 1440) {
      return 0.82;
    } else {
      return 0.90;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setZoom(calculateOptimalZoom());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.08, 1.3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.08, 0.3));
  const handleResetZoom = () => setZoom(calculateOptimalZoom());

  const handlePrint = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('resume-document');
    if (!element) return;

    try {
      setExporting(true);

      // Clone element to an isolated offscreen container to bypass parent CSS transforms/zoom
      const clone = element.cloneNode(true);
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.boxShadow = 'none';
      clone.style.width = '794px'; // Standard 96DPI A4 pixel width
      clone.style.maxWidth = '794px';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.backgroundColor = '#ffffff';

      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2, // Crisp 300dpi equivalent resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
      });

      // Cleanup cloned node
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add additional pages only if there is meaningful remaining content (> 5mm)
      while (heightLeft > 5) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const rawName = resume.personalInfo?.fullName || 'My';
      const cleanName = rawName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${cleanName}_Resume.pdf`;

      pdf.save(fileName);

      // Trigger celebratory confetti
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setExporting(false);
    }
  };

  const renderTemplate = () => {
    switch (resume.template) {
      case 'executive-minimal':
        return <ExecutiveTemplate resume={resume} />;
      case 'creative-nordic':
        return <CreativeNordicTemplate resume={resume} />;
      case 'compact-ats':
        return <CompactAtsTemplate resume={resume} />;
      case 'modern-tech':
      default:
        return <ModernTechTemplate resume={resume} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-card rounded-2xl border border-surface-border overflow-hidden shadow-card transition-colors duration-200">
      {/* Top Controls Toolbar */}
      <div className="p-3 sm:p-3.5 bg-surface-elevated border-b border-surface-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs no-print">
        {/* Template Selector Pills (Horizontal scroll on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full scrollbar-none">
          {[
            { id: 'modern-tech', label: 'Tech Pro' },
            { id: 'executive-minimal', label: 'Executive' },
            { id: 'creative-nordic', label: 'Nordic' },
            { id: 'compact-ats', label: 'ATS Direct' },
          ].map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all touch-target flex items-center justify-center ${
                resume.template === tpl.id
                  ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                  : 'bg-surface-card text-surface-muted hover:text-surface-text hover:bg-surface-hover border border-surface-border'
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>

        {/* Swatches, Zoom & PDF Action */}
        <div className="flex items-center flex-wrap gap-2 justify-between sm:justify-end w-full sm:w-auto">
          {/* Color swatches */}
          <div className="flex items-center gap-1.5 bg-surface-card px-2 py-1.5 rounded-xl border border-surface-border shrink-0">
            <Palette className="w-3.5 h-3.5 text-surface-muted shrink-0" />
            {THEME_COLORS.map((c) => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => onUpdateTheme({ primaryColor: c.color })}
                style={{ backgroundColor: c.color }}
                className={`w-4 h-4 rounded-full transition-transform hover:scale-125 ${
                  resume.theme?.primaryColor === c.color ? 'ring-2 ring-plum-900 ring-offset-2 ring-offset-surface-card scale-110' : ''
                }`}
              />
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-surface-card rounded-xl p-0.5 border border-surface-border shrink-0">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-surface-muted hover:text-surface-text"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-1.5 text-[11px] font-mono text-surface-muted hover:text-surface-text"
              title="Fit to Screen"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-surface-muted hover:text-surface-text"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-card hover:bg-surface-hover text-surface-text border border-surface-border font-semibold transition-all min-h-[36px]"
              title="Print Resume"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold shadow-subtle active:scale-[0.98] transition-all disabled:opacity-50 min-h-[36px]"
            >
              <FileDown className="w-3.5 h-3.5 text-terracotta-300" />
              <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Canvas Container (No horizontal overflow of page) */}
      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-4 lg:p-6 flex justify-center items-start bg-surface-elevated/70 resume-preview-scroll-container"
      >
        <div
          ref={previewRef}
          id="resume-preview-wrapper"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            marginBottom: `${Math.max(0, (1 - zoom) * 600)}px`,
          }}
          className="shadow-lift rounded-sm shrink-0"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
