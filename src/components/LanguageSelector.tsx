import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Globe } from 'lucide-react'

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-2 border border-gray-700/50">
        <Globe className="w-4 h-4 text-gray-400" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'id' | 'en')}
          className="bg-transparent text-gray-300 text-sm focus:outline-none cursor-pointer"
        >
          <option value="id" className="bg-gray-800 text-gray-300">🇮🇩 Indonesia</option>
          <option value="en" className="bg-gray-800 text-gray-300">🇺🇸 English</option>
        </select>
      </div>
    </div>
  )
}