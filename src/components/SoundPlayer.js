import React, { useState, useRef, useEffect } from 'react';

function SoundPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentSound, setCurrentSound] = useState('');
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const getRandomSound = () => {
    const sounds = ['1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3', "7.mp3"];
    const randomIndex = Math.floor(Math.random() * sounds.length);
    return `/audio/${sounds[randomIndex]}`;
  };

  const handlePlayClick = () => {
    setIsButtonAnimating(true);
    setTimeout(() => {
      setShowModal(true);
      setIsButtonAnimating(false);
    }, 300);
  };

  const handlePlaySound = (confirmed) => {
    setShowModal(false);
    
    if (confirmed) {
      const soundPath = getRandomSound();
      setCurrentSound(soundPath);
      
      if (audioRef.current) {
        audioRef.current.src = soundPath;
        
        // 재생 시작 타이머 (로딩 시각화용)
        setTimeout(() => {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              
              // 진행률 표시 타이머 설정
              progressIntervalRef.current = setInterval(() => {
                if (audioRef.current && audioRef.current.duration) {
                  const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                  setPlaybackProgress(progress);
                }
              }, 100);
            })
            .catch((error) => {
              console.error("Error playing sound:", error);
              alert("소리 재생 중 오류가 발생했습니다.");
              setIsPlaying(false);
              setPlaybackProgress(0);
            });
        }, 500);
      }
    } else {
      // 사용자 피드백을 위한 약간의 지연
      setTimeout(() => {
        alert('헤드셋을 착용하고 오세요!');
      }, 300);
    }
  };

  // 재생 종료 시 정리
  const handleSoundEnd = () => {
    setIsPlaying(false);
    setPlaybackProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div>
      <h2>윤시훈을 위한 웹사이트</h2>
      
      {/* 재생 버튼 */}
      <button 
        onClick={handlePlayClick} 
        disabled={isPlaying}
        className={isButtonAnimating ? 'animate' : ''}
      >
        <span>
          {isPlaying ? '재생 중...' : '소리 듣기'}
          {isPlaying && '🔊'}
        </span>
      </button>
      
      {/* 진행률 표시줄 */}
      {isPlaying && (
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${playbackProgress}%` }}
          ></div>
          <style jsx>{`
            .progress-container {
              width: 85%;
              height: 6px;
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 3px;
              margin: 20px auto 0;
              overflow: hidden;
              position: relative;
            }
            .progress-bar {
              height: 100%;
              background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
              border-radius: 3px;
              transition: width 0.1s linear;
              box-shadow: 0 0 10px rgba(100, 17, 203, 0.5);
              position: relative;
            }
            .progress-bar::after {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              height: 100%;
              width: 8px;
              background-color: rgba(255, 255, 255, 0.8);
              border-radius: 50%;
              box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
            }
          `}</style>
        </div>
      )}
      
      {/* 현재 재생 중인 음원 표시 */}
      {isPlaying && currentSound && (
        <p className="now-playing">
          재생 중: {currentSound.split('/').pop()}
          <span className="equalizer">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </span>
          <style jsx>{`
            .now-playing {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              margin-top: 16px;
              font-size: 1.1rem;
              color: var(--text-secondary);
            }
            .equalizer {
              display: flex;
              align-items: flex-end;
              height: 20px;
              gap: 3px;
            }
            .bar {
              width: 3px;
              background: linear-gradient(to top, var(--primary-color), var(--secondary-color));
              border-radius: 3px;
              animation: equalize 1s ease-in-out infinite;
            }
            .bar:nth-child(1) {
              animation-delay: 0.2s;
              height: 30%;
            }
            .bar:nth-child(2) {
              animation-delay: 0.4s;
              height: 80%;
            }
            .bar:nth-child(3) {
              animation-delay: 0.6s;
              height: 60%;
            }
            .bar:nth-child(4) {
              animation-delay: 0.1s;
              height: 40%;
            }
            @keyframes equalize {
              0%, 100% { transform: scaleY(0.3); }
              50% { transform: scaleY(1); }
            }
          `}</style>
        </p>
      )}
      
      {/* 이전 재생 기록 */}
      {!isPlaying && currentSound && (
        <p className="last-played">
          마지막 재생: {currentSound.split('/').pop()}
          <style jsx>{`
            .last-played {
              margin-top: 16px;
              font-size: 1rem;
              color: var(--text-muted);
              opacity: 0.7;
            }
          `}</style>
        </p>
      )}
      
      <audio 
        ref={audioRef} 
        onEnded={handleSoundEnd} 
      />

      {/* 헤드셋 착용 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>헤드셋을 착용하셨습니까?</p>
            <div className="modal-buttons">
              <button onClick={() => handlePlaySound(true)}>
                <span>예</span>
              </button>
              <button onClick={() => handlePlaySound(false)}>
                <span>아니오</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 추가 CSS 스타일 */}
      <style jsx>{`
        /* 버튼 애니메이션 효과 */
        .animate {
          animation: pulse 0.3s ease;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        
        /* 재생 버튼 추가 스타일 */
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default SoundPlayer;