import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, GripVertical, Image as ImageIcon, Clock, Type, 
  Download, FileText, FileCode, Settings, Calendar,
  CheckCircle2, Layout, PlusCircle, GripHorizontal, Save, Share2, Shield
} from 'lucide-react';
import { RundownItem } from '../types';
import { Reorder } from 'motion/react';
import { firestoreSave, firestoreGetDoc } from '../lib/firebase';
import { db } from '../lib/firebase-sdk';
import { doc, onSnapshot, updateDoc, setDoc, deleteField } from 'firebase/firestore';

interface RundownEditorProps {
  projectData?: {
    id?: string;           // ← ada ID jika edit dari existing
    title?: string;
    category?: string;
    date?: string;
    date?: string;
    time?: string;
    template?: string;
    customColumns?: string[];
  };
  currentUser?: { name: string; email: string } | null;
  onSaved?: () => void;
}

export default function RundownEditor({ projectData, currentUser, onSaved }: RundownEditorProps) {
  const isEditing = !!projectData?.id;
  const initialTitle = projectData?.title || 'Untitled Project';

  const [items, setItems] = useState<RundownItem[]>([]);
  const [activeTab, setActiveTab] = useState<'edit' | 'visual' | 'settings'>('edit');
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [rundownId] = useState<string>(
    projectData?.id || `${(projectData?.title || 'rundown').toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
  );
  
  const [eventDate, setEventDate] = useState(
    projectData?.date || new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  );
  const [eventLocation, setEventLocation] = useState('Pusat Koordinasi Acara');
  
  const [columns, setColumns] = useState([
    { id: 'time',     label: 'Waktu',              visible: true, locked: true  },
    { id: 'title',    label: 'Kegiatan',           visible: true, locked: true  },
    { id: 'duration', label: 'Durasi',             visible: true, locked: true  },
    { id: 'pic',      label: 'Keterangan / PIC',   visible: true, locked: false },
  ]);

  const [activeUsers, setActiveUsers] = useState<any>({});
  const [projectOwner, setProjectOwner] = useState<string | null>(null);
  const [focusedCell, setFocusedCell] = useState<{ id: string, field: string } | null>(null);

  // Refs to prevent sync loops and overwriting active typing
  const itemsRef = useRef(items);
  const columnsRef = useRef(columns);
  const dateRef = useRef(eventDate);
  const locRef = useRef(eventLocation);
  const focusedCellRef = useRef(focusedCell);

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { columnsRef.current = columns; }, [columns]);
  useEffect(() => { dateRef.current = eventDate; }, [eventDate]);
  useEffect(() => { locRef.current = eventLocation; }, [eventLocation]);
  useEffect(() => { focusedCellRef.current = focusedCell; }, [focusedCell]);

  // ── Presence Tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!rundownId || !currentUser?.email) return;

    const presenceRef = doc(db, 'rundowns', rundownId);
    const updatePresence = () => {
      updateDoc(presenceRef, {
        [`presence.${currentUser.email.replace(/\./g, '_')}`]: {
          name: currentUser.name,
          lastActive: new Date().toISOString(),
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        }
      }).catch(() => {
        setDoc(presenceRef, { presence: {
          [currentUser.email.replace(/\./g, '_')]: {
            name: currentUser.name,
            lastActive: new Date().toISOString(),
            color: '#' + Math.floor(Math.random()*16777215).toString(16)
          }
        }}, { merge: true });
      });
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000); // Heartbeat every 30s
    return () => clearInterval(interval);
  }, [rundownId, currentUser]);

  // ── Real-time Sync (onSnapshot) ──────────────────────────────────────────────
  useEffect(() => {
    if (!rundownId) return;

    const docRef = doc(db, 'rundowns', rundownId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();
      if (data.authorEmail) setProjectOwner(data.authorEmail);

      // Update Presence
      if (data.presence) {
        const now = new Date().getTime();
        const active = Object.entries(data.presence).reduce((acc: any, [email, info]: [string, any]) => {
          const lastSeen = new Date(info.lastActive).getTime();
          if (now - lastSeen < 120000) acc[email] = info;
          return acc;
        }, {});
        setActiveUsers(active);
      }

      // Sync Content - Only if not focused on the specific field
      if (data.items) {
        const remoteItems = JSON.parse(data.items);
        const localItemsJson = JSON.stringify(itemsRef.current);
        const remoteItemsJson = JSON.stringify(remoteItems);

        if (remoteItemsJson !== localItemsJson) {
          // If user is focused on a cell, we merge remote data but keep the focused cell's value
          if (focusedCellRef.current) {
            const merged = remoteItems.map((rItem: any) => {
              const lItem = itemsRef.current.find(l => l.id === rItem.id);
              if (rItem.id === focusedCellRef.current?.id && lItem) {
                return { ...rItem, [focusedCellRef.current.field]: lItem[focusedCellRef.current.field] };
              }
              return rItem;
            });
            setItems(merged);
          } else {
            setItems(remoteItems);
          }
        }
      }
      
      if (data.date && data.date !== dateRef.current && !focusedCellRef.current) setEventDate(data.date);
      if (data.location && data.location !== locRef.current && !focusedCellRef.current) setEventLocation(data.location);
      if (data.columns) {
        const remoteCols = JSON.parse(data.columns);
        if (JSON.stringify(remoteCols) !== JSON.stringify(columnsRef.current)) setColumns(remoteCols);
      }
    });

    return () => unsubscribe();
  }, [rundownId]);

  // ── Auto-Save (Debounced) ───────────────────────────────────────────────────
  useEffect(() => {
    if (!rundownId || items.length === 0) return;

    const timer = setTimeout(() => {
      const docRef = doc(db, 'rundowns', rundownId);
      updateDoc(docRef, {
        items: JSON.stringify(items),
        columns: JSON.stringify(columns),
        date: eventDate,
        location: eventLocation,
        updatedAt: new Date().toISOString()
      }).catch(err => console.error("Auto-save failed", err));
    }, 1500);

    return () => clearTimeout(timer);
  }, [items, columns, eventDate, eventLocation, rundownId]);

  // ── Custom Column Initialization (for NEW projects) ─────────────────────────
  useEffect(() => {
    if (isEditing || !projectData) return;
    
    if (projectData.customColumns && projectData.customColumns.length > 0) {
      const cols = projectData.customColumns.map(label => {
        let id = '';
        if (label === 'Waktu') id = 'time';
        else if (label === 'Kegiatan') id = 'title';
        else if (label === 'Durasi') id = 'duration';
        else id = label.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substring(2,7);

        return {
          id,
          label,
          visible: true,
          locked: ['time', 'title', 'duration'].includes(id)
        };
      });
      setColumns(cols);
    }

    // ── Template Item Initialization ──────────────────────────────────────────
    if (projectData.template) {
      let initialItems: RundownItem[] = [];
      const baseTime = projectData.time || '08:00';
      const [h, m] = baseTime.split(':').map(Number);
      
      const createItem = (title: string, duration: number, startMinOffset: number) => {
        const startMin = h * 60 + m + startMinOffset;
        const endMin = startMin + duration;
        const startTime = `${String(Math.floor(startMin / 60) % 24).padStart(2,'0')}:${String(startMin % 60).padStart(2,'0')}`;
        const endTime = `${String(Math.floor(endMin / 60) % 24).padStart(2,'0')}:${String(endMin % 60).padStart(2,'0')}`;
        return {
          id: Math.random().toString(36).substr(2, 9),
          startTime,
          title,
          duration,
          endTime
        };
      };

      if (projectData.template === 'Professional') {
        initialItems = [
          createItem('Briefing Panitia & Persiapan', 30, 0),
          createItem('Registrasi & Pembukaan Pintu', 60, 30),
          createItem('Opening Ceremony & Sambutan', 30, 90),
          createItem('Sesi Materi / Acara Utama 1', 90, 120),
          createItem('Coffee Break / Istirahat', 30, 210),
          createItem('Sesi Materi / Acara Utama 2', 90, 240),
          createItem('Penutupan & Kesimpulan', 30, 330)
        ];
      } else if (projectData.template === 'Quick Event') {
        initialItems = [
          createItem('Persiapan & Cek Sound', 15, 0),
          createItem('Sambutan Pembuka', 10, 15),
          createItem('Inti Acara / Presentasi', 45, 25),
          createItem('Tanya Jawab (Q&A)', 15, 70),
          createItem('Penutup', 5, 85)
        ];
      } else if (projectData.template === 'Global Summit') {
        initialItems = [
          createItem('VIP Arrival & Security Check', 45, 0),
          createItem('Keynote Speech (Live Broadcast)', 60, 45),
          createItem('Panel Discussion 1', 60, 105),
          createItem('Networking Lunch', 90, 165),
          createItem('Breakout Sessions / Masterclass', 120, 255),
          createItem('Closing Remarks', 30, 375)
        ];
      } else {
        // Blank
        initialItems = [createItem('Persiapan', 15, 0)];
      }

      setItems(initialItems);
    }
  }, [projectData, isEditing]);

  // ── Save (UPSERT — selalu pakai ID yang sama) ─────────────────────────────────
  const saveRundown = async () => {
    setSaving(true);
    try {
      await firestoreSave('rundowns', rundownId, {
        title:       initialTitle,
        items:       JSON.stringify(items),
        date:        eventDate,
        location:    eventLocation,
        columns:     JSON.stringify(columns),
        authorEmail: currentUser?.email  || 'Guest',
        authorName:  currentUser?.name   || 'Guest',
        category:    projectData?.category || 'Lainnya',
        status:      'Aktif',
        updatedAt:   new Date().toISOString(),
        progress:    items.length > 0 ? Math.min(items.length * 10, 100) : 0,
      });
      alert('✅ Rundown berhasil disimpan!');
      onSaved?.();
    } catch (err: any) {
      alert('❌ Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?invite=${rundownId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('🔗 Link kolaborasi berhasil disalin ke clipboard!\n\nSiapa pun yang memiliki link ini bisa mengedit rundown ini.');
  };

  // ── Time calculation helpers ──────────────────────────────────────────────────
  const calculateTimes = (currentItems: RundownItem[]) => {
    return currentItems.map((item, i) => {
      const [h, m] = (item.startTime || '08:00').split(':').map(Number);
      const endMin = h * 60 + m + Number(item.duration || 0);
      const endTime = `${String(Math.floor(endMin / 60) % 24).padStart(2,'0')}:${String(endMin % 60).padStart(2,'0')}`;
      const nextStart = i < currentItems.length - 1 ? endTime : currentItems[i + 1]?.startTime;
      return { ...item, endTime, ...(nextStart && i < currentItems.length - 1 ? {} : {}) };
    }).map((item, i, arr) => ({
      ...item,
      startTime: i === 0 ? item.startTime : arr[i - 1].endTime,
    }));
  };

  const addItem = () => {
    const lastItem = items[items.length - 1];
    const startTime = lastItem?.endTime || projectData?.time || '08:00';
    const [h, m] = startTime.split(':').map(Number);
    const endMin = h * 60 + m + 15;
    const newItem: RundownItem = {
      id:        Math.random().toString(36).substr(2, 9),
      startTime,
      title:     '',
      duration:  15,
      endTime:   `${String(Math.floor(endMin / 60) % 24).padStart(2,'0')}:${String(endMin % 60).padStart(2,'0')}`,
    };
    columns.forEach(col => {
      if (!['id','startTime','endTime','title','duration'].includes(col.id)) newItem[col.id] = '';
    });
    setItems([...items, newItem]);
  };

  const deleteItem = (id: string) => setItems(calculateTimes(items.filter(i => i.id !== id)));

  const updateItem = (id: string, field: string, value: any) => {
    const updated = items.map(i => i.id === id ? { ...i, [field]: value } : i);
    setItems(field === 'duration' || field === 'startTime' ? calculateTimes(updated) : updated);
  };

  const addColumn = () => {
    const label = prompt('Nama kolom baru:');
    if (!label) return;
    const id = label.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    setColumns(prev => [...prev, { id, label, visible: true, locked: false }]);
    setItems(prev => prev.map(item => ({ ...item, [id]: '' })));
  };

  const removeColumn = (id: string) => {
    if (!confirm('Hapus kolom ini beserta isinya?')) return;
    setColumns(prev => prev.filter(c => c.id !== id));
  };

  const visibleCols = columns.filter(c => c.visible);

  // ── Word export ──────────────────────────────────────────────────────────────
  const exportWord = () => {
    const headerHtml = visibleCols.map(c => `<th style="border: 1px solid #000; padding: 8px; background-color: #f2f2f2; text-align: left;">${c.label}</th>`).join('');
    const rowsHtml = items.map(item => {
      const cells = visibleCols.map(col => {
        const val = col.id === 'time' ? `${item.startTime} - ${item.endTime}` : (item[col.id] || '');
        return `<td style="border: 1px solid #000; padding: 8px;">${val}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${initialTitle}</title></head>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="text-align: center; color: #1a2b4b;">${initialTitle}</h1>
        <table style="margin-bottom: 20px;">
          <tr><td><strong>Kategori:</strong></td><td>${projectData?.category || 'Lainnya'}</td></tr>
          <tr><td><strong>Tanggal:</strong></td><td>${eventDate}</td></tr>
          <tr><td><strong>Lokasi:</strong></td><td>${eventLocation}</td></tr>
        </table>
        <table style="border-collapse: collapse; width: 100%;">
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
      </html>
    `;

    // \ufeff is the BOM to ensure UTF-8 characters display correctly in Word
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement('a'), { href: url, download: `Rundown_${initialTitle}.doc` }).click();
  };

  // ── PDF export (Download) ──────────────────────────────────────────────────
  const exportPdfDownload = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #1a2b4b; margin-bottom: 20px;">${initialTitle}</h1>
        <table style="margin-bottom: 20px; font-size: 14px;">
          <tr><td style="padding-right: 20px;"><strong>Kategori:</strong></td><td>${projectData?.category || 'Lainnya'}</td></tr>
          <tr><td style="padding-right: 20px;"><strong>Tanggal:</strong></td><td>${eventDate}</td></tr>
          <tr><td style="padding-right: 20px;"><strong>Lokasi:</strong></td><td>${eventLocation}</td></tr>
        </table>
        <table style="border-collapse: collapse; width: 100%; font-size: 12px;">
          <thead>
            <tr>
              ${visibleCols.map(c => `<th style="border: 1px solid #000; padding: 8px; background-color: #f2f2f2; text-align: left;">${c.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                ${visibleCols.map(col => {
                  const val = col.id === 'time' ? `${item.startTime} - ${item.endTime}` : (item[col.id] || '');
                  return `<td style="border: 1px solid #000; padding: 8px;">${val}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '-9999px';
    element.style.width = '1200px';
    document.body.appendChild(element);

    const opt = {
      margin:       10,
      filename:     `Rundown_${initialTitle}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 1200 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
      }).catch((err: any) => {
        console.error("PDF generation error", err);
        document.body.removeChild(element);
      });
    } else {
      document.body.removeChild(element);
      alert("Library pembuat PDF belum termuat sempurna, silakan tunggu sebentar dan coba lagi.");
    }
  };

  // ── PDF export (Print directly) ──────────────────────────────────────────────────
  const exportPdfPrint = () => {
    const htmlContent = `
      <html>
      <head>
        <title>Print - ${initialTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #1a2b4b; margin-bottom: 20px; }
          .info-table { margin-bottom: 20px; font-size: 14px; }
          .info-table td { padding-right: 20px; padding-bottom: 5px; }
          .data-table { border-collapse: collapse; width: 100%; font-size: 12px; }
          .data-table th { border: 1px solid #000; padding: 8px; background-color: #f2f2f2; text-align: left; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .data-table td { border: 1px solid #000; padding: 8px; }
          @media print {
            @page { size: landscape; margin: 10mm; }
          }
        </style>
      </head>
      <body>
        <h1>${initialTitle}</h1>
        <table class="info-table">
          <tr><td><strong>Kategori:</strong></td><td>${projectData?.category || 'Lainnya'}</td></tr>
          <tr><td><strong>Tanggal:</strong></td><td>${eventDate}</td></tr>
          <tr><td><strong>Lokasi:</strong></td><td>${eventLocation}</td></tr>
        </table>
        <table class="data-table">
          <thead>
            <tr>
              ${visibleCols.map(c => `<th>${c.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                ${visibleCols.map(col => {
                  const val = col.id === 'time' ? `${item.startTime} - ${item.endTime}` : (item[col.id] || '');
                  return `<td>${val}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>
          window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 200); }
        </script>
      </body>
      </html>
    `;

    const printWin = window.open('', '', 'width=1000,height=800');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(htmlContent);
      printWin.document.close();
    } else {
      alert("Popup diblokir oleh browser. Izinkan popup untuk mencetak.");
    }
  };

  if (loadingExisting) return (
    <div className="flex items-center justify-center h-full py-32">
      <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-4 font-bold text-secondary">Memuat rundown dari Cloud...</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white border-b border-outline-variant gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary-container">
            <ImageIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">{initialTitle}</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-secondary flex items-center gap-2">
                <Clock size={12} />
                Kategori: {projectData?.category || 'Lainnya'}
              </p>
              <div className="flex -space-x-2 ml-4">
                {Object.entries(activeUsers).map(([email, info]: [string, any]) => {
                  const isOwner = email.replace(/_/g, '.') === projectOwner;
                  const isMe = email.replace(/_/g, '.') === currentUser?.email;
                  return (
                    <div 
                      key={email}
                      title={`${info.name} ${isOwner ? '(Pemilik)' : ''} ${isMe ? '(Anda)' : ''}`}
                      className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-transform hover:scale-110 hover:z-20 cursor-help relative`}
                      style={{ backgroundColor: info.color }}
                    >
                      {info.name?.charAt(0) || 'U'}
                      {isOwner && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 p-0.5 rounded-full border border-white" title="Pemilik Proyek">
                          <Shield size={8} className="text-white" />
                        </div>
                      )}
                      {isMe && (
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
            {[
              { id: 'edit',     label: 'List Editor', icon: Type      },
              { id: 'visual',   label: 'Visual',      icon: ImageIcon  },
              { id: 'settings', label: 'Settings',    icon: Settings   },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}
              >
                <tab.icon size={14} />{tab.label}
              </button>
            ))}
          </div>

          {/* Export dropdown */}
          <div className="relative group z-[100]">
            <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors shadow-sm bg-white">
              <Download className="w-5 h-5 text-secondary" />
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white border border-outline-variant rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden flex flex-col">
              <button onClick={exportWord} className="w-full text-left px-4 py-3 text-xs font-bold text-secondary hover:bg-surface-container flex items-center gap-2 border-b border-outline-variant transition-colors">
                <FileText size={14} className="text-blue-500" /> Download Word (.doc)
              </button>
              <button onClick={exportPdfDownload} className="w-full text-left px-4 py-3 text-xs font-bold text-secondary hover:bg-surface-container flex items-center gap-2 border-b border-outline-variant transition-colors">
                <FileCode size={14} className="text-red-500" /> Download PDF (.pdf)
              </button>
              <button onClick={exportPdfPrint} className="w-full text-left px-4 py-3 text-xs font-bold text-secondary hover:bg-surface-container flex items-center gap-2 transition-colors">
                <FileCode size={14} className="text-slate-500" /> Print Langsung (PDF)
              </button>
            </div>
          </div>

          <button onClick={handleShare}
            className="p-2 border border-primary-container/30 rounded-lg hover:bg-primary-container/5 transition-colors shadow-sm bg-white text-primary-container"
            title="Bagikan Link Kolaborasi"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button onClick={saveRundown} disabled={saving}
            className={`bg-primary-container text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              : <Save className="w-4 h-4" />
            }
            <span>{saving ? 'Menyimpan...' : isEditing ? 'Update Cloud' : 'Simpan Cloud'}</span>
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Column Config Panel */}
          <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm no-print">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center text-primary">
                  <Layout size={18} />
                </div>
                <h3 className="font-bold text-primary text-sm">Konfigurasi & Urutan Kolom</h3>
              </div>
              <button onClick={addColumn}
                className="flex items-center gap-2 px-4 py-2 bg-primary-container text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all active:scale-95"
              >
                <PlusCircle size={16} /> Tambah Kolom Baru
              </button>
            </div>

            <Reorder.Group axis="x" values={columns} onReorder={setColumns} className="flex flex-wrap gap-3">
              {columns.map(col => (
                <Reorder.Item key={col.id} value={col}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 cursor-move transition-all select-none ${col.visible ? 'border-primary-container bg-primary-container/5' : 'border-outline-variant'}`}
                >
                  <GripHorizontal size={14} className="text-outline-variant" />
                  <div onClick={() => setColumns(prev => prev.map(c => c.id === col.id ? {...c, visible: !c.visible} : c))}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer ${col.visible ? 'bg-primary-container border-primary-container' : 'border-outline-variant'}`}
                  >
                    {col.visible && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <input
                    type="text" value={col.label} disabled={col.locked}
                    onChange={e => setColumns(prev => prev.map(c => c.id === col.id ? {...c, label: e.target.value} : c))}
                    className="w-28 text-xs font-bold bg-transparent border-none p-0 focus:ring-0 outline-none text-primary placeholder:text-secondary"
                    placeholder="Nama kolom"
                  />
                  {!col.locked && (
                    <button onClick={e => { e.stopPropagation(); removeColumn(col.id); }} className="text-secondary hover:text-error ml-1 p-1 rounded hover:bg-white/50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <p className="text-[10px] text-secondary mt-3 italic">* Seret untuk mengubah urutan • Klik kotak untuk tampilkan/sembunyikan</p>
          </div>

          {/* Event Metadata */}
          <div className="flex flex-col md:flex-row gap-8 no-print bg-white p-6 rounded-3xl border border-outline-variant shadow-sm">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Tanggal Acara
              </label>
              <input type="text" value={eventDate} onChange={e => setEventDate(e.target.value)}
                className="w-full bg-transparent border-b-2 border-outline-variant px-0 py-2 text-base font-bold text-primary outline-none focus:border-primary-container transition-colors"
                placeholder="Contoh: 24 Mei 2026"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={14} /> Tempat Acara
              </label>
              <input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)}
                className="w-full bg-transparent border-b-2 border-outline-variant px-0 py-2 text-base font-bold text-primary outline-none focus:border-primary-container transition-colors"
                placeholder="Lokasi Acara"
              />
            </div>
          </div>

          {/* Print Table (hidden in browser) */}
          <table className="hidden">
            <thead>
              <tr>
                <th rowSpan={2}>Hari / Tanggal</th>
                <th colSpan={visibleCols.length}>{initialTitle}</th>
                <th rowSpan={2}>Tempat</th>
              </tr>
              <tr>{visibleCols.map(c => <th key={c.id}>{c.label}</th>)}</tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}>
                  {idx === 0 && <td rowSpan={items.length}>{eventDate}</td>}
                  {visibleCols.map(col => (
                    <td key={col.id}>{col.id === 'time' ? `${item.startTime} - ${item.endTime}` : (item[col.id] || '')}</td>
                  ))}
                  {idx === 0 && <td rowSpan={items.length}>{eventLocation}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Edit Tab ── */}
          {activeTab === 'edit' && (
            <div className="no-print overflow-x-auto pb-4">
              <div className="min-w-max space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-bold text-primary uppercase tracking-widest">
                    Detail Rundown ({items.length} item)
                  </h2>
                  <button onClick={addItem} className="text-xs font-bold text-primary-container flex items-center gap-1 hover:underline">
                    <Plus size={14} /> Tambah Baris
                  </button>
                </div>

                {/* Table Header & Rows Spreadsheet Style */}
                <div className="border border-outline-variant rounded-2xl overflow-hidden bg-white shadow-sm">
                  {/* Table Header */}
                  <div className="flex items-stretch bg-surface-container/30 border-b border-outline-variant">
                    <div className="w-12 shrink-0 border-r border-outline-variant flex items-center justify-center py-3">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">No</span>
                    </div>
                    {visibleCols.map(col => (
                      <div key={col.id} className="flex-1 min-w-[150px] px-4 py-3 border-r border-outline-variant last:border-r-0 text-[10px] font-bold text-secondary uppercase tracking-widest">
                        {col.label}
                      </div>
                    ))}
                    <div className="w-12 shrink-0 flex items-center justify-center py-3">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Act</span>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col">
                    {items.map((item, idx) => (
                      <Reorder.Item key={item.id} value={item}
                        className="group flex items-stretch bg-white border-b border-outline-variant last:border-b-0 hover:bg-primary-container/5 transition-all"
                      >
                        {/* Number / Drag Handle */}
                        <div className="w-12 shrink-0 border-r border-outline-variant flex items-center justify-center bg-surface-container/10 group-hover:bg-primary-container/10 cursor-grab relative">
                           <span className="text-xs font-bold text-secondary group-hover:opacity-0 absolute">{idx + 1}</span>
                           <GripVertical className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 absolute" />
                        </div>

                        {/* Cells */}
                        {visibleCols.map(col => (
                          <div key={col.id} className="flex-1 min-w-[150px] border-r border-outline-variant last:border-r-0 px-4 py-2 flex items-center focus-within:bg-white focus-within:ring-1 focus-within:ring-primary-container focus-within:z-10 relative">
                            {col.id === 'duration' ? (
                              <div className="flex items-center gap-2 w-full">
                                <input type="number" value={item[col.id] || 0}
                                  onChange={e => updateItem(item.id, col.id, parseInt(e.target.value) || 0)}
                                  className="w-16 text-sm font-medium text-primary bg-transparent outline-none text-right"
                                />
                                <span className="text-[10px] font-bold text-secondary">Min</span>
                              </div>
                            ) : (
                              <input type="text"
                                value={col.id === 'time' ? item.startTime : (item[col.id] || '')}
                                onFocus={() => setFocusedCell({ id: item.id, field: col.id === 'time' ? 'startTime' : col.id })}
                                onBlur={() => setFocusedCell(null)}
                                onChange={e => updateItem(item.id, col.id === 'time' ? 'startTime' : col.id, e.target.value)}
                                placeholder={col.label}
                                className={`w-full text-sm bg-transparent outline-none ${col.id === 'time' ? 'font-bold text-primary' : 'font-medium text-primary'}`}
                              />
                            )}
                          </div>
                        ))}

                        {/* Action */}
                        <div className="w-12 shrink-0 flex items-center justify-center">
                          <button onClick={() => deleteItem(item.id)}
                            className="p-2 text-outline-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                            title="Hapus Baris"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>

                {items.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-outline-variant">
                    <Plus className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                    <p className="text-secondary font-bold text-sm">Belum ada item rundown</p>
                    <button onClick={addItem} className="mt-4 text-xs font-bold text-primary-container underline">
                      + Tambah Baris Pertama
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Visual Tab ── */}
          {activeTab === 'visual' && (
            <div className="no-print relative pl-8">
              <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-container/40 to-transparent"></div>
              {items.length === 0 && (
                <p className="text-secondary text-sm text-center py-16">Tambah item dulu di tab List Editor.</p>
              )}
              {items.map(item => (
                <div key={item.id} className="relative flex gap-12 pb-10 group">
                  <div className="w-20 text-right pt-1 shrink-0">
                    <p className="text-sm font-black text-primary">{item.startTime}</p>
                    <p className="text-[10px] font-bold text-secondary uppercase">{item.duration} Min</p>
                  </div>
                  <div className="absolute left-[31px] top-2 w-4 h-4 rounded-full bg-white border-4 border-primary-container shadow-sm z-10 group-hover:scale-125 transition-transform"></div>
                  <div className="flex-1 bg-white p-5 rounded-2xl border border-outline-variant hover:border-primary-container transition-all hover:shadow-md">
                    <h3 className="font-bold text-primary text-base">{item.title || '(Tanpa judul)'}</h3>
                    {visibleCols.filter(c => !['time','title','duration'].includes(c.id)).map(col => (
                      item[col.id] ? (
                        <p key={col.id} className="text-xs text-secondary mt-1">
                          <span className="font-bold">{col.label}:</span> {item[col.id]}
                        </p>
                      ) : null
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Settings Tab ── */}
          {activeTab === 'settings' && (
            <div className="no-print bg-white p-12 rounded-[2.5rem] border border-outline-variant text-center">
              <Settings className="w-16 h-16 text-outline-variant mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-primary">Project Settings</h2>
              <p className="text-secondary mt-2 max-w-sm mx-auto text-sm">
                Pengaturan kolaborasi dan visibilitas project akan segera tersedia.
              </p>
              <div className="mt-6 p-4 bg-surface-container rounded-2xl text-left space-y-2 max-w-sm mx-auto">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Info Rundown</p>
                <p className="text-sm text-primary"><span className="font-bold">ID:</span> {rundownId}</p>
                <p className="text-sm text-primary"><span className="font-bold">Pembuat:</span> {currentUser?.name || 'Guest'}</p>
                <p className="text-sm text-primary"><span className="font-bold">Email:</span> {currentUser?.email || '-'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
