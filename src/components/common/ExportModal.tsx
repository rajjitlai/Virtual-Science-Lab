import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    type: 'chemistry' | 'physics';
}

export const ExportModal = ({ isOpen, onClose, data, type }: ExportModalProps) => {
    const { showToast } = useToast();
    const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json');
    const [includeImages, setIncludeImages] = useState(false);

    const generateExportData = () => {
        const timestamp = new Date().toISOString();
        const baseData = {
            type,
            timestamp,
            data,
            metadata: {
                version: '1.0.0',
                exportedAt: timestamp,
                includeImages
            }
        };

        switch (exportFormat) {
            case 'json':
                return JSON.stringify(baseData, null, 2);

            case 'csv':
                if (type === 'chemistry') {
                    const chemicals = data.selectedChemicals || [];
                    const csvHeaders = ['Name', 'Formula', 'Color', 'State', 'pH', 'Flammable'];
                    const csvRows = chemicals.map((chem: any) => [
                        chem.name,
                        chem.formula,
                        chem.color,
                        chem.state,
                        chem.pH,
                        chem.flammable ? 'Yes' : 'No'
                    ]);
                    return [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
                } else {
                    const objects = data.objects || [];
                    const csvHeaders = ['Type', 'Position', 'Mass', 'Color', 'Size'];
                    const csvRows = objects.map((obj: any) => [
                        obj.type,
                        `(${obj.position?.join(', ') || 'N/A'})`,
                        obj.mass || 'N/A',
                        obj.color || 'N/A',
                        obj.size || 'N/A'
                    ]);
                    return [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
                }

            case 'pdf':
                // For PDF, we'll create a simple HTML structure that can be printed
                return `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Virtual Science Lab Export - ${type}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .section { margin-bottom: 20px; }
                            .data-table { width: 100%; border-collapse: collapse; }
                            .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            .data-table th { background-color: #f2f2f2; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>Virtual Science Lab Export</h1>
                            <h2>${type === 'chemistry' ? 'Chemistry Experiment' : 'Physics Simulation'}</h2>
                            <p>Exported on: ${new Date().toLocaleString()}</p>
                        </div>
                        <div class="section">
                            <h3>Experiment Data</h3>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    </body>
                    </html>
                `;

            default:
                return JSON.stringify(baseData, null, 2);
        }
    };

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], {
            type: exportFormat === 'json' ? 'application/json' :
                exportFormat === 'csv' ? 'text/csv' : 'text/html'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExport = () => {
        try {
            const content = generateExportData();
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `virtual-science-lab-${type}-${timestamp}.${exportFormat}`;

            downloadFile(content, filename);
            showToast(`Exported successfully as ${filename}`, 'success');
            onClose();
        } catch (error) {
            console.error('Export error:', error);
            showToast('Export failed. Please try again.', 'error');
        }
    };

    const handleShare = async () => {
        try {
            const shareData = {
                title: `Virtual Science Lab - ${type} Experiment`,
                text: `Check out my ${type} experiment from Virtual Science Lab!`,
                url: window.location.href
            };

            if (navigator.share) {
                await navigator.share(shareData);
                showToast('Shared successfully!', 'success');
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!', 'success');
            }
        } catch (error) {
            console.error('Share error:', error);
            showToast('Share failed. Please try again.', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            📤 Export Experiment
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Export Format */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Export Format
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'json', label: 'JSON', icon: '📄' },
                                { value: 'csv', label: 'CSV', icon: '📊' },
                                { value: 'pdf', label: 'PDF', icon: '📋' }
                            ].map((format) => (
                                <button
                                    key={format.value}
                                    onClick={() => setExportFormat(format.value as any)}
                                    className={`p-3 border-2 rounded-lg transition-all ${exportFormat === format.value
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{format.icon}</div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                                        {format.label}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Options */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Export Options
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={includeImages}
                                    onChange={(e) => setIncludeImages(e.target.checked)}
                                    className="mr-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Include experiment images
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Preview
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
                            {exportFormat === 'json' && '{"type":"' + type + '","timestamp":"' + new Date().toISOString() + '",...}'}
                            {exportFormat === 'csv' && 'Name,Formula,Color,State,pH,Flammable\nWater,H2O,#00aaff,Liquid,7,No'}
                            {exportFormat === 'pdf' && '<!DOCTYPE html><html><head><title>Virtual Science Lab Export</title>...'}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                            Download
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                            Share
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
