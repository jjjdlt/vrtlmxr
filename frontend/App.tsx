import React from 'react';
import AudioFileUpload from '/src/components/audioFileUpload';
import { AudioService } from '/src/services/audioService';
import { uploadFile } from '/src/services/apiService';

const App: React.FC = () => {
    const audioService = new AudioService();

    const handleFileUpload = async (file: File) => {
        try {
            await uploadFile(file);

            await audioService.initialize();
            await audioService.createAudioSource(file);
        } catch (error) {
            console.error('Error handling file:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Audio Mixer</h1>
                <AudioFileUpload onFileUpload={handleFileUpload} />
            </div>
        </div>
    );
};

export default App;