import React, { useState, useEffect, useRef } from 'react';

function LicenseKeyInput({ onValidation }) {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const validKey = '윤시훈바보'; // 정답 키

  // 컴포넌트 마운트 시 입력 필드에 포커스
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    // 제출 중 상태로 변경
    setIsSubmitting(true);
    
    // 애니메이션 효과를 위한 타이머
    setTimeout(() => {
      if (licenseKey === validKey) {
        onValidation(true);
        setError(false);
      } else {
        setError(true);
        onValidation(false);
        
        // 에러가 발생하면 입력 필드 흔들기
        if (inputRef.current) {
          inputRef.current.classList.add('error');
          setTimeout(() => {
            inputRef.current?.classList.remove('error');
          }, 500);
        }
      }
      setIsSubmitting(false);
    }, 600);
  };

  // 엔터 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <div>
      <h2>윤시훈을 위한 웹사이트</h2>
      <input
        ref={inputRef}
        type="text"
        value={licenseKey}
        onChange={(e) => {
          setLicenseKey(e.target.value);
          if (error) setError(false);
        }}
        onKeyPress={handleKeyPress}
        placeholder="키를 입력하세요"
        className={error ? 'error' : ''}
        disabled={isSubmitting}
      />
      {error && (
        <p className="error-message">라이선스 키가 틀렸습니다.</p>
      )}
      <button 
        onClick={handleSubmit} 
        disabled={isSubmitting || licenseKey.trim() === ''}
      >
        <span>
          {isSubmitting ? '처리 중...' : '확인'}
        </span>
      </button>
    </div>
  );
}

export default LicenseKeyInput;