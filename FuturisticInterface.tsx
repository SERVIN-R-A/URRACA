// components/FuturisticInterface.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useUserPreferences from '../utils/userPreferences';
import HolographicBackground from './HolographicBackground';
import PersonalizationBar from './PersonalizationBar';
import AdvancedForm from './AdvancedForm';
import ResponseArea from './ResponseArea';
import EvolutionPanel from './EvolutionPanel';
import ScenarioSimulator from './ScenarioSimulator';
import MultimodalInterface from './MultimodalInterface';

interface AIResponse {
  message: string;
  role: string;
}

const FuturisticInterface: React.FC = () => {
  const [personalizationLevel, setPersonalizationLevel] = useState(0);
  const [currentScenario, setCurrentScenario] = useState('default');
  const [multimodalInput, setMultimodalInput] = useState('');
  const preferences = useUserPreferences();

  useEffect(() => {
    const fetchInitialData = async () => {
      const response = await axios.get('/api/database/initialize');
      console.log('Initial data fetched:', response.data);
    };
    fetchInitialData();
  }, []);

  const processUserInput = async (input: string) => {
    try {
      const result = await axios.post<AIResponse>(
        '/api/chat/completions',
        { role: 'user', content: input }
      );
      return result.data;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      throw error;
    }
  };

  const getCustomizedResponse = async (input: string) => {
    try {
      const result = await processUserInput(input);
      return `Respuesta personalizada para ${preferences.language}:`;
    } catch (error) {
      console.error('Error generating customized response:', error);
      throw error;
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-purple-800 to-indigo-900">
      {/* Fondo holográfico */}
      <HolographicBackground />

      {/* Barra de estado personalizado */}
      <PersonalizationBar level={personalizationLevel} />

      {/* Formulario avanzado */}
      <AdvancedForm onSubmit={(input) => getCustomizedResponse(input)} />

      {/* Área de respuesta */}
      <ResponseArea response={getCustomizedResponse(multimodalInput)} />

      {/* Panel de evolución */}
      <EvolutionPanel currentScenario={currentScenario} />

      {/* Simulador de escenarios futuristas */}
      <ScenarioSimulator setCurrentScenario={setCurrentScenario} />

      {/* Interfaz multimodal */}
      <MultimodalInterface input={multimodalInput} setMultimodalInput={setMultimodalInput} />
    </div>
  );
};

export default FuturisticInterface;
