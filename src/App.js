import React, { useState, useEffect } from 'react';
import LicenseKeyInput from './components/LicenseKeyInput';
import SoundPlayer from './components/SoundPlayer';
import './App.css';

function App() {
  const [isLicenseValid, setIsLicenseValid] = useState(false);

  const handleLicenseValidation = (isValid) => {
    setIsLicenseValid(isValid);
  };

  // 배경 효과 생성
  useEffect(() => {
    const backgroundElement = document.querySelector('.background');
    
    // 별 생성
    const createStars = () => {
      const starsCount = 200;
      for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // 랜덤 위치 및 크기
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        // 애니메이션 지연
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        backgroundElement.appendChild(star);
      }
    };
    
    // 유성우 생성
    const createShootingStars = () => {
      const shootingStarsCount = 5;
      for (let i = 0; i < shootingStarsCount; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        
        // 크기 설정
        const size = 2 + Math.random() * 2;
        shootingStar.style.width = `${size}px`;
        shootingStar.style.height = `${70 + Math.random() * 30}px`;
        
        // 애니메이션 속도와 지연
        const duration = 1 + Math.random() * 3;
        shootingStar.style.animationDuration = `${duration}s`;
        shootingStar.style.animationDelay = `${Math.random() * 15}s`;
        
        backgroundElement.appendChild(shootingStar);
      }
    };
    
    // 글로우 효과 추가
    const createGlowEffects = () => {
      const glowPositions = [
        { top: '20%', left: '20%' },
        { top: '70%', left: '15%' },
        { top: '30%', left: '80%' },
        { top: '80%', left: '70%' }
      ];
      
      glowPositions.forEach((pos, index) => {
        const glow = document.createElement('div');
        glow.classList.add('glow');
        glow.style.top = pos.top;
        glow.style.left = pos.left;
        glow.style.animationDelay = `${index * 2}s`;
        backgroundElement.appendChild(glow);
      });
    };
    
    // 효과 초기화
    if (backgroundElement) {
      backgroundElement.innerHTML = '';
      createStars();
      createShootingStars();
      createGlowEffects();
    }
    
    // 새로운 유성우 주기적으로 생성
    const shootingStarInterval = setInterval(() => {
      const existingStars = document.querySelectorAll('.shooting-star');
      if (existingStars.length < 10) {  // 최대 10개 제한
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        
        const size = 2 + Math.random() * 2;
        shootingStar.style.width = `${size}px`;
        shootingStar.style.height = `${70 + Math.random() * 30}px`;
        
        const duration = 1 + Math.random() * 3;
        shootingStar.style.animationDuration = `${duration}s`;
        
        backgroundElement.appendChild(shootingStar);
        
        // 애니메이션 종료 후 요소 제거
        setTimeout(() => {
          shootingStar.remove();
        }, duration * 1000);
      }
    }, 3000);
    
    return () => {
      clearInterval(shootingStarInterval);
    };
  }, []);

  return (
    <div className="App">
      <div className="card">
        {!isLicenseValid ? (
          <LicenseKeyInput onValidation={handleLicenseValidation} />
        ) : (
          <SoundPlayer />
        )}
      </div>
      <div className="background"></div>
    </div>
  );
}

export default App;