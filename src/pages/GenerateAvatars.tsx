import React, { useEffect, useRef } from 'react';
import { generateAvatar } from '../utils/generateAvatars';

const GenerateAvatars: React.FC = () => {
  const mikeCanvasRef = useRef<HTMLCanvasElement>(null);
  const carsonCanvasRef = useRef<HTMLCanvasElement>(null);
  const avaCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mikeCanvasRef.current) {
      generateAvatar(mikeCanvasRef.current, 'mike');
    }
    if (carsonCanvasRef.current) {
      generateAvatar(carsonCanvasRef.current, 'carson');
    }
    if (avaCanvasRef.current) {
      generateAvatar(avaCanvasRef.current, 'ava');
    }
  }, []);

  const downloadAvatar = (canvas: HTMLCanvasElement | null, name: string) => {
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${name}-avatar.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a202c',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px'
    }}>
      <h1 style={{ color: '#ff6b35', fontSize: '32px', marginBottom: '20px' }}>
        Character Avatars
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '40px',
        maxWidth: '800px'
      }}>
        {/* Mike */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#8B4513', marginBottom: '10px' }}>Mike</h2>
          <canvas 
            ref={mikeCanvasRef} 
            style={{ 
              border: '3px solid #8B4513',
              borderRadius: '10px',
              backgroundColor: '#fff'
            }}
          />
          <br />
          <button 
            onClick={() => downloadAvatar(mikeCanvasRef.current, 'mike')}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Download Mike
          </button>
          <p style={{ color: '#fff', marginTop: '10px', fontSize: '14px' }}>
            Fitness enthusiast with brown hair and green eyes
          </p>
        </div>

        {/* Carson */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#4169E1', marginBottom: '10px' }}>Carson</h2>
          <canvas 
            ref={carsonCanvasRef} 
            style={{ 
              border: '3px solid #4169E1',
              borderRadius: '10px',
              backgroundColor: '#fff'
            }}
          />
          <br />
          <button 
            onClick={() => downloadAvatar(carsonCanvasRef.current, 'carson')}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#4169E1',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Download Carson
          </button>
          <p style={{ color: '#fff', marginTop: '10px', fontSize: '14px' }}>
            Athletic champion with blonde hair and blue eyes
          </p>
        </div>

        {/* Ava */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#D2691E', marginBottom: '10px' }}>Ava</h2>
          <canvas 
            ref={avaCanvasRef} 
            style={{ 
              border: '3px solid #D2691E',
              borderRadius: '10px',
              backgroundColor: '#fff'
            }}
          />
          <br />
          <button 
            onClick={() => downloadAvatar(avaCanvasRef.current, 'ava')}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#D2691E',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Download Ava
          </button>
          <p style={{ color: '#fff', marginTop: '10px', fontSize: '14px' }}>
            Yoga instructor with auburn hair and hazel eyes
          </p>
        </div>
      </div>

      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#2d3748',
        borderRadius: '10px',
        maxWidth: '600px'
      }}>
        <h3 style={{ color: '#ff6b35', marginBottom: '10px' }}>Instructions:</h3>
        <ol style={{ color: '#fff', lineHeight: '1.8' }}>
          <li>Click the download button under each avatar to save it</li>
          <li>Move the downloaded files to <code>/public/lovable-uploads/</code></li>
          <li>Update the image paths in <code>Index.tsx</code> with the actual filenames</li>
          <li>Remove the placeholder.svg references</li>
        </ol>
      </div>

      <button
        onClick={() => window.location.href = '/'}
        style={{
          padding: '15px 30px',
          backgroundColor: '#ff6b35',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '18px',
          marginTop: '20px'
        }}
      >
        Back to Game
      </button>
    </div>
  );
};

export default GenerateAvatars;