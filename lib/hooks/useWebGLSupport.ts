// lib/hooks/useWebGLSupport.ts
import { useState, useEffect } from 'react';

export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') 
             || canvas.getContext('webgl');
    setSupported(!!gl);
  }, []);

  return supported;
}