import React, { useRef, useState, useEffect } from 'react';
import { Download, Printer, ZoomIn, ZoomOut, Check, Palette, Sparkles, Copy, FileDown, Layers } from 'lucide-react';
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
  const [zoom, setZoom] = useState(0.85);
  const [exporting, setExporting] = useState(false);

  // Auto-detect optimal zoom
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setZoom(0.42);
      } else if (width < 768) {
        setZoom(0.55);
      } else if (width < 1200) {
        setZoom(0.72);
      } else {
        setZoom(0.85);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.08, 1.3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.08, 0.35));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('resume-document');
    if (!element) return;

    try {
      setExporting(true);
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${(resume.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_CareerMatch.pdf`;
      pdf.save(fileName);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
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
      <div className="p-3 sm:p-3.5 bg-surface-elevated border-b border-surface-border flex flex-wrap items-center justify-between gap-2.5 text-xs no-print">
        {/* Template Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          {[
            { id: 'modern-tech', label: 'Tech Pro' },
            { id: 'executive-minimal', label: 'Executive' },
            { id: 'creative-nordic', label: 'Nordic' },
            { id: 'compact-ats', label: 'ATS Direct' },
          ].map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
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
        <div className="flex items-center flex-wrap gap-2 justify-end w-full sm:w-auto">
          {/* Color swatches */}
          <div className="flex items-center gap-1.5 bg-surface-card px-2 py-1 rounded-xl border border-surface-border">
            <Palette className="w-3.5 h-3.5 text-surface-muted shrink-0" />
            {THEME_COLORS.map((c) => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => onUpdateTheme({ primaryColor: c.color })}
                style={{ backgroundColor: c.color }}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform hover:scale-125 ${
                  resume.theme?.primaryColor === c.color ? 'ring-2 ring-plum-900 ring-offset-2 ring-offset-surface-card scale-110' : ''
                }`}
              />
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-surface-card rounded-xl p-0.5 border border-surface-border">
            <button
              onClick={handleZoomOut}
              className="p-1 text-surface-muted hover:text-surface-text"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] font-mono text-surface-muted">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-surface-muted hover:text-surface-text"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-card hover:bg-surface-hover text-surface-text border border-surface-border font-semibold transition-all"
            title="Print Resume"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold shadow-subtle active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5 text-terracotta-300" />
            <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Preview Canvas Container */}
      <div className="flex-1 overflow-auto p-3 sm:p-6 flex justify-center items-start bg-surface-elevated/70">
        <div
          ref={previewRef}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            marginBottom: `${(1 - zoom) * 600}px`,
          }}
          className="shadow-lift rounded-sm"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
